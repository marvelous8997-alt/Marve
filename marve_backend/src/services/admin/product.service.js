"use strict";

const { sequelize } = require("../../database/models");
const {
  adminProductRepository,
  adminProductImageRepository,
  adminCategoryRepository,
  adminSubcategoryRepository,
} = require("../../repositories");
const {
  uploadToCloudinary,
  deleteCloudinaryFile,
} = require("../../helpers/cloudinary.helper");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");

const isDuplicateError = (error) =>
  error.name === "SequelizeUniqueConstraintError";

const normalizeBoolean = (value) =>
  value === true ||
  value === "true" ||
  value === 1 ||
  value === "1";

const cleanupUploadedFiles = async (files) => {
  for (const file of files) {
    try {
      await deleteCloudinaryFile(file.url, file.resourceType);
    } catch (error) {
      logger.error(error);
    }
  }
};

const deleteOldFiles = async (files) => {
  await cleanupUploadedFiles(files);
};

const getImageFiles = (files) => {
  if (!files) return [];
  if (Array.isArray(files.images)) {
    return files.images;
  }
  if (files.images) {
    return [files.images];
  }
  return [];
};

const getVideoFile = (files) => {
  if (!files) return null;
  if (Array.isArray(files.video)) {
    return files.video[0] || null;
  }
  return files.video || null;
};

const parseImageManifest = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  let manifest;
  try {
    manifest = JSON.parse(value);
  } catch {
    throw new ApiError(400, "Invalid product image metadata.");
  }
  if (!Array.isArray(manifest)) {
    throw new ApiError(400, "Invalid product image metadata.");
  }
  return manifest.map((item) => {
    if (
      !item ||
      !["existing", "new"].includes(item.kind) ||
      !Number.isInteger(Number(item.sort_order)) ||
      Number(item.sort_order) < 0 ||
      typeof item.is_primary !== "boolean"
    ) {
      throw new ApiError(400, "Invalid product image metadata.");
    }
    if (
      item.kind === "existing" &&
      !String(item.identifier ?? "").trim()
    ) {
      throw new ApiError(400, "An existing image identifier is missing.");
    }
    if (
      item.kind === "new" &&
      (
        item.file_index === undefined ||
        !Number.isInteger(Number(item.file_index)) ||
        Number(item.file_index) < 0
      )
    ) {
      throw new ApiError(400, "Invalid new image reference.");
    }
    return {
      kind: item.kind,
      identifier:
        item.kind === "existing"
          ? String(item.identifier)
          : undefined,
      file_index:
        item.kind === "new"
          ? Number(item.file_index)
          : undefined,
      sort_order: Number(item.sort_order),
      is_primary: item.is_primary,
      alt_text:
        typeof item.alt_text === "string"
          ? item.alt_text
          : undefined,
    };
  });
};

const normalizeImageManifest = (manifest) => {
  if (manifest === null) {
    return null;
  }
  const primaryIndex = manifest.findIndex(
    (item) => item.is_primary,
  );
  return manifest.map((item, index) => ({
    ...item,
    is_primary:
      manifest.length > 0 &&
      index === (primaryIndex === -1 ? 0 : primaryIndex),
  }));
};

const validateCategoryAndSubcategory = async (
  categoryId,
  subcategoryId
) => {
  if (!categoryId) {
    throw new ApiError(400, "Product category is required.");
  }
  if (!subcategoryId) {
    throw new ApiError(400, "Product subcategory is required.");
  }
  const category = await adminCategoryRepository.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found.");
  }
  const subcategory = await adminSubcategoryRepository.findById(
    subcategoryId
  );
  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found.");
  }
  if (String(subcategory.category_id) !== String(categoryId)) {
    throw new ApiError(
      400,
      "Selected subcategory does not belong to the selected category."
    );
  }
  return { category, subcategory };
};

