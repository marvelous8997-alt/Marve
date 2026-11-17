"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="border-b border-[#F3EEE8] bg-white px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/search"
          className="flex h-11 items-center gap-3 rounded-lg bg-[#F8F5F0] px-4 text-sm text-[#8A7D72] transition-colors hover:bg-[#F3EEE8]"
        >
          <Search size={18} strokeWidth={1.6} />
          <span>Search products...</span>
        </Link>
      </div>
    </div>
  );
}