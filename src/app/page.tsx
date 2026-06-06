import { CaseShowcase } from "@/components/CaseShowcase";
import { SubmitTaskForm } from "@/components/SubmitTaskForm";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <SiteHeader />
      <main>
        <SubmitTaskForm />
        <CaseShowcase />
      </main>
      <footer className="border-t border-white/[0.06] px-4 py-8 text-center text-xs text-zinc-600 sm:px-6 sm:text-sm">
        <p>© {new Date().getFullYear()} AI装修大师</p>
        <a
          href="/admin"
          className="mt-2 inline-block text-zinc-600 transition hover:text-zinc-400"
        >
          后台管理
        </a>
      </footer>
    </div>
  );
}
