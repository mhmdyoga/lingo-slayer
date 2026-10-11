import type { Metadata } from "next";
import WorldGame from "@/components/world/WorldGame";

export const metadata: Metadata = { title: "Petualangan Ksatria | Blejar English!" };

export default function PlayPage() {
  return <WorldGame />;
}
