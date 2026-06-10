"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type AdminNewTaskWatcherProps = {
  initialLatestTaskNumber: string | null;
};

export function AdminNewTaskWatcher({
  initialLatestTaskNumber,
}: AdminNewTaskWatcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const latestTaskNumberRef = useRef(initialLatestTaskNumber);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    latestTaskNumberRef.current = initialLatestTaskNumber;
    hasNavigatedRef.current = false;
  }, [initialLatestTaskNumber]);

  useEffect(() => {
    const checkForNewTask = async () => {
      try {
        const res = await fetch("/api/admin/tasks", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        const latestTaskNumber = data.tasks?.[0]?.task_number ?? null;

        if (!latestTaskNumber || latestTaskNumber === latestTaskNumberRef.current) {
          return;
        }

        latestTaskNumberRef.current = latestTaskNumber;
        if (hasNavigatedRef.current) return;

        hasNavigatedRef.current = true;
        if (pathname === "/admin") {
          router.refresh();
        } else {
          router.push("/admin");
        }
      } catch {
        // 后台轮询失败时保持当前页面，下一轮再试。
      }
    };

    const intervalId = window.setInterval(checkForNewTask, 6000);
    return () => window.clearInterval(intervalId);
  }, [pathname, router]);

  return null;
}
