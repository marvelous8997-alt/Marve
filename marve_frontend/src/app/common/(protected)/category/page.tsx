import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";

import CategoryHero from "@/src/components/common/category/CategoryHero";
import CategoryIntro from "@/src/components/common/category/CategoryIntro";
import CategorySubcategories from "@/src/components/common/category/CategorySubcategories";
import CategoryListing from "@/src/components/common/category/CategoryListing";
import CategoryPromo from "@/src/components/common/category/CategoryPromo";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

import {
  getCategoryBySlug,
  getAllCategories,
} from "@/src/constants/categoryData";

/* ========================= Types ========================= */

interface CategoryPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

/* ========================= Helpers ========================= */

function resolveCategorySlug(slug?: string) {
  const aliases: Record<string, string> = {
    "kitchen-essentials": "kitchen",
    "storage-organizers": "storage",
    "dining-serveware": "dining",
    "home-utility": "utility",
    "home-decor": "decor",
  };

  return aliases[slug ?? ""] ?? slug ?? "kitchen";
}

/* ========================= Metadata ========================= */

export async function generateMetadata({
  searchParams,
}: CategoryPageProps) {
  const { category: categorySlug } = await searchParams;
  const resolvedSlug = resolveCategorySlug(categorySlug);
  const category = getCategoryBySlug(resolvedSlug);

  if (!category) {
    return {
      title: "Category | MARVE",
      description: "Explore MARVE's home and kitchen collections.",
    };
  }

  return {
    title: `${category.name} | MARVE`,
    description:
      category.description ??
      `Explore MARVE's ${category.name.toLowerCase()} collection.`,
  };
}

/* ========================= Page ========================= */

export default async function CategoryPage({
  searchParams,
}: CategoryPageProps) {
  const { category: categorySlug } = await searchParams;
  const resolvedSlug = resolveCategorySlug(categorySlug);

  const category =
    getCategoryBySlug(resolvedSlug) ?? getAllCategories()[0];

  if (!category) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <Navbar />

      <CategoryHero category={category} />

      <CategoryIntro category={category} />

      <CategorySubcategories
        categoryName={category.name}
        categorySlug={categorySlug || resolvedSlug}
      />

      <CategoryListing
        category={category}
        categorySlug={categorySlug || resolvedSlug}
        products={category.products}
      />

      <CategoryPromo category={category} />

      <NewsletterSection />

      <Footer />
    </main>
  );
}