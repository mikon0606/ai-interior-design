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
    <div className="min-h-screen bg-[#f6f6f3] text-[#181816]">
      <SiteHeader currentUserEmail={claims?.email} />
      <main>
        <SubmitTaskForm userEmail={claims?.email} />
        <ShowcaseSection />
      </main>
      <footer className="px-4 pb-8 pt-2 text-center text-xs text-neutral-500 sm:px-6">
        <p>AI装修大师 © {new Date().getFullYear()}</p>
        <a
          href="/admin"
          className="mt-2 inline-block text-neutral-500 transition hover:text-neutral-900"
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
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-5 text-xl font-semibold tracking-normal text-[#181816] sm:text-2xl">
          效果图案例
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {showcaseCases.map((item) => (
            <Link
              key={item.slug}
              href={"/showcase/" + item.slug}
              className="group overflow-hidden rounded-lg bg-white shadow-[0_18px_50px_rgba(24,24,22,0.06)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(24,24,22,0.1)]"
            >
              <div className="relative aspect-[16/10] bg-neutral-100">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  priority={item.src === showcaseCases[0].src}
                />
              </div>
              <h3 className="px-4 py-3 text-sm font-medium text-[#181816]">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
