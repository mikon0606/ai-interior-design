import { SubmitTaskForm } from "@/components/SubmitTaskForm";
import { SiteHeader } from "@/components/SiteHeader";
import { getAuthClaims } from "@/lib/auth";
import Image from "next/image";

export const dynamic = "force-dynamic";

const showcaseItems = [
  {
    title: "现代极简客厅",
    note: "适合客户沟通的空间氛围提案",
    src: "/showcase/living-room-minimal.png",
  },
  {
    title: "轻奢主卧",
    note: "材质、灯光和软装方向预览",
    src: "/showcase/master-bedroom-luxe.png",
  },
  {
    title: "奶油风餐厨",
    note: "开放式餐厨布局效果参考",
    src: "/showcase/kitchen-dining-cream.png",
  },
  {
    title: "日式卫浴",
    note: "卫浴干湿分区和氛围提案",
    src: "/showcase/spa-bathroom-japanese.png",
  },
];

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
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-normal text-[#181816] sm:text-2xl">
              可用于客户沟通的提案效果图
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              围绕室内设计师的真实沟通场景，先展示空间风格、材质和布局方向。
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {showcaseItems.map((item) => (
            <article
              key={item.src}
              className="overflow-hidden rounded-lg bg-white shadow-[0_18px_50px_rgba(24,24,22,0.06)] ring-1 ring-black/[0.04]"
            >
              <div className="relative aspect-[16/10] bg-neutral-100">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  priority={item.src === showcaseItems[0].src}
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <h3 className="text-sm font-medium text-[#181816]">
                  {item.title}
                </h3>
                <p className="text-right text-xs text-neutral-500">
                  {item.note}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
