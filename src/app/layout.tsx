import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI装修大师 - 人工审核装修效果图",
  description:
    "上传房间照片并提交装修需求，人工为您生成专业装修效果图。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
