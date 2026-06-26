import { SiteHeader } from "@/components/SiteHeader";
import { getAuthClaims } from "@/lib/auth";
import { getShowcaseCase, showcaseCases } from "@/lib/showcase-cases";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return showcaseCases.map((item) => ({ slug: item.slug }));
}

export default async function ShowcaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, claims] = await Promise.all([params, getAuthClaims()]);
  const item = getShowcaseCase(slug);

  if (!item) notFound();

  return (
    <div className="min-h-screen bg-[#f6f6f3] text-[#181816]">
      <SiteHeader currentUserEmail={claims?.email} />
      <main className="px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/#submit"
            className="mb-5 inline-flex text-sm font-medium text-neutral-500 transition hover:text-[#181816]"
          >
            返回首页
          </Link>

          <div className="overflow-hidden rounded-lg bg-white shadow-[0_24px_80px_rgba(24,24,22,0.08)] ring-1 ring-black/[0.04]">
            <div className="relative aspect-[16/10] bg-neutral-100">
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="p-5 sm:p-6">
              <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
                {item.title}
              </h1>

              <div className="mt-6">
                <h2 className="text-sm font-medium text-neutral-500">提示词</h2>
                <p className="mt-3 rounded-lg bg-[#f6f6f3] p-4 text-sm leading-7 text-[#2b2b28] ring-1 ring-black/[0.04]">
                  {item.prompt}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
