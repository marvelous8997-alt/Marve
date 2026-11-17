"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
  Sparkles,
} from "lucide-react";
import useCategory from "@/src/hooks/user/useCategory";
import type { UserCategory } from "@/src/types/user/category.types";

/* ========================= Types ========================= */

interface BlogArticle {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  date: string;
  sortDate: string;
  readTime: string;
  href: string;
  isFeatured?: boolean;
}

/* ========================= Data ========================= */

const articles: BlogArticle[] = [
  {
    id: 1,
    title: "7 Simple Ways to Organise Your Kitchen",
    category: "Kitchen",
    description:
      "Create a cleaner and more functional kitchen with simple organisation ideas that fit naturally into everyday routines.",
    image: "/assets/images/home/home_lifestyle.jpg",
    date: "September 12, 2026",
    sortDate: "2026-09-12",
    readTime: "5 min read",
    href: "/common/blog/organise-your-kitchen",
    isFeatured: true,
  },
  {
    id: 2,
    title: "How to Style a Beautiful Dining Table",
    category: "Dining",
    description:
      "Bring warmth and character to your dining space with simple styling ideas for everyday meals and special occasions.",
    image: "/assets/images/home/home_lifestyle.jpg",
    date: "September 9, 2026",
    sortDate: "2026-09-09",
    readTime: "4 min read",
    href: "/common/blog/style-your-dining-table",
  },
  {
    id: 3,
    title: "Small Home, Smart Storage",
    category: "Organisation",
    description:
      "Discover practical storage ideas that help you make better use of every corner without making your home feel crowded.",
    image: "/assets/images/home/home_lifestyle.jpg",
    date: "September 6, 2026",
    sortDate: "2026-09-06",
    readTime: "6 min read",
    href: "/common/blog/smart-storage-ideas",
  },
  {
    id: 4,
    title: "Everyday Kitchen Essentials You Actually Need",
    category: "Kitchen",
    description:
      "A practical guide to choosing useful kitchen essentials that make everyday cooking easier and more enjoyable.",
    image: "/assets/images/home/home_lifestyle.jpg",
    date: "September 3, 2026",
    sortDate: "2026-09-03",
    readTime: "5 min read",
    href: "/common/blog/kitchen-essentials-guide",
  },
  {
    id: 5,
    title: "Refresh Your Home Without Overspending",
    category: "Home Inspiration",
    description:
      "Give your home a fresh new feel with small changes that create a noticeable difference without a complete makeover.",
    image: "/assets/images/home/home_lifestyle.jpg",
    date: "August 30, 2026",
    sortDate: "2026-08-30",
    readTime: "5 min read",
    href: "/common/blog/refresh-your-home",
  },
  {
    id: 6,
    title: "Simple Ways to Make Your Kitchen Feel Bigger",
    category: "Kitchen",
    description:
      "Use smart layouts, organisation and visual tricks to make even a compact kitchen feel more open and comfortable.",
    image: "/assets/images/home/home_lifestyle.jpg",
    date: "August 27, 2026",
    sortDate: "2026-08-27",
    readTime: "4 min read",
    href: "/common/blog/make-kitchen-feel-bigger",
  },
  {
    id: 7,
    title: "Creating a Calm and Comfortable Living Space",
    category: "Home Inspiration",
    description:
      "Explore simple ways to create a home that feels calm, welcoming and comfortable throughout the day.",
    image: "/assets/images/home/home_lifestyle.jpg",
    date: "August 24, 2026",
    sortDate: "2026-08-24",
    readTime: "6 min read",
    href: "/common/blog/calm-living-space",
  },
  {
    id: 8,
    title: "The Art of Thoughtful Home Gifting",
    category: "Lifestyle",
    description:
      "A thoughtful gifting guide filled with useful and beautiful ideas for housewarmings, celebrations and everyday moments.",
    image: "/assets/images/home/home_lifestyle.jpg",
    date: "August 21, 2026",
    sortDate: "2026-08-21",
    readTime: "5 min read",
    href: "/common/blog/thoughtful-home-gifting",
  },
  {
    id: 9,
    title: "Coffee Corner Ideas for Your Home",
    category: "Lifestyle",
    description:
      "Create a cosy coffee corner with simple styling, smart organisation and everyday essentials you will love using.",
    image: "/assets/images/home/home_lifestyle.jpg",
    date: "August 18, 2026",
    sortDate: "2026-08-18",
    readTime: "4 min read",
    href: "/common/blog/coffee-corner-ideas",
  },
  {
    id: 10,
    title: "Easy Dining Ideas for Everyday Hosting",
    category: "Dining",
    description:
      "Make hosting feel effortless with practical dining ideas that combine comfort, function and beautiful presentation.",
    image: "/assets/images/home/home_lifestyle.jpg",
    date: "August 15, 2026",
    sortDate: "2026-08-15",
    readTime: "5 min read",
    href: "/common/blog/everyday-hosting",
  },
  {
    id: 11,
    title: "How to Keep Your Home Feeling Fresh",
    category: "Lifestyle",
    description:
      "Simple everyday habits and useful ideas to keep your home feeling clean, fresh and inviting.",
    image: "/assets/images/home/home_lifestyle.jpg",
    date: "August 12, 2026",
    sortDate: "2026-08-12",
    readTime: "4 min read",
    href: "/common/blog/fresh-home-tips",
  },
  {
    id: 12,
    title: "A Practical Guide to Home Organisation",
    category: "Organisation",
    description:
      "Build simple organisation habits that help every room feel more balanced, functional and easy to maintain.",
    image: "/assets/images/home/home_lifestyle.jpg",
    date: "August 9, 2026",
    sortDate: "2026-08-09",
    readTime: "7 min read",
    href: "/common/blog/home-organisation-guide",
  },
];

