import { SubmitTaskForm } from "@/components/SubmitTaskForm";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f6f3] text-[#181816]">
      <SiteHeader />
      <main>
        <SubmitTaskForm />
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