const validateProductFields = (payload, { isUpdate = false } = {}) => {
  if (!isUpdate || payload.name !== undefined) {
    if (typeof payload.name !== "string" || !payload.name.trim()) {
      throw new ApiError(400, "Product name is required.");
    }
    payload.name = payload.name.trim();
  }
  if (!isUpdate || payload.slug !== undefined) {
    if (typeof payload.slug !== "string" || !payload.slug.trim()) {
      throw new ApiError(400, "Product slug is required.");
    }
    payload.slug = payload.slug.trim();
  }
  if (payload.status !== undefined) {
    if (!["ACTIVE", "INACTIVE"].includes(payload.status)) {
      throw new ApiError(400, "Invalid product status.");
    }
  }
  if (payload.price !== undefined) {
    const price = Number(payload.price);
    if (!Number.isFinite(price) || price < 0) {
      throw new ApiError(400, "Product price must be a valid non-negative number.");
    }
    payload.price = price;
  }
  if (payload.compare_at_price !== undefined && payload.compare_at_price !== null && payload.compare_at_price !== "") {
    const compareAtPrice = Number(payload.compare_at_price);
    if (!Number.isFinite(compareAtPrice) || compareAtPrice < 0) {
      throw new ApiError(400, "Compare-at price must be a valid non-negative number.");
    }
    payload.compare_at_price = compareAtPrice;
  }
  if (payload.stock !== undefined) {
    const stock = Number(payload.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      throw new ApiError(400, "Stock must be a non-negative integer.");
    }
    payload.stock = stock;
  }
  // Validate product dimensions
  const dimensionFields = ["height", "width", "length"];

  for (const field of dimensionFields) {
    if (
      payload[field] !== undefined &&
      payload[field] !== null &&
      payload[field] !== ""
    ) {
      const value = Number(payload[field]);

      if (!Number.isFinite(value) || value < 0) {
        throw new ApiError(
          400,
          `Product ${field} must be a valid non-negative number.`
        );
      }

      payload[field] = value;
    } else if (
      payload[field] === "" ||
      payload[field] === null
    ) {
      payload[field] = null;
    }
  }

  // Validate product weight
  if (
    payload.weight !== undefined &&
    payload.weight !== null &&
    payload.weight !== ""
  ) {
    const weight = Number(payload.weight);

    if (!Number.isFinite(weight) || weight < 0) {
      throw new ApiError(
        400,
        "Product weight must be a valid non-negative number."
      );
    }

    payload.weight = weight;
  } else if (
    payload.weight === "" ||
    payload.weight === null
  ) {
    payload.weight = null;
  }

  // Validate dimension unit
  if (payload.dimension_unit !== undefined) {
    if (typeof payload.dimension_unit !== "string") {
      throw new ApiError(400, "Invalid dimension unit.");
    }

    const dimensionUnit = payload.dimension_unit.trim().toLowerCase();

    const allowedDimensionUnits = ["mm", "cm", "m", "in", "ft"];

    if (!allowedDimensionUnits.includes(dimensionUnit)) {
      throw new ApiError(
        400,
        "Dimension unit must be mm, cm, m, in, or ft."
      );
    }

    payload.dimension_unit = dimensionUnit;
  }

  // Validate weight unit
  if (payload.weight_unit !== undefined) {
    if (typeof payload.weight_unit !== "string") {
      throw new ApiError(400, "Invalid weight unit.");
    }

    const weightUnit = payload.weight_unit.trim().toLowerCase();

    const allowedWeightUnits = ["g", "kg", "mg", "lb", "oz"];

    if (!allowedWeightUnits.includes(weightUnit)) {
      throw new ApiError(
        400,
        "Weight unit must be g, kg, mg, lb, or oz."
      );
    }

    payload.weight_unit = weightUnit;
  }
  if (payload.sort_order !== undefined) {
    const sortOrder = Number(payload.sort_order);
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      throw new ApiError(400, "Sort order must be a non-negative integer.");
    }
    payload.sort_order = sortOrder;
  }
  const booleanFields = [
    "featured",
    "is_new_arrival",
    "is_bestseller",
    "is_sale",
    "is_offer",
    "is_gift",
  ];
  for (const field of booleanFields) {
    if (payload[field] !== undefined) {
      payload[field] = normalizeBoolean(payload[field]);
    }
  }
};

