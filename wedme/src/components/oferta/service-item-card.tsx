"use client";

import { Check } from "lucide-react";
import type { ServiceItem } from "@/types";
import { formatBRL } from "@/lib/format";

type Props = {
  item: ServiceItem;
  selected: boolean;
  onToggle: (itemId: string) => void;
  isRadio?: boolean;
};

const CATEGORY_STYLES = {
  base: "border-primary/20 bg-primary/[0.03]",
  addon: "border-border",
  infrastructure: "border-amber-300/60 bg-amber-50/50",
} as const;

export function ServiceItemCard({ item, selected, onToggle, isRadio }: Props) {
  return (
    <button
      onClick={() => onToggle(item.id)}
      className={`group relative w-full text-left p-4 rounded-md border cursor-pointer transition-all duration-300 ease-out ${
        selected
          ? "border-primary bg-primary/10 ring-1 ring-primary/30 shadow-sm"
          : `${CATEGORY_STYLES[item.category]} hover:border-primary/50 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-none`
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-tight">
            {item.name}
          </p>
          {item.description && (
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-none">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            {formatBRL(item.price)}
          </span>
          {/* Radio circle for base items, checkbox for addons */}
          {isRadio ? (
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                selected
                  ? "border-primary"
                  : "border-border group-hover:border-primary/50"
              }`}
            >
              {selected && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </div>
          ) : (
            <div
              className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-all duration-300 ${
                selected
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "border-border bg-white group-hover:border-primary/50"
              }`}
            >
              {selected && <Check className="w-3 h-3" />}
            </div>
          )}
        </div>
      </div>

      {item.category === "infrastructure" && (
        <span className="mt-2 inline-block text-[10px] tracking-wide uppercase text-amber-700 font-medium">
          Infraestrutura
        </span>
      )}
    </button>
  );
}
