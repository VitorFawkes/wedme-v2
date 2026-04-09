"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const DEVICES = {
  iphone15: { name: "iPhone 15 Pro", w: 393, h: 852, radius: 55 },
  s24: { name: "Samsung S24", w: 360, h: 780, radius: 38 },
  iphone_se: { name: "iPhone SE", w: 375, h: 667, radius: 30 },
} as const;

type DeviceKey = keyof typeof DEVICES;

const BASE_URL = "https://wedmev2.vercel.app";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const initialPath = searchParams.get("path") || "/";

  const [device, setDevice] = useState<DeviceKey>("iphone15");
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

  const d = DEVICES[device];
  const frameW = landscape ? d.h : d.w;
  const frameH = landscape ? d.w : d.h;

  const scale = Math.min(1, (winH - 200) / (frameH + 40));

  return (
    <div className="min-h-dvh bg-[#1a1a1a] flex flex-col items-center justify-center gap-6 p-8 font-sans">
      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {/* Device selector */}
        <div className="flex gap-1 bg-[#2a2a2a] rounded-lg p-1">
          {(Object.keys(DEVICES) as DeviceKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                device === key
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {DEVICES[key].name}
            </button>
          ))}
        </div>

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

      {/* Device label */}
      <p className="text-white/40 text-xs">
        {d.name} — {frameW}x{frameH}
      </p>

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
            width: frameW + 24,
            height: frameH + 24,
            borderRadius: d.radius + 4,
            padding: 12,
          }}
        >
          {/* Dynamic Island (iPhone only) */}
          {device.startsWith("iphone") && device !== "iphone_se" && (
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-10"
              style={{
                top: 20,
                width: landscape ? 37 : 126,
                height: landscape ? 126 : 37,
              }}
            />
          )}

          {/* Side buttons */}
          {!landscape && (
            <>
              {/* Volume buttons (left) */}
              <div
                className="absolute bg-[#2a2a2a] rounded-full"
                style={{ left: -3, top: 180, width: 3, height: 36 }}
              />
              <div
                className="absolute bg-[#2a2a2a] rounded-full"
                style={{ left: -3, top: 224, width: 3, height: 36 }}
              />
              {/* Power button (right) */}
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
              borderRadius: d.radius,
              border: "none",
              display: "block",
            }}
            title={`Preview — ${d.name}`}
          />
        </div>
      </div>
    </div>
  );
}
