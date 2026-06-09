import { SubmitTaskForm } from "@/components/SubmitTaskForm";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f6f3] text-[#181816]">
      <SiteHeader />
      <main>
        <SubmitTaskForm />
      </main>
      <footer className="border-t border-black/[0.06] px-4 py-8 text-center text-xs text-neutral-500 sm:px-6 sm:text-sm">
        <p>© {new Date().getFullYear()} AI装修大师</p>
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