// CREATE PRODUCT
const createProduct = async (payload, files, userId) => {
  const transaction = await sequelize.transaction();
  const uploadedFiles = [];
  try {
    const data = { ...payload };

    const imageManifest = normalizeImageManifest(
  parseImageManifest(data.image_manifest),
);

delete data.image_manifest;
    validateProductFields(data);
    const categoryId = data.category_id;
    const subcategoryId = data.subcategory_id;
    await validateCategoryAndSubcategory(categoryId, subcategoryId);
    const existingName = await adminProductRepository.findByName(
      data.name,
      categoryId
    );
    if (existingName) {
      throw new ApiError(409, "Product name already exists in this category.");
    }

    const existingSlug = await adminProductRepository.findBySlug(data.slug);
    if (existingSlug) {
      throw new ApiError(409, "Product slug already exists.");
    }

    if (data.sku) {
      const existingSku = await adminProductRepository.findBySku(data.sku);
      if (existingSku) {
        throw new ApiError(409, "Product SKU already exists.");
      }
    }

    const imageFiles = getImageFiles(files);
    const videoFile = getVideoFile(files);

    // Upload images
    const imagePayloads = [];

    if (imageManifest !== null) {
      if (imageManifest.some((item) => item.kind !== "new")) {
        throw new ApiError(
          400,
          "New products cannot reference existing product images.",
        );
      }

  const usedIndexes = new Set();

  for (const item of imageManifest) {
    const fileIndex = item.file_index;
    const file = imageFiles[fileIndex];

    if (!file || usedIndexes.has(fileIndex)) {
      throw new ApiError(400, "Invalid product image selection.");
    }

    usedIndexes.add(fileIndex);

    const result = await uploadToCloudinary(file, {
      folder: "marve/products/images",
      resourceType: "image",
    });

    uploadedFiles.push({
      url: result.secure_url,
      resourceType: "image",
    });

    imagePayloads.push({
      image_url: result.secure_url,
      alt_text: item.alt_text || file.originalname || data.name,
      is_primary: item.is_primary,
      sort_order: item.sort_order,
    });
  }

    if (usedIndexes.size !== imageFiles.length) {
      throw new ApiError(400, "Some uploaded images are missing metadata.");
    }
  } else {
    for (let index = 0; index < imageFiles.length; index += 1) {
      const file = imageFiles[index];

      const result = await uploadToCloudinary(file, {
        folder: "marve/products/images",
        resourceType: "image",
      });

      uploadedFiles.push({
        url: result.secure_url,
        resourceType: "image",
      });

      imagePayloads.push({
        image_url: result.secure_url,
        alt_text: file.originalname || data.name,
        is_primary: index === 0,
        sort_order: index,
      });
    }
  }
    // Upload at most one video
    if (videoFile) {
      const result = await uploadToCloudinary(videoFile, {
        folder: "marve/products/videos",
        resourceType: "video",
      });
      uploadedFiles.push({
        url: result.secure_url,
        resourceType: "video",
      });
      data.video_url = result.secure_url;
      data.video_public_id = result.public_id || null;
    }

    data.created_by = userId;
    data.updated_by = userId;
    const product = await adminProductRepository.createProduct(
      data,
      transaction
    );
    if (imagePayloads.length > 0) {
      await adminProductImageRepository.createProductImages(
        imagePayloads.map((image) => ({
          ...image,
          product_id: product.id,
        })),
        transaction
      );
    }
    await transaction.commit();
    const savedProduct = await adminProductRepository.findByUuid(
      product.uuid
    );
    return savedProduct ? savedProduct.toJSON() : product.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    await cleanupUploadedFiles(uploadedFiles);
    logger.error(error);
    if (isDuplicateError(error)) {
      throw new ApiError(409, "A product with the same unique field already exists.");
    }
    throw error;
  }
};

