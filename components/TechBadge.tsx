"use client";

import { Icon } from "@iconify/react";
import { techIconMap } from "@/lib/data";

interface TechBadgeProps {
  name: string;
  className?: string;
}

export function TechBadge({ name, className = "" }: TechBadgeProps) {
  const icon = techIconMap[name];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill border border-ink/15 bg-white/80 px-3 py-1 text-xs sm:text-sm font-medium text-ink shadow-xs transition-colors hover:border-ink/30 ${className}`}
    >
      {icon ? (
        <Icon icon={icon} className="size-3.5 sm:size-4 shrink-0" aria-hidden="true" />
      ) : null}
      <span>{name}</span>
    </span>
  );
}

export function TechBadgeList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((tech) => (
        <TechBadge key={tech} name={tech} />
      ))}
    </div>
  );
}
