"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const DEVICE = { w: 360, h: 780, radius: 38 };

const BASE_URL = "https://wedmev2.vercel.app";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const initialPath = searchParams.get("path") || "/";

  const [landscape, setLandscape] = useState(false);
  const [path, setPath] = useState(initialPath);
  const [inputPath, setInputPath] = useState(initialPath);

  const [winH, setWinH] = useState(900);

  useEffect(() => {
    const update = () => setWinH(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const frameW = landscape ? DEVICE.h : DEVICE.w;
  const frameH = landscape ? DEVICE.w : DEVICE.h;

  const scale = Math.min(1, (winH - 200) / (frameH + 40));

  return (
    <div className="min-h-dvh bg-[#1a1a1a] flex flex-col items-center justify-center gap-6 p-8 font-sans">
      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {/* Rotate */}
        <button
          onClick={() => setLandscape(!landscape)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            landscape
              ? "bg-white text-black"
              : "bg-[#2a2a2a] text-white/60 hover:text-white"
          }`}
        >
          {landscape ? "Landscape" : "Portrait"}
        </button>

        {/* Path input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPath(inputPath.startsWith("/") ? inputPath : `/${inputPath}`);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputPath}
            onChange={(e) => setInputPath(e.target.value)}
            placeholder="/comece"
            className="px-3 py-1.5 rounded-lg bg-[#2a2a2a] text-white text-xs font-mono border border-white/10 w-40 focus:outline-none focus:border-white/30"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[#2a2a2a] text-white/60 hover:text-white text-xs font-medium transition-colors"
          >
            Ir
          </button>
        </form>
      </div>

      {/* Phone frame */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <div
          className="relative bg-black shadow-2xl"
          style={{
            width: frameW + 16,
            height: frameH + 16,
            borderRadius: DEVICE.radius + 4,
            padding: 8,
          }}
        >
          {/* Side buttons */}
          {!landscape && (
            <>
              <div
                className="absolute bg-[#2a2a2a] rounded-full"
                style={{ left: -3, top: 180, width: 3, height: 36 }}
              />
              <div
                className="absolute bg-[#2a2a2a] rounded-full"
                style={{ left: -3, top: 224, width: 3, height: 36 }}
              />
              <div
                className="absolute bg-[#2a2a2a] rounded-full"
                style={{ right: -3, top: 200, width: 3, height: 60 }}
              />
            </>
          )}

          {/* Screen */}
          <iframe
            src={`${BASE_URL}${path}`}
            className="bg-white"
            style={{
              width: frameW,
              height: frameH,
              borderRadius: DEVICE.radius,
              border: "none",
              display: "block",
            }}
            title="Preview mobile"
          />
        </div>
      </div>
    </div>
  );
}
