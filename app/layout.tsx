import type { Metadata, Viewport } from "next";
import "@fontsource/bagel-fat-one";
import "@fontsource/patrick-hand";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { DoodleDefs } from "@/components/Monsters";

export const metadata: Metadata = {
  title: "Lingo Slayer | Game Monster Spelling",
  description:
    "Game belajar bahasa Inggris yang menyenangkan untuk anak SD. Susun huruf, kalahkan monster doodle!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffdf6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <DoodleDefs />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
