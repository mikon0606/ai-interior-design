import { SubmitTaskForm } from "@/components/SubmitTaskForm";
import { SiteHeader } from "@/components/SiteHeader";
import { getAuthClaims } from "@/lib/auth";
import { showcaseCases } from "@/lib/showcase-cases";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const claims = await getAuthClaims();

  return (
    <div className="min-h-screen bg-[#f1ece3] text-[#211d1a]">
      <SiteHeader currentUserEmail={claims?.email} />
      <main>
        <SubmitTaskForm userEmail={claims?.email} />
        <ShowcaseSection />
      </main>
      <footer className="font-sans px-4 pb-8 pt-2 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[#786f66] sm:px-6">
        <p>AI装修大师 © {new Date().getFullYear()}</p>
        <a
          href="/admin"
          className="mt-2 inline-block transition hover:text-[#211d1a]"
        >
          后台管理
        </a>
      </footer>
    </div>
  );
}

function ShowcaseSection() {
  return (
    <section className="px-4 pb-16 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-7xl border-t border-[#211d1a]/18 pt-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-extrabold uppercase leading-none tracking-[0.14em] text-[#211d1a] sm:text-3xl">
            效果图案例
          </h2>
          <p className="max-w-md text-sm leading-7 text-[#786f66]">
            保留真实设计语境，用于给设计师快速判断提案方向。
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {showcaseCases.map((item) => (
            <Link
              key={item.slug}
              href={"/showcase/" + item.slug}
              className="group border border-[#211d1a]/12 bg-[#faf7ef]/60 transition hover:-translate-y-0.5 hover:border-[#c66f51]/70"
            >
              <div className="grid grid-cols-2 gap-px bg-[#211d1a]/12">
                <CaseImage
                  src={item.originalSrc}
                  alt={item.title + item.originalLabel}
                  priority={item.slug === showcaseCases[0].slug}
                />
                <CaseImage
                  src={item.resultSrc}
                  alt={item.title + item.resultLabel}
                  priority={item.slug === showcaseCases[0].slug}
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <h3 className="text-sm font-semibold text-[#211d1a]">
                  {item.title}
                </h3>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#c66f51]">
                  Before / After
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority: boolean;
}) {
  return (
    <div className="relative aspect-[4/3] bg-[#e6ded2]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 240px, (min-width: 640px) 25vw, 50vw"
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        priority={priority}
      />
    </div>
  );
}
