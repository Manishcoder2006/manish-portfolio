"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { projects, techIconMap, type Project } from "@/lib/data";

export type ShowcaseProject = Project;
export const defaultProjects: ShowcaseProject[] = projects;

export function ProjectsShowcase({ projects: items = defaultProjects }: { projects?: ShowcaseProject[] }) {
  const [index, setIndex] = useState(0);
  const total = items.length;
  const current = items[index];

  const prev = () => setIndex((i) => (i === 0 ? total - 1 : i - 1));
  const next = () => setIndex((i) => (i === total - 1 ? 0 : i + 1));

  return (
    <div className="relative mx-auto max-w-[1360px] px-2 sm:px-6">
      {/* Previous navigation button */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous project"
        className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-14 rounded-full bg-white text-ink shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-ink/10"
      >
        <svg className="size-5 sm:size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Next navigation button */}
      <button
        type="button"
        onClick={next}
        aria-label="Next project"
        className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-14 rounded-full bg-flame text-white shadow-[0_8px_30px_rgba(245,135,26,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <svg className="size-5 sm:size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Large rounded cream/off-white project showcase panel */}
      <div className="overflow-hidden rounded-[28px] sm:rounded-[44px] bg-[#f8f5ee] border border-ink/8 p-7 sm:p-10 lg:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.4)] text-ink">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1.3fr] lg:gap-14">
          {/* Left Column: Project details */}
          <div className="flex flex-col justify-between">
            {/* Top row: Counter & Progress pills */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-sm sm:text-base font-bold text-flame tracking-wider">
                {current.num}
              </span>
              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === index ? "w-9 bg-flame" : "w-6 bg-ink/15 hover:bg-ink/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Project Title */}
            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink mt-5 mb-3">
              {current.title}
            </h3>

            {/* Description */}
            <p className="font-body text-base sm:text-lg leading-relaxed text-ink/80 max-w-lg mb-6">
              {current.description}
            </p>

            {/* Tech tags with official logos */}
            <div className="flex flex-wrap gap-2 mb-8">
              {current.tech.map((t) => {
                const icon = techIconMap[t];
                return (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-pill border border-ink/15 bg-white/70 px-3.5 py-1 text-xs sm:text-sm font-medium text-ink shadow-xs"
                  >
                    {icon && <Icon icon={icon} className="size-3.5 sm:size-4 shrink-0" aria-hidden="true" />}
                    <span>{t}</span>
                  </span>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5">
              {current.liveUrl && (
                <a
                  href={current.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-to-r from-amber via-flame to-[#f06018] px-6 sm:px-7 py-3 sm:py-3.5 font-body text-sm sm:text-base font-bold text-ink shadow-[0_4px_20px_rgba(245,135,26,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(245,135,26,0.5)] active:scale-[0.98]"
                >
                  <span>Live Demo</span>
                  <span className="text-lg leading-none">↗</span>
                </a>
              )}
              {current.playStoreUrl && (
                <a
                  href={current.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-pill border border-ink/30 bg-transparent px-6 sm:px-7 py-3 sm:py-3.5 font-body text-sm sm:text-base font-semibold text-ink transition-all duration-300 hover:bg-ink/5 hover:border-ink/60 active:scale-[0.98]"
                >
                  <Icon icon="logos:google-play-icon" className="size-4 shrink-0" aria-hidden="true" />
                  <span>Play Store</span>
                </a>
              )}
              {current.githubUrl && (
                <a
                  href={current.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-pill border border-ink/30 bg-transparent px-6 sm:px-7 py-3 sm:py-3.5 font-body text-sm sm:text-base font-semibold text-ink transition-all duration-300 hover:bg-ink/5 hover:border-ink/60 active:scale-[0.98]"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Project Device Mockup */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-[620px]">
              {/* Laptop Screen Bezel */}
              <div className={`relative rounded-t-[16px] sm:rounded-t-[20px] border-[6px] sm:border-[8px] border-[#18181b] ${current.imageBg || "bg-[#09090b]"} shadow-[0_15px_40px_rgba(0,0,0,0.4)] overflow-hidden aspect-[16/10]`}>
                {/* Camera Notch */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 size-1.5 rounded-full bg-[#27272a]" />
                {/* Project Screenshot / Visual */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.image}
                  alt={`${current.title} preview`}
                  className={`size-full ${current.imageFit === "contain" ? "object-contain" : "object-cover"} ${current.imagePosition || "object-top"} transition-opacity duration-300`}
                />
              </div>
              {/* Laptop Base */}
              <div className="relative h-3 sm:h-4 w-[104%] -ml-[2%] rounded-b-lg sm:rounded-b-xl bg-gradient-to-r from-[#27272a] via-[#3f3f46] to-[#27272a] border-t border-[#52525b] shadow-md flex justify-center">
                <div className="h-1 w-12 sm:w-16 rounded-b-sm bg-[#18181b]/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