const sortOptions = [
  {
    value: "newest",
    label: "Newest First",
  },
  {
    value: "oldest",
    label: "Oldest First",
  },
  {
    value: "title",
    label: "Title A–Z",
  },
];

const ITEMS_PER_PAGE = 8;

/* ========================= Component ========================= */

export default function BlogArticleGrid() {
  const {
  categories: backendCategories,
  isLoading: isCategoriesLoading,
} = useCategory();

const categories = (backendCategories ?? []).filter(
  (category: UserCategory) => category.status === "ACTIVE",
);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  /* ========================= Filtering ========================= */

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = articles.filter((article) => {
      const matchesCategory =
        activeCategory === "All" ||
        article.category.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "oldest") {
        return (
          new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime()
        );
      }

      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      return (
        new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
      );
    });

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  /* ========================= Pagination ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)
  );

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ========================= Handlers ========================= */

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const handleNext = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  return (
    <section
      id="blog-articles"
      className="scroll-mt-24 bg-[#F8F5F0]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C98A50]/25 bg-white px-4 py-2">
            <BookOpen className="h-4 w-4 text-[#A66A32]" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B3E1E]">
              From The MARVE Journal
            </span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#29231F] sm:text-4xl lg:text-5xl">
            Ideas, Tips &{" "}
            <span className="text-[#6B3E1E]">Inspiration.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8A7D72] sm:text-base sm:leading-8">
            Explore thoughtful articles created to bring useful ideas,
            practical solutions, and everyday inspiration to your home.
          </p>
        </div>

        {/* Category Navigation */}
{/* ========================= Category Navigation ========================= */}

