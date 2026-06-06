import Image from "next/image";
import { SHOWCASE_CASES } from "@/lib/cases";

export function CaseShowcase() {
  return (
    <section
      id="cases"
      className="border-t border-white/[0.06] bg-[#080808] px-4 py-20 sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center sm:mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
            Showcase
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-4xl">
            案例展示
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-500 sm:text-base">
            真实户型一键焕新，原图与 AI 效果图对比
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {SHOWCASE_CASES.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition hover:border-white/[0.14] hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <h3 className="text-sm font-medium text-white">{item.title}</h3>
                <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs text-violet-300">
                  {item.tag}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-px bg-white/[0.06]">
                <CaseImage
                  src={item.before}
                  label="原图"
                  alt={`${item.title} 原图`}
                />
                <CaseImage
                  src={item.after}
                  label="AI效果图"
                  alt={`${item.title} AI效果图`}
                  highlight
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseImage({
  src,
  label,
  alt,
  highlight = false,
}: {
  src: string;
  label: string;
  alt: string;
  highlight?: boolean;
}) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 sm:aspect-square">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 50vw, 300px"
      />
      <span
        className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm sm:text-xs ${
          highlight
            ? "bg-violet-600/90 text-white"
            : "bg-black/60 text-zinc-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
