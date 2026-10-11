import type { Metadata } from "next";
import Game from "@/components/Game";

export const metadata: Metadata = { title: "Arena | Blejar English!" };

export default function ArenaPage() {
  return <Game />;
}
