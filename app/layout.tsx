import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "履歷 RAG 聊天機器人",
  description: "基於履歷的 RAG 面試聊天系統"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
