
/* =========================================================
   Types
========================================================= */

export interface CategorySubcategory {
  id: string;
  name: string;
  description: string;
  href: string;
}

export interface CategoryProduct {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  subcategoryId?: number | null;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  href: string;
  isNew?: boolean;
  isSale?: boolean;
  availability?: "in-stock" | "out-of-stock";
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroDescription: string;
  image: string;
  subcategories: CategorySubcategory[];
  products: CategoryProduct[];
}

/* =========================================================
   Common Image
========================================================= */

const CATEGORY_IMAGE = "/assets/images/home/home_lifestyle.jpg";

/* =========================================================
   Category Data
========================================================= */

export const CATEGORY_DATA: Record<string, CategoryData> = {
  /* =======================================================
     KITCHEN
  ======================================================= */

  kitchen: {
    id: "kitchen",
    name: "Kitchen",
    slug: "kitchen",

    description:
      "Thoughtfully chosen essentials to make everyday cooking, organising and serving feel easier.",

    heroDescription:
      "Discover practical kitchen essentials designed to bring more ease, organisation and beauty to everyday cooking.",

    image: CATEGORY_IMAGE,


    subcategories: [
      {
        id: "cookware",
        name: "Cookware",
        description: "Everyday pots, pans and cooking essentials.",
        href: "/categories/kitchen/cookware",
      },
      {
        id: "kitchen-storage",
        name: "Kitchen Storage",
        description: "Keep ingredients fresh and your kitchen organised.",
        href: "/categories/kitchen/kitchen-storage",
      },
      {
        id: "kitchen-utensils",
        name: "Kitchen Utensils",
        description: "Useful tools for effortless everyday cooking.",
        href: "/categories/kitchen/kitchen-utensils",
      },
      {
        id: "serveware",
        name: "Serveware",
        description: "Beautiful pieces for serving meals with ease.",
        href: "/categories/kitchen/serveware",
      },
      {
        id: "dinnerware",
        name: "Dinnerware",
        description: "Practical and elegant pieces for every table.",
        href: "/categories/kitchen/dinnerware",
      },
      {
        id: "kitchen-organisers",
        name: "Kitchen Organisers",
        description: "Simple solutions for a neater kitchen.",
        href: "/categories/kitchen/kitchen-organisers",
      },
    ],

    products: [
      {
        id: 101,
        name: "Everyday Non-Stick Cookware Set",
        category: "Kitchen",
        subcategory: "Cookware",
        image: CATEGORY_IMAGE,
        price: 1499,
        originalPrice: 1999,
        discount: 25,
        rating: 4.7,
        reviewCount: 124,
        href: "/common/products/everyday-non-stick-cookware-set",
        isSale: true,
      },
      {
        id: 102,
        name: "Airtight Kitchen Storage Set",
        category: "Kitchen",
        subcategory: "Kitchen Storage",
        image: CATEGORY_IMAGE,
        price: 799,
        originalPrice: 999,
        discount: 20,
        rating: 4.6,
        reviewCount: 98,
        href: "/common/products/airtight-kitchen-storage-set",
        isSale: true,
      },
      {
        id: 103,
        name: "Premium Kitchen Tool Set",
        category: "Kitchen",
        subcategory: "Kitchen Utensils",
        image: CATEGORY_IMAGE,
        price: 649,
        rating: 4.5,
        reviewCount: 76,
        href: "/common/products/premium-kitchen-tool-set",
        isNew: true,
      },
      {
        id: 104,
        name: "Modern Serving Tray",
        category: "Kitchen",
        subcategory: "Serveware",
        image: CATEGORY_IMAGE,
        price: 549,
        originalPrice: 699,
        discount: 21,
        rating: 4.6,
        reviewCount: 64,
        href: "/common/products/modern-serving-tray",
        isSale: true,
      },
      {
        id: 105,
        name: "Classic Dinner Plate Set",
        category: "Kitchen",
        subcategory: "Dinnerware",
        image: CATEGORY_IMAGE,
        price: 899,
        rating: 4.8,
        reviewCount: 143,
        href: "/common/products/classic-dinner-plate-set",
      },
      {
        id: 106,
        name: "Kitchen Drawer Organiser",
        category: "Kitchen",
        subcategory: "Kitchen Organisers",
        image: CATEGORY_IMAGE,
        price: 399,
        originalPrice: 499,
        discount: 20,
        rating: 4.5,
        reviewCount: 51,
        href: "/common/products/kitchen-drawer-organiser",
        isSale: true,
      },
      {
        id: 107,
        name: "Stackable Spice Storage Set",
        category: "Kitchen",
        subcategory: "Kitchen Storage",
        image: CATEGORY_IMAGE,
        price: 499,
        rating: 4.4,
        reviewCount: 43,
        href: "/common/products/stackable-spice-storage-set",
      },
      {
        id: 108,
        name: "Multi-Purpose Cooking Spoon Set",
        category: "Kitchen",
        subcategory: "Kitchen Utensils",
        image: CATEGORY_IMAGE,
        price: 349,
        rating: 4.6,
        reviewCount: 88,
        href: "/common/products/multi-purpose-cooking-spoon-set",
        isNew: true,
      },
    ],
  },

  /* =======================================================
     DINING
  ======================================================= */

  dining: {
    id: "dining",
    name: "Dining",
    slug: "dining",

    description:
      "Thoughtful dining essentials made for everyday meals, relaxed gatherings and beautiful tables.",

    heroDescription:
      "Create a table you love with timeless dining essentials designed for everyday moments and special occasions.",

    image: CATEGORY_IMAGE,

    subcategories: [
      {
        id: "dinner-sets",
        name: "Dinner Sets",
        description: "Complete sets for everyday dining.",
        href: "/categories/dining/dinner-sets",
      },
      {
        id: "plates-bowls",
        name: "Plates & Bowls",
        description: "Everyday plates and bowls for every meal.",
        href: "/categories/dining/plates-bowls",
      },
      {
        id: "glassware",
        name: "Glassware",
        description: "Elegant glasses for everyday serving.",
        href: "/categories/dining/glassware",
      },
      {
        id: "cutlery",
        name: "Cutlery",
        description: "Practical cutlery with a refined feel.",
        href: "/categories/dining/cutlery",
      },
      {
        id: "serving-trays",
        name: "Serving Trays",
        description: "Make serving easier and more beautiful.",
        href: "/categories/dining/serving-trays",
      },
      {
        id: "dining-accessories",
        name: "Dining Accessories",
        description: "Small details that complete your table.",
        href: "/categories/dining/dining-accessories",
      },
    ],

    products: [
      {
        id: 201,
        name: "Minimal Ceramic Dinner Set",
        category: "Dining",
        subcategory: "Dinner Sets",
        image: CATEGORY_IMAGE,
        price: 1299,
        originalPrice: 1699,
        discount: 24,
        rating: 4.8,
        reviewCount: 137,
        href: "/common/products/minimal-ceramic-dinner-set",
        isSale: true,
      },
      {
        id: 202,
        name: "Everyday Ceramic Plate Set",
        category: "Dining",
        subcategory: "Plates & Bowls",
        image: CATEGORY_IMAGE,
        price: 699,
        rating: 4.6,
        reviewCount: 82,
        href: "/common/products/everyday-ceramic-plate-set",
      },
      {
        id: 203,
        name: "Modern Glass Tumbler Set",
        category: "Dining",
        subcategory: "Glassware",
        image: CATEGORY_IMAGE,
        price: 599,
        originalPrice: 749,
        discount: 20,
        rating: 4.5,
        reviewCount: 67,
        href: "/common/products/modern-glass-tumbler-set",
        isSale: true,
      },
      {
        id: 204,
        name: "Stainless Steel Cutlery Set",
        category: "Dining",
        subcategory: "Cutlery",
        image: CATEGORY_IMAGE,
        price: 899,
        rating: 4.7,
        reviewCount: 115,
        href: "/common/products/stainless-steel-cutlery-set",
        isNew: true,
      },
      {
        id: 205,
        name: "Wooden Serving Tray",
        category: "Dining",
        subcategory: "Serving Trays",
        image: CATEGORY_IMAGE,
        price: 749,
        originalPrice: 949,
        discount: 21,
        rating: 4.6,
        reviewCount: 59,
        href: "/common/products/wooden-serving-tray",
        isSale: true,
      },
      {
        id: 206,
        name: "Tabletop Napkin Holder",
        category: "Dining",
        subcategory: "Dining Accessories",
        image: CATEGORY_IMAGE,
        price: 299,
        rating: 4.4,
        reviewCount: 38,
        href: "/common/products/tabletop-napkin-holder",
      },
      {
        id: 207,
        name: "Ceramic Serving Bowl Set",
        category: "Dining",
        subcategory: "Plates & Bowls",
        image: CATEGORY_IMAGE,
        price: 799,
        rating: 4.7,
        reviewCount: 73,
        href: "/common/products/ceramic-serving-bowl-set",
      },
      {
        id: 208,
        name: "Elegant Dining Spoon Set",
        category: "Dining",
        subcategory: "Cutlery",
        image: CATEGORY_IMAGE,
        price: 499,
        rating: 4.5,
        reviewCount: 46,
        href: "/common/products/elegant-dining-spoon-set",
        isNew: true,
      },
    ],
  },

  /* =======================================================
     STORAGE
  ======================================================= */

  storage: {
    id: "storage",
    name: "Storage",
    slug: "storage",

    description:
      "Smart storage solutions that help bring order, clarity and calm to everyday spaces.",

    heroDescription:
      "Discover practical storage solutions designed to make every room feel more organised and effortless.",

    image: CATEGORY_IMAGE,

    subcategories: [
      {
        id: "storage-containers",
        name: "Storage Containers",
        description: "Keep everyday essentials neatly stored.",
        href: "/categories/storage/storage-containers",
      },
      {
        id: "organiser-boxes",
        name: "Organiser Boxes",
        description: "Simple boxes for smarter organisation.",
        href: "/categories/storage/organiser-boxes",
      },
      {
        id: "drawer-organisers",
        name: "Drawer Organisers",
        description: "Make drawers easier to use every day.",
        href: "/categories/storage/drawer-organisers",
      },
      {
        id: "shelf-organisers",
        name: "Shelf Organisers",
        description: "Create more usable shelf space.",
        href: "/categories/storage/shelf-organisers",
      },
      {
        id: "laundry-storage",
        name: "Laundry Storage",
        description: "Practical storage for laundry essentials.",
        href: "/categories/storage/laundry-storage",
      },
      {
        id: "everyday-storage",
        name: "Everyday Storage",
        description: "Versatile storage for every corner of home.",
        href: "/categories/storage/everyday-storage",
      },
    ],

    products: [
      {
        id: 301,
        name: "Clear Airtight Storage Container Set",
        category: "Storage",
        subcategory: "Storage Containers",
        image: CATEGORY_IMAGE,
        price: 899,
        originalPrice: 1199,
        discount: 25,
        rating: 4.8,
        reviewCount: 152,
        href: "/common/products/clear-airtight-storage-container-set",
        isSale: true,
      },
      {
        id: 302,
        name: "Multi-Purpose Organiser Box",
        category: "Storage",
        subcategory: "Organiser Boxes",
        image: CATEGORY_IMAGE,
        price: 449,
        rating: 4.5,
        reviewCount: 61,
        href: "/common/products/multi-purpose-organiser-box",
      },
      {
        id: 303,
        name: "Adjustable Drawer Organiser",
        category: "Storage",
        subcategory: "Drawer Organisers",
        image: CATEGORY_IMAGE,
        price: 399,
        originalPrice: 499,
        discount: 20,
        rating: 4.6,
        reviewCount: 74,
        href: "/common/products/adjustable-drawer-organiser",
        isSale: true,
      },
      {
        id: 304,
        name: "Stackable Shelf Storage Rack",
        category: "Storage",
        subcategory: "Shelf Organisers",
        image: CATEGORY_IMAGE,
        price: 699,
        rating: 4.7,
        reviewCount: 88,
        href: "/common/products/stackable-shelf-storage-rack",
        isNew: true,
      },
      {
        id: 305,
        name: "Laundry Basket With Lid",
        category: "Storage",
        subcategory: "Laundry Storage",
        image: CATEGORY_IMAGE,
        price: 999,
        originalPrice: 1299,
        discount: 23,
        rating: 4.6,
        reviewCount: 53,
        href: "/common/products/laundry-basket-with-lid",
        isSale: true,
      },
      {
        id: 306,
        name: "Foldable Everyday Storage Basket",
        category: "Storage",
        subcategory: "Everyday Storage",
        image: CATEGORY_IMAGE,
        price: 549,
        rating: 4.5,
        reviewCount: 69,
        href: "/common/products/foldable-everyday-storage-basket",
      },
      {
        id: 307,
        name: "Modular Pantry Storage Set",
        category: "Storage",
        subcategory: "Storage Containers",
        image: CATEGORY_IMAGE,
        price: 1099,
        rating: 4.8,
        reviewCount: 97,
        href: "/common/products/modular-pantry-storage-set",
      },
      {
        id: 308,
        name: "Compact Closet Organiser",
        category: "Storage",
        subcategory: "Organiser Boxes",
        image: CATEGORY_IMAGE,
        price: 499,
        rating: 4.4,
        reviewCount: 42,
        href: "/common/products/compact-closet-organiser",
        isNew: true,
      },
    ],
  },

  /* =======================================================
     HOME DECOR
  ======================================================= */

  "home-decor": {
    id: "home-decor",
    name: "Home Decor",
    slug: "home-decor",

    description:
      "Simple, beautiful pieces that add warmth, personality and comfort to your everyday spaces.",

    heroDescription:
      "Bring more character to your home with thoughtfully selected decor made for everyday living.",

    image: CATEGORY_IMAGE,

    subcategories: [
      {
        id: "decor-accents",
        name: "Decor Accents",
        description: "Small details that make a room feel complete.",
        href: "/categories/home-decor/decor-accents",
      },
      {
        id: "vases-planters",
        name: "Vases & Planters",
        description: "Add natural beauty to your favourite corners.",
        href: "/categories/home-decor/vases-planters",
      },
      {
        id: "candles-fragrance",
        name: "Candles & Fragrance",
        description: "Create a warm and inviting atmosphere.",
        href: "/categories/home-decor/candles-fragrance",
      },
      {
        id: "wall-decor",
        name: "Wall Decor",
        description: "Give empty walls a little more character.",
        href: "/categories/home-decor/wall-decor",
      },
      {
        id: "cushions-throws",
        name: "Cushions & Throws",
        description: "Add softness and comfort to your home.",
        href: "/categories/home-decor/cushions-throws",
      },
      {
        id: "home-accessories",
        name: "Home Accessories",
        description: "Thoughtful pieces for everyday spaces.",
        href: "/categories/home-decor/home-accessories",
      },
    ],

    products: [
      {
        id: 401,
        name: "Minimal Ceramic Vase",
        category: "Home Decor",
        subcategory: "Vases & Planters",
        image: CATEGORY_IMAGE,
        price: 599,
        originalPrice: 749,
        discount: 20,
        rating: 4.7,
        reviewCount: 84,
        href: "/common/products/minimal-ceramic-vase",
        isSale: true,
      },
      {
        id: 402,
        name: "Decorative Accent Bowl",
        category: "Home Decor",
        subcategory: "Decor Accents",
        image: CATEGORY_IMAGE,
        price: 449,
        rating: 4.5,
        reviewCount: 47,
        href: "/common/products/decorative-accent-bowl",
      },
      {
        id: 403,
        name: "Aromatic Home Candle",
        category: "Home Decor",
        subcategory: "Candles & Fragrance",
        image: CATEGORY_IMAGE,
        price: 399,
        rating: 4.8,
        reviewCount: 121,
        href: "/common/products/aromatic-home-candle",
        isNew: true,
      },
      {
        id: 404,
        name: "Minimal Wall Accent",
        category: "Home Decor",
        subcategory: "Wall Decor",
        image: CATEGORY_IMAGE,
        price: 799,
        originalPrice: 999,
        discount: 20,
        rating: 4.6,
        reviewCount: 52,
        href: "/common/products/minimal-wall-accent",
        isSale: true,
      },
      {
        id: 405,
        name: "Soft Cotton Cushion Set",
        category: "Home Decor",
        subcategory: "Cushions & Throws",
        image: CATEGORY_IMAGE,
        price: 699,
        rating: 4.7,
        reviewCount: 91,
        href: "/common/products/soft-cotton-cushion-set",
      },
      {
        id: 406,
        name: "Textured Decorative Tray",
        category: "Home Decor",
        subcategory: "Home Accessories",
        image: CATEGORY_IMAGE,
        price: 649,
        rating: 4.5,
        reviewCount: 63,
        href: "/common/products/textured-decorative-tray",
      },
      {
        id: 407,
        name: "Modern Tabletop Planter",
        category: "Home Decor",
        subcategory: "Vases & Planters",
        image: CATEGORY_IMAGE,
        price: 499,
        rating: 4.6,
        reviewCount: 57,
        href: "/common/products/modern-tabletop-planter",
      },
      {
        id: 408,
        name: "Decorative Storage Basket",
        category: "Home Decor",
        subcategory: "Home Accessories",
        image: CATEGORY_IMAGE,
        price: 799,
        originalPrice: 999,
        discount: 20,
        rating: 4.6,
        reviewCount: 48,
        href: "/common/products/decorative-storage-basket",
        isSale: true,
      },
    ],
  },

  /* =======================================================
     COFFEE & TEA
  ======================================================= */

  "coffee-tea": {
    id: "coffee-tea",
    name: "Coffee & Tea",
    slug: "coffee-tea",

    description:
      "Everything you need to create a comforting coffee or tea ritual at home.",

    heroDescription:
      "Make your everyday coffee and tea moments more enjoyable with practical, beautiful essentials.",

    image: CATEGORY_IMAGE,

    subcategories: [
      {
        id: "coffee-mugs",
        name: "Coffee Mugs",
        description: "Mugs made for slow mornings and quick breaks.",
        href: "/categories/coffee-tea/coffee-mugs",
      },
      {
        id: "tea-cups",
        name: "Tea Cups",
        description: "Simple cups for your everyday tea ritual.",
        href: "/categories/coffee-tea/tea-cups",
      },
      {
        id: "coffee-makers",
        name: "Coffee Makers",
        description: "Brew your favourite coffee at home.",
        href: "/categories/coffee-tea/coffee-makers",
      },
      {
        id: "tea-sets",
        name: "Tea Sets",
        description: "Thoughtful sets for relaxed tea moments.",
        href: "/categories/coffee-tea/tea-sets",
      },
      {
        id: "flasks-travel-mugs",
        name: "Flasks & Travel Mugs",
        description: "Take your favourite drink wherever you go.",
        href: "/categories/coffee-tea/flasks-travel-mugs",
      },
      {
        id: "coffee-tea-accessories",
        name: "Coffee & Tea Accessories",
        description: "Small essentials for a better brew.",
        href: "/categories/coffee-tea/coffee-tea-accessories",
      },
    ],

    products: [
      {
        id: 501,
        name: "Classic Ceramic Coffee Mug",
        category: "Coffee & Tea",
        subcategory: "Coffee Mugs",
        image: CATEGORY_IMAGE,
        price: 299,
        rating: 4.7,
        reviewCount: 136,
        href: "/common/products/classic-ceramic-coffee-mug",
      },
      {
        id: 502,
        name: "Everyday Tea Cup Set",
        category: "Coffee & Tea",
        subcategory: "Tea Cups",
        image: CATEGORY_IMAGE,
        price: 449,
        originalPrice: 599,
        discount: 25,
        rating: 4.6,
        reviewCount: 72,
        href: "/common/products/everyday-tea-cup-set",
        isSale: true,
      },
      {
        id: 503,
        name: "Compact Coffee Brewer",
        category: "Coffee & Tea",
        subcategory: "Coffee Makers",
        image: CATEGORY_IMAGE,
        price: 1299,
        rating: 4.7,
        reviewCount: 83,
        href: "/common/products/compact-coffee-brewer",
        isNew: true,
      },
      {
        id: 504,
        name: "Elegant Tea Serving Set",
        category: "Coffee & Tea",
        subcategory: "Tea Sets",
        image: CATEGORY_IMAGE,
        price: 999,
        originalPrice: 1299,
        discount: 23,
        rating: 4.8,
        reviewCount: 64,
        href: "/common/products/elegant-tea-serving-set",
        isSale: true,
      },
      {
        id: 505,
        name: "Insulated Travel Mug",
        category: "Coffee & Tea",
        subcategory: "Flasks & Travel Mugs",
        image: CATEGORY_IMAGE,
        price: 699,
        rating: 4.6,
        reviewCount: 108,
        href: "/common/products/insulated-travel-mug",
      },
      {
        id: 506,
        name: "Reusable Coffee Filter",
        category: "Coffee & Tea",
        subcategory: "Coffee & Tea Accessories",
        image: CATEGORY_IMAGE,
        price: 249,
        rating: 4.5,
        reviewCount: 49,
        href: "/common/products/reusable-coffee-filter",
      },
      {
        id: 507,
        name: "Double Wall Coffee Cup Set",
        category: "Coffee & Tea",
        subcategory: "Coffee Mugs",
        image: CATEGORY_IMAGE,
        price: 599,
        rating: 4.7,
        reviewCount: 67,
        href: "/common/products/double-wall-coffee-cup-set",
      },
      {
        id: 508,
        name: "Tea Infuser Bottle",
        category: "Coffee & Tea",
        subcategory: "Coffee & Tea Accessories",
        image: CATEGORY_IMAGE,
        price: 549,
        rating: 4.6,
        reviewCount: 58,
        href: "/common/products/tea-infuser-bottle",
        isNew: true,
      },
    ],
  },

  /* =======================================================
     CLEANING
  ======================================================= */

  cleaning: {
    id: "cleaning",
    name: "Cleaning",
    slug: "cleaning",

    description:
      "Practical cleaning essentials designed to make everyday home care simpler and more organised.",

    heroDescription:
      "Keep your home feeling fresh with useful cleaning tools and everyday utility essentials.",

    image: CATEGORY_IMAGE,

    subcategories: [
      {
        id: "cleaning-tools",
        name: "Cleaning Tools",
        description: "Useful tools for everyday cleaning.",
        href: "/categories/cleaning/cleaning-tools",
      },
      {
        id: "brushes-scrubbers",
        name: "Brushes & Scrubbers",
        description: "Practical tools for deeper cleaning.",
        href: "/categories/cleaning/brushes-scrubbers",
      },
      {
        id: "mops-wipers",
        name: "Mops & Wipers",
        description: "Make everyday floor cleaning easier.",
        href: "/categories/cleaning/mops-wipers",
      },
      {
        id: "dusting-tools",
        name: "Dusting Tools",
        description: "Simple solutions for dust-free spaces.",
        href: "/categories/cleaning/dusting-tools",
      },
      {
        id: "laundry-essentials",
        name: "Laundry Essentials",
        description: "Helpful products for everyday laundry care.",
        href: "/categories/cleaning/laundry-essentials",
      },
      {
        id: "utility-essentials",
        name: "Utility Essentials",
        description: "Useful helpers for everyday home care.",
        href: "/categories/cleaning/utility-essentials",
      },
    ],

    products: [
      {
        id: 601,
        name: "Multi-Purpose Cleaning Brush Set",
        category: "Cleaning",
        subcategory: "Cleaning Tools",
        image: CATEGORY_IMAGE,
        price: 349,
        rating: 4.6,
        reviewCount: 94,
        href: "/common/products/multi-purpose-cleaning-brush-set",
      },
      {
        id: 602,
        name: "Deep Cleaning Scrubber Set",
        category: "Cleaning",
        subcategory: "Brushes & Scrubbers",
        image: CATEGORY_IMAGE,
        price: 299,
        originalPrice: 399,
        discount: 25,
        rating: 4.5,
        reviewCount: 68,
        href: "/common/products/deep-cleaning-scrubber-set",
        isSale: true,
      },
      {
        id: 603,
        name: "Microfiber Floor Wiper",
        category: "Cleaning",
        subcategory: "Mops & Wipers",
        image: CATEGORY_IMAGE,
        price: 599,
        rating: 4.7,
        reviewCount: 103,
        href: "/common/products/microfiber-floor-wiper",
        isNew: true,
      },
      {
        id: 604,
        name: "Reusable Dusting Duster",
        category: "Cleaning",
        subcategory: "Dusting Tools",
        image: CATEGORY_IMAGE,
        price: 249,
        rating: 4.4,
        reviewCount: 47,
        href: "/common/products/reusable-dusting-duster",
      },
      {
        id: 605,
        name: "Foldable Laundry Basket",
        category: "Cleaning",
        subcategory: "Laundry Essentials",
        image: CATEGORY_IMAGE,
        price: 699,
        originalPrice: 899,
        discount: 22,
        rating: 4.6,
        reviewCount: 71,
        href: "/common/products/foldable-laundry-basket",
        isSale: true,
      },
      {
        id: 606,
        name: "Home Utility Cleaning Set",
        category: "Cleaning",
        subcategory: "Utility Essentials",
        image: CATEGORY_IMAGE,
        price: 799,
        rating: 4.7,
        reviewCount: 56,
        href: "/common/products/home-utility-cleaning-set",
      },
      {
        id: 607,
        name: "Kitchen Surface Cleaning Kit",
        category: "Cleaning",
        subcategory: "Cleaning Tools",
        image: CATEGORY_IMAGE,
        price: 449,
        rating: 4.5,
        reviewCount: 63,
        href: "/common/products/kitchen-surface-cleaning-kit",
      },
      {
        id: 608,
        name: "Compact Cleaning Caddy",
        category: "Cleaning",
        subcategory: "Utility Essentials",
        image: CATEGORY_IMAGE,
        price: 499,
        rating: 4.6,
        reviewCount: 44,
        href: "/common/products/compact-cleaning-caddy",
        isNew: true,
      },
    ],
  },
};

/* =========================================================
   Helpers
========================================================= */

/**
 * Get category data using its slug.
 */
export function getCategoryBySlug(
  slug: string,
): CategoryData | undefined {
  return CATEGORY_DATA[slug];
}

/**
 * Get all available categories.
 */
export function getAllCategories(): CategoryData[] {
  return Object.values(CATEGORY_DATA);
}

/**
 * Get products belonging to a category.
 */
export function getCategoryProducts(
  slug: string,
): CategoryProduct[] {
  return CATEGORY_DATA[slug]?.products ?? [];
}

/**
 * Get subcategories belonging to a category.
 */
export function getCategorySubcategories(
  slug: string,
): CategorySubcategory[] {
  return CATEGORY_DATA[slug]?.subcategories ?? [];
}