// UPDATE PRODUCT
const updateProduct = async (uuid, payload, files, userId) => {
  const transaction = await sequelize.transaction();
  const uploadedFiles = [];
  const oldFilesToDelete = [];
  try {
    const product = await adminProductRepository.findByUuid(uuid);
    if (!product) {
      throw new ApiError(404, "Product not found.");
    }
    const data = { ...payload };
    const imageManifest = normalizeImageManifest(
  parseImageManifest(data.image_manifest),
);
delete data.image_manifest;
    validateProductFields(data, { isUpdate: true });
    const categoryId =
      data.category_id !== undefined
        ? data.category_id
        : product.category_id;
    const subcategoryId =
      data.subcategory_id !== undefined
        ? data.subcategory_id
        : product.subcategory_id;
    if (
      data.category_id !== undefined ||
      data.subcategory_id !== undefined
    ) {
      await validateCategoryAndSubcategory(categoryId, subcategoryId);
    }
    if (data.name && data.name !== product.name) {
      const existingName = await adminProductRepository.findByName(
        data.name,
        categoryId
      );
      if (existingName && String(existingName.id) !== String(product.id)) {
        throw new ApiError(409, "Product name already exists in this category.");
      }
    }
    if (data.slug && data.slug !== product.slug) {
      const existingSlug = await adminProductRepository.findBySlug(data.slug);
      if (existingSlug && String(existingSlug.id) !== String(product.id)) {
        throw new ApiError(409, "Product slug already exists.");
      }
    }

    if (data.sku && data.sku !== product.sku) {
      const existingSku = await adminProductRepository.findBySku(data.sku);

      if (existingSku && String(existingSku.id) !== String(product.id)) {
        throw new ApiError(409, "Product SKU already exists.");
      }
    }

    const imageFiles = getImageFiles(files);
    const videoFile = getVideoFile(files);

    if (imageManifest !== null) {
      const existingImages =
        await adminProductImageRepository.getImagesByProductId(
          product.id,
          transaction,
        );

      // Resolve and verify every existing image before changing records.
      const resolvedManifest = imageManifest.map((item) => {
        if (item.kind === "new") {
          return item;
        }

        const image = existingImages.find(
          (existing) =>
            String(existing.uuid) === item.identifier ||
            String(existing.id) === item.identifier,
        );

        if (!image) {
          throw new ApiError(
            400,
            "An image does not belong to this product or no longer exists.",
          );
        }

        return {
          ...item,
          record: image,
        };
      });

      const retainedIds = new Set();

      for (const item of resolvedManifest) {
        if (item.kind !== "existing") continue;

        const id = String(item.record.id);

        if (retainedIds.has(id)) {
          throw new ApiError(400, "A product image was submitted more than once.");
        }

        retainedIds.add(id);
      }
      for (const image of existingImages) {
        if (!retainedIds.has(String(image.id))) {
          if (image.image_url) {
            oldFilesToDelete.push({
              url: image.image_url,
              resourceType: "image",
            });
          }

          await adminProductImageRepository.deleteProductImage(
            image,
            transaction,
          );
        }
      }

  const usedFileIndexes = new Set();
  const newImagePayloads = [];

  for (const item of resolvedManifest) {
    if (item.kind === "existing") {
      await adminProductImageRepository.updateProductImage(
        item.record,
        {
          sort_order: item.sort_order,
          is_primary: item.is_primary,
          ...(item.alt_text !== undefined
            ? { alt_text: item.alt_text }
            : {}),
        },
        transaction,
      );

      continue;
    }

    const fileIndex = item.file_index;
    const file = imageFiles[fileIndex];

    if (!file || usedFileIndexes.has(fileIndex)) {
      throw new ApiError(400, "Invalid product image selection.");
    }

    usedFileIndexes.add(fileIndex);

    const result = await uploadToCloudinary(file, {
      folder: "marve/products/images",
      resourceType: "image",
    });

    uploadedFiles.push({
      url: result.secure_url,
      resourceType: "image",
    });

    newImagePayloads.push({
      product_id: product.id,
      image_url: result.secure_url,
      alt_text: item.alt_text || file.originalname || data.name || product.name,
      is_primary: item.is_primary,
      sort_order: item.sort_order,
    });
  }

  if (usedFileIndexes.size !== imageFiles.length) {
    throw new ApiError(400, "Some uploaded images are missing metadata.");
  }

  if (newImagePayloads.length > 0) {
    await adminProductImageRepository.createProductImages(
      newImagePayloads,
      transaction,
    );
  }
} else if (imageFiles.length > 0) {
  const existingImages =
    await adminProductImageRepository.getImagesByProductId(
      product.id,
      transaction,
    );

  const newImagePayloads = [];

  for (let index = 0; index < imageFiles.length; index += 1) {
    const file = imageFiles[index];

    const result = await uploadToCloudinary(file, {
      folder: "marve/products/images",
      resourceType: "image",
    });

    uploadedFiles.push({
      url: result.secure_url,
      resourceType: "image",
    });

    newImagePayloads.push({
      product_id: product.id,
      image_url: result.secure_url,
      alt_text: file.originalname || data.name || product.name,
      is_primary:
        existingImages.length === 0 &&
        index === 0,
      sort_order: existingImages.length + index,
    });
  }

  await adminProductImageRepository.createProductImages(
    newImagePayloads,
    transaction,
  );
}
    if (videoFile) {
      if (product.video_url) {
        oldFilesToDelete.push({
          url: product.video_url,
          resourceType: "video",
        });
      }

      const result = await uploadToCloudinary(videoFile, {
        folder: "marve/products/videos",
        resourceType: "video",
      });

      uploadedFiles.push({
        url: result.secure_url,
        resourceType: "video",
      });

      data.video_url = result.secure_url;
      data.video_public_id = result.public_id || null;
    }

    data.updated_by = userId;
    await adminProductRepository.updateProduct(product, data, transaction);
    await transaction.commit();
    await deleteOldFiles(oldFilesToDelete);
    const updatedProduct = await adminProductRepository.findByUuid(uuid);
    return updatedProduct ? updatedProduct.toJSON() : product.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    await cleanupUploadedFiles(uploadedFiles);
    logger.error(error);
    if (isDuplicateError(error)) {
      throw new ApiError(409, "A product with the same unique field already exists.");
    }
    throw error;
  }
};

