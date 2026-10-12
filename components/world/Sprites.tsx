"use client";

import { useEffect, useRef, useState } from "react";
import { Knight, KnightPart, Rock, PineTree, type KnightPartName } from "../Scenery";
import type { Sprites } from "./engine";
import { MONSTER_IDS } from "@/lib/bestiary";

function loadPng(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error(src));
    im.src = src;
  });
}

/**
 * Merender SVG doodle ke DOM tersembunyi, lalu mengubahnya jadi gambar
 * yang bisa digambar cepat di canvas.
 */
export function useSprites(): { host: React.ReactNode; sprites: Sprites | null } {
  const ref = useRef<HTMLDivElement>(null);
  const [sprites, setSprites] = useState<Sprites | null>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let cancelled = false;
    const nodes = Array.from(host.querySelectorAll<HTMLElement>("[data-sprite]"));
    const ser = new XMLSerializer();
    Promise.all(
      nodes.map(
        (n) =>
          new Promise<[string, HTMLImageElement]>((resolve, reject) => {
            const svg = n.firstElementChild as SVGSVGElement;
            const clone = svg.cloneNode(true) as SVGSVGElement;
            const vb = (clone.getAttribute("viewBox") ?? "0 0 100 100").split(/\s+/).map(Number);
            const pad = 10;
            const [x, y, w, h] = [vb[0] - pad, vb[1] - pad, vb[2] + pad * 2, vb[3] + pad * 2];
            clone.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
            clone.setAttribute("width", String(w * 3));
            clone.setAttribute("height", String(h * 3));
            clone.removeAttribute("class");
            clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            const img = new Image();
            img.onload = () => resolve([n.dataset.sprite!, img]);
            img.onerror = () => reject(new Error(`sprite ${n.dataset.sprite}`));
            img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(ser.serializeToString(clone));
          }),
      ),
    ).then(async (pairs) => {
      const png = await Promise.all(
        MONSTER_IDS.flatMap((id) =>
          (["idle", "hurt", "dead"] as const).map(async (st) => [`m-${id}-${st}`, await loadPng(`/monsters/${id}-${st}.png`)] as [string, HTMLImageElement]),
        ),
      );
      if (!cancelled) setSprites(Object.fromEntries([...pairs, ...png]));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const host = (
    <div ref={ref} style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", visibility: "hidden" }} aria-hidden>
      <div data-sprite="tree">
        <PineTree />
      </div>
      <div data-sprite="rock">
        <Rock />
      </div>
      <div data-sprite="knight">
        <Knight />
      </div>
      {(["legL", "legR", "body", "armL", "armR"] as KnightPartName[]).map((n) => (
        <div key={n} data-sprite={`k-${n}`}>
          <KnightPart part={n} />
        </div>
      ))}
    </div>
  );
  return { host, sprites };
}
