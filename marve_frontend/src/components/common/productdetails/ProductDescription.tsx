
interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  const productDescription =
    description?.trim() ||
    "Discover thoughtful design and everyday functionality with this MARVE product.";

  return (
    <section className="mt-16 border-t border-[#E7DED4] pt-10 sm:mt-20 sm:pt-14">
      <div className="mx-auto max-w-4xl">
        {/* Eyebrow */}

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A66A32]">
          Made for everyday living
        </p>

        {/* Heading */}

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#29231F] sm:text-3xl">
          Product Description
        </h2>

        {/* Description Content */}

        <div className="mt-5 rounded-2xl border border-[#E7DED4] bg-[#FCFAF7] p-5 sm:p-7">
          <p className="whitespace-pre-line text-sm leading-8 text-[#76685D]">
            {productDescription}
          </p>
        </div>
      </div>
    </section>
  );
}
