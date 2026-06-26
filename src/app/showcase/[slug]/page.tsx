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

          <div className="rounded-lg bg-white p-4 shadow-[0_24px_80px_rgba(24,24,22,0.08)] ring-1 ring-black/[0.04] sm:p-5">
            <h1 className="mb-5 px-1 text-2xl font-semibold tracking-normal sm:text-3xl">
              {item.title}
            </h1>

            <div className="grid gap-4 lg:grid-cols-2">
              <DetailImage
                src={item.originalSrc}
                alt={item.title + item.originalLabel}
                label={item.originalLabel}
              />
              <DetailImage
                src={item.resultSrc}
                alt={item.title + item.resultLabel}
                label={item.resultLabel}
              />
            </div>

            <div className="p-5 sm:p-6">
              <h2 className="text-sm font-medium text-neutral-500">提示词</h2>
              <p className="mt-3 rounded-lg bg-[#f6f6f3] p-4 text-sm leading-7 text-[#2b2b28] ring-1 ring-black/[0.04]">
                {item.prompt}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailImage({
  src,
  alt,
  label,
}: {
  src: string;
  alt: string;
  label: string;
}) {
  return (
    <figure>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 480px, 100vw"
          className="object-cover"
          priority
        />
      </div>
      <figcaption className="mt-2 px-1 text-sm font-medium text-neutral-500">
        {label}
      </figcaption>
    </figure>
  );
}