<div className="mx-auto mt-10 max-w-6xl sm:mt-12">
  <div className="mx-auto w-full min-w-0 lg:max-w-[1000px]">
    <div className="scrollbar-hide overflow-x-auto overflow-y-hidden pb-2">
      <div className="flex w-max min-w-full items-center gap-2 rounded-full border border-[#6B3E1E]/10 bg-white p-1.5">
        {/* All Articles */}
        <button
          type="button"
          onClick={() => handleCategoryChange("All")}
          className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
            activeCategory === "All"
              ? "bg-[#6B3E1E] text-white shadow-md shadow-[#6B3E1E]/10"
              : "text-[#6B3E1E] hover:bg-[#FFF9F2]"
          }`}
        >
          All
        </button>

        {/* Backend Categories */}
        {categories.map((category) => {
          const isActive =
            activeCategory.toLowerCase() === category.name.toLowerCase();

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.name)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-[#6B3E1E] text-white shadow-md shadow-[#6B3E1E]/10"
                  : "text-[#6B3E1E] hover:bg-[#FFF9F2]"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>

    {isCategoriesLoading && categories.length === 0 && (
      <p className="mt-2 text-xs text-[#8A7D72]">
        Loading categories...
      </p>
    )}
  </div>
</div>

        {/* Search + Sort Toolbar */}
        <div className="mt-8 rounded-[1.5rem] border border-[#6B3E1E]/10 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7D72]" />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  handleSearchChange(event.target.value)
                }
                placeholder="Search articles..."
                className="h-11 w-full rounded-full border border-[#6B3E1E]/10 bg-[#FFF9F2] pl-11 pr-4 text-sm text-[#39312B] outline-none transition-all placeholder:text-[#8A7D72]/70 focus:border-[#C98A50] focus:ring-2 focus:ring-[#C98A50]/10"
              />
            </div>

            {/* Result Count + Sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-[#8A7D72]">
                <span className="font-semibold text-[#39312B]">
                  {filteredArticles.length}
                </span>{" "}
                {filteredArticles.length === 1 ? "article" : "articles"}
              </p>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) =>
                    handleSortChange(event.target.value)
                  }
                  className="h-11 w-full appearance-none rounded-full border border-[#6B3E1E]/10 bg-[#FFF9F2] pl-4 pr-10 text-sm font-medium text-[#39312B] outline-none transition-all focus:border-[#C98A50] focus:ring-2 focus:ring-[#C98A50]/10 sm:w-48"
                  aria-label="Sort articles"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B3E1E]" />
              </div>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedArticles.map((article) => (
              <article
                key={article.id}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#6B3E1E]/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#C98A50]/30 hover:shadow-xl hover:shadow-[#6B3E1E]/5"
              >
                {/* Image */}
                <Link
                  href={article.href}
                  className="relative block aspect-[4/3] overflow-hidden"
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B12]/50 via-transparent to-transparent" />

                  {/* Category */}
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#6B3E1E] shadow-sm backdrop-blur-md">
                      {article.category}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {article.isFeatured && (
                    <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-[#C98A50] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#8A7D72]">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-[#A66A32]" />
                      <span>{article.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5 text-[#A66A32]" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 line-clamp-2 text-lg font-semibold leading-snug text-[#29231F] transition-colors duration-300 group-hover:text-[#6B3E1E]">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#8A7D72]">
                    {article.description}
                  </p>

                  {/* Read More */}
                  <div className="mt-auto pt-5">
                    <Link
                      href={article.href}
                      className="group/read inline-flex items-center gap-2 text-sm font-semibold text-[#6B3E1E]"
                    >
                      Read Article

                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/read:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="mt-10 rounded-[1.5rem] border border-[#6B3E1E]/10 bg-white px-6 py-14 text-center sm:mt-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F5F0]">
              <Search className="h-6 w-6 text-[#6B3E1E]" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#39312B]">
              No articles found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8A7D72]">
              We couldn't find any articles matching your search. Try a
              different keyword or explore another category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setCurrentPage(1);
              }}
              className="mt-6 rounded-full bg-[#6B3E1E] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A66A32]"
            >
              View All Articles
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredArticles.length > ITEMS_PER_PAGE && (
          <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-[#6B3E1E]/10 pt-7 sm:flex-row">
            <p className="text-sm text-[#8A7D72]">
              Page{" "}
              <span className="font-semibold text-[#39312B]">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#39312B]">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#6B3E1E]/10 bg-white text-[#6B3E1E] transition-all duration-300 hover:border-[#6B3E1E]/30 hover:bg-[#FFF9F2] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1.5">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => {
                  const isActive = page === currentPage;

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-[#6B3E1E] text-white shadow-md shadow-[#6B3E1E]/10"
                          : "border border-[#6B3E1E]/10 bg-white text-[#6B3E1E] hover:bg-[#FFF9F2]"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next */}
              <button
                type="button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#6B3E1E]/10 bg-white text-[#6B3E1E] transition-all duration-300 hover:border-[#6B3E1E]/30 hover:bg-[#FFF9F2] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}