// REMOVE PRODUCT VIDEO
const removeProductVideo = async (uuid, userId) => {
  const transaction = await sequelize.transaction();
  try {
    const product = await adminProductRepository.findByUuid(uuid);
    if (!product) {
      throw new ApiError(404, "Product not found.");
    }
    const oldVideoUrl = product.video_url;
    await adminProductRepository.updateProduct(
      product,
      {
        video_url: null,
        video_public_id: null,
        updated_by: userId,
      },
      transaction
    );

    await transaction.commit();
    if (oldVideoUrl) {
      try {
        await deleteCloudinaryFile(oldVideoUrl, "video");
      } catch (error) {
        logger.error(error);
      }
    }
    return product.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    logger.error(error);
    throw error;
  }
};

// UPDATE PRODUCT STATUS
const updateProductStatus = async (uuid, status, userId) => {
  const transaction = await sequelize.transaction();
  try {
    const product = await adminProductRepository.findByUuid(uuid);
    if (!product) {
      throw new ApiError(404, "Product not found.");
    }
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      throw new ApiError(400, "Invalid product status.");
    }
    await adminProductRepository.updateProduct(
      product,
      {
        status,
        updated_by: userId,
      },
      transaction
    );
    await transaction.commit();
    return product.toJSON();
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    logger.error(error);
    throw error;
  }
};

// GET SINGLE PRODUCT
const getProduct = async (uuid) => {
  const product = await adminProductRepository.findByUuid(uuid);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return product.toJSON();
};

// GET PRODUCT LIST
const getProducts = async (query) => {
  const result = await adminProductRepository.getProducts(query);

  return {
    ...result,
    rows: result.rows.map((product) => product.toJSON()),
  };
};

// DELETE PRODUCT
const deleteProduct = async (uuid) => {
  const transaction = await sequelize.transaction();
  try {
    const product = await adminProductRepository.findByUuid(uuid);
    if (!product) {
      throw new ApiError(404, "Product not found.");
    }
    const images =
      await adminProductImageRepository.getImagesByProductId(
        product.id,
        transaction
      );
    const mediaToDelete = images.map((image) => ({
      url: image.image_url,
      resourceType: "image",
    }));
    if (product.video_url) {
      mediaToDelete.push({
        url: product.video_url,
        resourceType: "video",
      });
    }
    await adminProductRepository.deleteProduct(product, transaction);
    await transaction.commit();
    await deleteOldFiles(mediaToDelete);
    return true;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    logger.error(error);
    throw error;
  }
};

module.exports = {
  createProduct,
  updateProduct,
  updateProductStatus,
  removeProductVideo,
  getProduct,
  getProducts,
  deleteProduct,
};