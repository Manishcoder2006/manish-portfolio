// The whole one-page site. Sections are server components styled with Tailwind utilities.
// Keep the ids, data-8b-* attributes and the plain class names (hero__aperture, case__img, …):
// lib/motion.ts finds its elements through them. Demo text is the template's: replace it with yours.
import { type ComponentProps, type CSSProperties } from "react";
import { ContactForm, Motion, Navigation } from "@/components/client";
import { TechBadge } from "@/components/TechBadge";
import { photoSrc, photoSrcSet, photos, type Photo as PhotoData } from "@/lib/photos";
import { contactEmail, contactPhone, contactPhoneRaw, linkedinUrl, githubUrl } from "@/lib/site";
import { featuredProjects } from "@/lib/data";

// ---------------------------------------------------------------- content

const navLinks = [
  { href: "#statement", label: "About" },
  { href: "#again", label: "Skills" },
  { href: "#capabilities", label: "Projects" },
  { href: "#method", label: "Journey" },
  { href: "#contact", label: "Contact" },
] as const;



// Six core expertise areas representing Manav's skills.
const partners = [
  {
    tag: "AI",
    name: "AI & LLM Engineering",
    line: "Building intelligent applications with LLMs, RAG pipelines, AI agents, LangChain, LangGraph and production AI systems.",
  },
  {
    tag: "Full-Stack",
    name: "Web & Full-Stack Development",
    line: "Building modern web applications using React, Next.js, Node.js, FastAPI, databases and scalable backend architectures.",
  },
  {
    tag: "Mobile",
    name: "Mobile App Development",
    line: "Creating cross-platform mobile applications using React Native, Expo, Firebase and modern mobile technologies.",
  },
  {
    tag: "ML",
    name: "Machine Learning & Deep Learning",
    line: "Exploring intelligent models using Python, PyTorch, TensorFlow, Scikit-learn, NLP and Computer Vision.",
  },
  {
    tag: "Product",
    name: "Product Building & Leadership",
    line: "Turning ideas into working products through hackathons, collaboration, problem-solving and end-to-end product development.",
  },
  {
    tag: "Speaking",
    name: "Communication & Public Speaking",
    line: "Sharing technical knowledge through speaking engagements, workshops, community leadership and developer mentoring.",
  },
];

// Eight portfolio projects in exact required priority order are imported from @/lib/data.

const steps: {
  title: string;
  company: string;
  text: string;
  highlights?: string[];
}[] = [
  {
    title: "5+ Hackathon Finalist",
    company: "Open-Source Contributor",
    text: "Participated in multiple hackathons, reached finalist stages in 5+ competitions, and contributed to open-source development through collaborative projects.",
  },
  {
    title: "AI Engineer",
    company: "at TECHXNAVAYA Private Limited",
    text: "Developing AI-powered applications and intelligent agentic workflows using LLMs, RAG pipelines, LangGraph, and modern AI frameworks, with a focus on scalable backend and full-stack integrations.",
  },
  {
    title: "Freelancer",
    company: "at YourDevelopers",
    text: "Delivering end-to-end web development and AI-powered solutions, transforming client requirements into functional, scalable digital products.",
  },
  {
    title: "Co-Founder",
    company: "at Campus Ninja",
    text: "Co-founded Campus Ninja, an educational and counselling community helping students navigate B.Tech admissions through college guidance, admission updates, cutoff analysis, and personalized counselling. Built and manage a community of 700+ students across multiple IPU college groups, along with a YouTube channel with 300+ subscribers.",
    highlights: [
      "Built and manage a community of 700+ students.",
      "Manage multiple IPU college student groups.",
      "Help students with B.Tech admissions and counselling.",
      "Provide college selection guidance and admission updates.",
      "Built a YouTube audience of 300+ subscribers.",
    ],
  },
];

// Four core capabilities for the About section.
const aboutCapabilities = [
  {
    title: "AI Engineering",
    desc: "LLMs, RAG, Agents, and real-world AI applications.",
    highlight: true,
  },
  {
    title: "Full-Stack Development",
    desc: "Scalable, secure, and production-ready web apps.",
    highlight: false,
  },
  {
    title: "Mobile Development",
    desc: "Cross-platform apps with a clean and intuitive UX.",
    highlight: false,
  },
  {
    title: "Freelance Work",
    desc: "Delivering end-to-end solutions for individuals and startups.",
    highlight: false,
  },
] as const;

// Verified statistics for the About section.
const aboutStats = [
  { value: "10+", label: "Projects Built" },
  { value: "5K+", label: "Users Impacted" },
  { value: "3+", label: "Years of Experience" },
] as const;

// The community WhatsApp link used in contact and footer.
const whatsapp = { href: "https://chat.whatsapp.com/H6wijRlqBtBG9mi3wUSSgp", target: "_blank", rel: "noopener noreferrer" };

// ---------------------------------------------------------------- small parts

/** Photo with the srcset, sizes and crop tuned for its slot (see lib/photos.ts). */
function Photo({ photo, className }: { photo: PhotoData; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      srcSet={photoSrcSet(photo)}
      sizes={photo.sizes}
      style={{ background: photo.bg }}
      src={photoSrc(photo)}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading={photo.lazy ? "lazy" : undefined}
      fetchPriority={photo.priority ? "high" : undefined}
    />
  );
}

/** The orange full stop that ends every section heading. */
function Dot({ className ="" }: { className?: string }) {
  return <span className={`m-dot ${className}`.trim()} aria-hidden="true" />;
}

/** Text link with the arrow that slides on hover. */
function ArrowLink({ className ="", children, ...rest }: ComponentProps<"a">) {
  return (
    <a className={`m-link ${className}`.trim()} {...rest}>
      <span className="m-link__label">{children}</span>
      <svg className="m-link__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" /></svg>
    </a>
  );
}

/** Heading, then lead paragraph, on one row (stacks on phones). */
const head ="flex flex-wrap items-end justify-between gap-x-10 gap-y-4";

// ---------------------------------------------------------------- sections

function Hero() {
  return (
    <section id="hero" data-8b-section="hero" aria-labelledby="hero-title" className="relative z-3 flex min-h-[max(100svh,640px)] items-center overflow-x-clip overflow-y-visible bg-ink px-(--space-1) pt-[clamp(90px,13vh,130px)] pb-[clamp(40px,7vh,80px)] text-paper">
      <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-12 min-[900px]:grid-cols-[1.25fr_1fr] min-[900px]:gap-8">
        <div className="hero__intro grid content-start justify-items-start gap-6 max-w-2xl">
          <div className="inline-flex items-center rounded-pill border border-flame/80 px-4 py-1.5 font-body text-xs sm:text-sm font-medium text-paper">
            AI Engineer · Full-Stack Developer · Freelancer
          </div>
          <h1 id="hero-title" className="font-display text-[clamp(40px,5.6vw,78px)] font-extrabold tracking-[-0.04em] leading-[1.08] text-paper">
            Hey, I&apos;m <span className="hero__word inline-block text-flame">Manav Gupta.</span>
          </h1>
          <p className="max-w-[540px] font-body text-base sm:text-lg md:text-[19px] font-normal leading-[1.65] text-paper/85">
            I build AI-powered web and mobile products, and also work as a freelancer helping individuals and startups turn their ideas into real solutions.
          </p>
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2">
            <a
              href="#capabilities"
              className="inline-flex items-center justify-center rounded-pill bg-gradient-to-r from-amber via-flame to-[#f06018] px-7 py-3.5 font-body text-base font-bold text-ink shadow-[0_4px_20px_rgba(245,135,26,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(245,135,26,0.5)] active:scale-[0.98]"
            >
              View My Work →
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-pill border border-paper/60 px-7 py-3.5 font-body text-base font-semibold text-paper transition-all duration-300 hover:border-paper hover:bg-paper/10 active:scale-[0.98]"
            >
              Let&apos;s Connect
            </a>
            <a
              href="/manav_gupta_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-pill border border-flame/75 px-6 py-3.5 font-body text-base font-semibold text-paper transition-all duration-300 hover:border-flame hover:bg-flame/15 active:scale-[0.98]"
            >
              <svg className="size-4 text-flame flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>Resume</span>
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center min-[900px]:justify-end py-6 min-[900px]:py-0">
          <div className="relative size-[min(76vw,320px)] sm:size-[360px] min-[900px]:size-[clamp(360px,29vw,450px)] aspect-square">
            <div className="hero__stage relative size-full" style={{ transformOrigin: "50% 50%" }}>
              <span className="hero__orbit absolute -inset-[10%] block rounded-pill border border-paper/16">
                <span className="absolute right-0 top-1/2 -mr-[4.5%] -mt-[4.5%] size-[9%] rounded-pill bg-flame shadow-[0_0_16px_var(--color-flame)]" />
              </span>
              <span className="hero__aperture absolute inset-0 block overflow-hidden rounded-pill border border-flame/40 bg-black shadow-[0_0_90px_color-mix(in_srgb,var(--color-flame)_32%,transparent)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="size-full object-cover object-[center_20%]"
                  src="/logo-mark.jpg"
                  width={1024}
                  height={1024}
                  alt="Manav Gupta"
                  fetchPriority="high"
                />
                <span className="hero__tint pointer-events-none absolute inset-0 bg-flame opacity-0" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section id="statement" data-8b-section="statement" aria-labelledby="statement-title" className="relative overflow-hidden bg-paper px-(--space-1) py-(--space-2) text-ink">
      {/* Subtle ambient decorative glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-flame/5 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 size-96 rounded-full bg-amber/5 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-[1360px]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* Left section — About introduction */}
          <div className="grid content-start justify-items-start gap-6">
            <div className="inline-flex items-center gap-2 rounded-pill bg-[#fff1e5] px-3.5 py-1 text-xs sm:text-sm font-semibold text-flame">
              <span className="size-2 rounded-full bg-flame" aria-hidden="true" />
              About Me
            </div>
            <h2 id="statement-title" className="font-display text-[clamp(32px,4vw,54px)] font-bold tracking-tight leading-[1.12] text-ink">
              <span className="statement__line block">More Than a Developer,</span>
              <span className="statement__line block">
                I Build End-to-End <span className="text-flame">AI</span>
              </span>
              <span className="statement__line block">
                <span className="text-flame">
                  Products<Dot className="statement__dot" />
                </span>
              </span>
            </h2>
            <p data-8b-motion="ink" className="max-w-xl font-body text-[15px] sm:text-[17px] leading-[1.65] text-[#4a453e]">
              I&apos;m an AI Engineer and Full-Stack Developer who turns ideas into intelligent, production-ready software — from LLM applications and agentic workflows to scalable web and mobile products.
            </p>
            <div className="border-l-[3.5px] border-flame pl-4 py-1 mt-1 max-w-xl">
              <p className="font-body text-[15px] sm:text-[16.5px] font-semibold italic text-ink leading-snug">
                I build practical, scalable and user-focused products that bring intelligence and real-world impact together.
              </p>
            </div>
          </div>

          {/* Right section — Four capability cards in 2x2 grid */}
          <ul className="statement__index grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:pt-11 xl:pt-14" aria-label="Core Capabilities">
            {aboutCapabilities.map((card) => (
              <li
                key={card.title}
                className={`relative flex flex-col justify-center rounded-[24px] p-6 sm:p-7 min-h-[148px] transition-all duration-300 hover:-translate-y-1 opacity-100 ${
                  card.highlight
                    ? "border-2 border-flame bg-[#fff9f4] shadow-[0_6px_24px_rgba(245,135,26,0.08)] hover:shadow-[0_10px_32px_rgba(245,135,26,0.15)]"
                    : "border border-ink/10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-ink/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)]"
                }`}
              >
                <h3 className="font-display text-xl sm:text-[22px] font-bold tracking-tight text-ink mb-2">
                  {card.title}
                </h3>
                <p className="font-body text-sm sm:text-[15px] leading-relaxed text-[#55504a]">
                  {card.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom statistics row */}
        <div className="mt-14 sm:mt-20 pt-6">
          <div className="flex flex-wrap items-center gap-8 sm:gap-14">
            {aboutStats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-8 sm:gap-14">
                <div>
                  <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-flame leading-none">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-body text-sm sm:text-base font-semibold text-[#4a453e]">
                    {stat.label}
                  </div>
                </div>
                {i < aboutStats.length - 1 && (
                  <div className="hidden h-10 w-[1.5px] bg-flame/30 sm:block" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Again() {
  return (
    <section id="again" data-8b-section="again" aria-labelledby="again-title" className="relative bg-ink text-paper">
      <div className="again__plate absolute inset-x-0 top-0 -bottom-0.5 bg-ink" aria-hidden="true" />
      <div className="again__stage relative px-(--space-1) pt-[calc(var(--space-2)*0.7)] pb-(--space-2)">
        <div className={`again__head ${head}`}>
          <h2 className="m-text-3" id="again-title">Built around what I do best<Dot /></h2>
          <p className="m-text-5 max-w-[27rem] text-fog">Six core areas of expertise spanning AI systems, intelligent workflows, and full-stack engineering.</p>
        </div>
        <div className="again__swing mt-[clamp(40px,7vh,72px)]">
          <ul className="again__wheel grid grid-cols-[minmax(0,1fr)] gap-4 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-3">
            {partners.map((partner, i) => (
              <li key={partner.name} className="partner">
                <div className="partner__card relative block aspect-[4/5] overflow-hidden rounded-card bg-night border border-paper/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                  <Photo photo={photos.again[i]} className="absolute inset-0 size-full object-cover" />
                  <span className="sr-only">
                    {partner.tag}: {partner.name}. {partner.line}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section id="capabilities" data-8b-section="capabilities" aria-labelledby="capabilities-title" className="relative bg-ink px-(--space-1) pt-[calc(var(--space-2)*0.6)] pb-(--space-2) text-paper">
      <div className="mx-auto max-w-[1360px] mb-[clamp(40px,7vh,72px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-pill bg-flame/10 px-3.5 py-1 text-xs sm:text-sm font-semibold text-flame mb-3">
            <span className="size-2 rounded-full bg-flame" aria-hidden="true" />
            Selected Work
          </div>
          <h2 className="m-text-3 font-display tracking-tight" id="capabilities-title" data-8b-motion="rise">
            My <span className="text-flame">Projects<Dot /></span>
          </h2>
        </div>
        <p className="m-text-5 max-w-[30rem] text-fog">
          A showcase of the products I&apos;ve built — from AI-powered systems to full-stack applications and mobile experiences.
        </p>
      </div>

      <ol className="mx-auto max-w-[1360px] grid gap-6">
        {featuredProjects.map((project) => (
          <li
            key={project.id}
            className="service m-surface relative grid grid-cols-1 gap-8 overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#f8f5ee] border border-ink/8 p-[clamp(24px,3.2vw,44px)] shadow-[0_-18px_50px_color-mix(in_srgb,var(--color-ink)_45%,transparent)] min-[900px]:h-[min(64svh,580px)] min-[900px]:min-h-[440px] min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1.25fr)] min-[900px]:gap-[clamp(28px,3.5vw,52px)] text-ink"
          >
            {/* Left Content */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-sm sm:text-base font-bold text-flame tracking-wider">
                    {project.num}
                  </span>
                  <span className="inline-flex items-center rounded-pill bg-ink/5 px-3 py-0.5 text-xs font-semibold tracking-wider uppercase text-slate">
                    {project.category}
                  </span>
                </div>
                <h3 className="m-text-4 text-ink font-display font-extrabold tracking-tight mb-3">
                  {project.title}
                </h3>
                <p className="m-text-5 max-w-lg text-slate leading-relaxed mb-6">
                  {project.line}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t) => (
                    <TechBadge key={t} name={t} />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-to-r from-amber via-flame to-[#f06018] px-5 sm:px-6 py-2.5 sm:py-3 font-body text-sm sm:text-base font-bold text-ink shadow-[0_4px_18px_rgba(245,135,26,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_24px_rgba(245,135,26,0.5)] active:scale-[0.98]"
                  >
                    <span>{project.id === "velocity" ? "Download APK" : "Live Demo"}</span>
                    <span className="text-base leading-none">↗</span>
                  </a>
                )}
                {project.playStoreUrl && (
                  <a
                    href={project.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-pill border border-ink/25 bg-transparent px-5 sm:px-6 py-2.5 sm:py-3 font-body text-sm sm:text-base font-semibold text-ink transition-all duration-300 hover:bg-ink/5 hover:border-ink/60 active:scale-[0.98]"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="m22.018 13.298l-3.919 2.218l-3.515-3.493l3.543-3.521l3.891 2.202a1.49 1.49 0 0 1 0 2.594M1.337.924a1.5 1.5 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087zm12.207 10.065l3.258-3.238L3.45.195a1.47 1.47 0 0 0-.946-.179zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54z"/>
                    </svg>
                    <span>Play Store</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-pill border border-ink/25 bg-transparent px-5 sm:px-6 py-2.5 sm:py-3 font-body text-sm sm:text-base font-semibold text-ink transition-all duration-300 hover:bg-ink/5 hover:border-ink/60 active:scale-[0.98]"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Mockup */}
            <div className="relative flex items-center justify-center min-[900px]:h-full">
              <div className="w-full max-w-[560px]">
                <div className={`relative rounded-t-[14px] sm:rounded-t-[18px] border-[5px] sm:border-[7px] border-[#18181b] ${project.imageBg || "bg-[#09090b]"} shadow-[0_15px_35px_rgba(0,0,0,0.35)] overflow-hidden aspect-[16/10]`}>
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 size-1.5 rounded-full bg-[#27272a]" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    className={`size-full ${project.imageFit === "contain" ? "object-contain" : "object-cover"} ${project.imagePosition || "object-top"}`}
                  />
                </div>
                <div className="relative h-2.5 sm:h-3.5 w-[104%] -ml-[2%] rounded-b-md sm:rounded-b-lg bg-gradient-to-r from-[#27272a] via-[#3f3f46] to-[#27272a] border-t border-[#52525b] shadow-xs flex justify-center">
                  <div className="h-0.5 sm:h-1 w-10 sm:w-14 rounded-b-sm bg-[#18181b]/60" />
                </div>
              </div>
            </div>

            {/* Shade element required by lib/motion.ts capabilitiesScene */}
            <span className="service__shade pointer-events-none absolute inset-0 bg-ink opacity-0 rounded-[28px] sm:rounded-[36px]" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </section>
  );
}

function Method() {
  return (
    <section id="method" data-8b-section="method" aria-labelledby="method-title" className="relative bg-paper px-(--space-1) py-(--space-2) text-ink">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid grid-cols-[minmax(0,1fr)_88px] sm:grid-cols-[minmax(0,1fr)_100px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-x-4 sm:gap-x-6 lg:gap-x-16 items-start">
          {/* Left Column wrapper (unwrapped on mobile via contents; intact sticky unit on desktop) */}
          <div className="contents lg:block lg:sticky lg:top-[clamp(80px,12svh,110px)] lg:self-start">
            <div className="col-span-full mb-8 sm:mb-12 lg:mb-0">
              <h2 className="font-display text-[clamp(38px,5.2vw,72px)] font-extrabold tracking-tight leading-[0.94] text-ink" id="method-title" data-8b-motion="rise">
                My Professional<br />Journey<Dot />
              </h2>
              <p className="font-body text-base sm:text-lg leading-relaxed text-slate max-w-[28rem] mt-5" data-8b-motion="ink">
                The key milestones that have shaped my skills, experience, and entrepreneurial journey so far.
              </p>
            </div>

            {/* Circular Timeline Animation Graphic */}
            <div
              className="method__ring relative col-start-2 row-start-2 w-full aspect-square max-w-[88px] sm:max-w-[100px] lg:max-w-[320px] lg:mt-12 lg:col-auto lg:row-auto justify-self-end lg:justify-self-start sticky top-[104px] lg:static z-10"
              aria-hidden="true"
            >
              <svg className="absolute inset-0 size-full -rotate-90 overflow-visible" viewBox="0 0 400 400">
                <circle className="fill-none stroke-ink/14 stroke-[1.5]" cx="200" cy="200" r="170" />
                <circle className="method__arc fill-none stroke-flame stroke-[5] [stroke-linecap:round]" cx="200" cy="200" r="170" pathLength="1" strokeDasharray="1 1" strokeDashoffset="0" />
              </svg>
              {[[0, -1], [1, 0], [0, 1], [-1, 0]].map(([x, y]) => (
                <span key={`${x},${y}`} className="method__station absolute top-[calc(50%+42.5%*var(--y))] left-[calc(50%+42.5%*var(--x))] -mt-[4.5%] -ml-[4.5%] size-[9%] rounded-pill bg-flame" style={{ "--x": x, "--y": y } as CSSProperties} />
              ))}
              <span className="method__arm absolute inset-[7.5%]">
                <span className="absolute top-0 left-1/2 -mt-[7.5%] -ml-[7.5%] size-[15%] rounded-pill border-[3px] border-flame bg-paper" />
              </span>
            </div>
          </div>

          {/* Right Column: Four Professional Journey Entries */}
          <ol className="method__steps col-start-1 row-start-2 grid gap-[clamp(48px,14vh,130px)] lg:col-auto lg:row-auto lg:pt-[2svh] lg:pb-[14svh]">
            {steps.map((step) => (
              <li key={step.title} className="step grid gap-2.5 border-l-[3px] border-flame/80 pl-4 sm:pl-8 transition-opacity duration-300">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight text-ink leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-flame font-body text-base sm:text-lg font-bold mt-1">
                    {step.company}
                  </p>
                </div>
                <p className="font-body text-base sm:text-lg leading-relaxed text-slate max-w-[34rem]">
                  {step.text}
                </p>
                {step.highlights && step.highlights.length > 0 && (
                  <ul className="mt-2 grid gap-1.5 font-body text-sm sm:text-[15px] text-slate/90 max-w-[34rem]">
                    {step.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-flame font-bold leading-normal">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" data-8b-section="contact" aria-labelledby="contact-title" className="bg-brand relative px-(--space-1) py-(--space-2) text-ink">
      <h2 className="m-text-3 contact__title text-[length:min(14.5vw,calc((100vw-2*var(--space-1))/(var(--len)*0.52)))] leading-[0.86] whitespace-nowrap [&_.m-dot]:bg-ink" id="contact-title" style={{ "--len": 18 } as CSSProperties}>
        <span className="contact__voice">Let&apos;s collaborate</span><Dot />
      </h2>
      <div className="mt-[clamp(40px,8vh,88px)] grid grid-cols-[minmax(0,1fr)] gap-12 min-[1000px]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] min-[1000px]:gap-[6vw]">
        <div className="grid content-start gap-8">
          <p className="font-body text-base sm:text-lg lg:text-[19px] leading-[1.6] text-ink/90 max-w-[32rem]">
            Have a project idea, collaboration opportunity or just want to talk about AI, products or technology? I&apos;d love to hear from you.
          </p>
          <ul className="grid gap-6">
            <li className="grid gap-1">
              <p className="font-body text-xs sm:text-sm font-semibold uppercase tracking-wider text-ink/75">Email</p>
              <a className="font-display text-xl sm:text-2xl font-bold text-ink hover:underline w-fit" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            </li>
            <li className="grid gap-1">
              <p className="font-body text-xs sm:text-sm font-semibold uppercase tracking-wider text-ink/75">Phone</p>
              <a className="font-display text-xl sm:text-2xl font-bold text-ink hover:underline w-fit" href={`tel:${contactPhoneRaw}`}>
                {contactPhone}
              </a>
            </li>
            <li className="grid gap-1">
              <p className="font-body text-xs sm:text-sm font-semibold uppercase tracking-wider text-ink/75">Location</p>
              <p className="font-display text-xl sm:text-2xl font-bold text-ink">New Delhi, India</p>
            </li>
            <li className="grid gap-1">
              <p className="font-body text-xs sm:text-sm font-semibold uppercase tracking-wider text-ink/75">Available for</p>
              <p className="font-display text-lg sm:text-xl font-bold text-ink">Freelance • Collaborations • Full-time Roles</p>
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 pt-2">
            <a
              className="inline-flex items-center gap-2 font-display text-base sm:text-lg font-bold text-ink hover:translate-x-1 transition-transform w-fit"
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect on LinkedIn →
            </a>
            <a
              className="inline-flex items-center gap-2 font-display text-base sm:text-lg font-bold text-ink hover:translate-x-1 transition-transform w-fit"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub Profile →
            </a>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      id="footer"
      data-8b-section="footer"
      className="relative overflow-clip bg-ink px-(--space-1) pt-[clamp(36px,5vh,64px)] pb-[clamp(36px,6vh,72px)] text-paper [--ap:min(24vw,28svh)]"
    >
      <p
        className="m-text-2 footer__bye relative whitespace-nowrap pt-[clamp(24px,4vh,48px)] text-[length:min(36vw,40svh)] min-[900px]:text-[length:min(24vw,40svh)]"
        style={{ "--len": 3 } as CSSProperties}
      >
        <span className="footer__word inline-block">Bye</span>
        <span className="footer__period relative ml-[.035em] inline-block size-[.19em] align-baseline" aria-hidden="true">
          <span className="footer__aperture absolute bottom-0 left-0 size-(--ap) origin-bottom-left overflow-hidden rounded-pill border border-flame/30 bg-black shadow-[0_0_90px_color-mix(in_srgb,var(--color-flame)_28%,transparent)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="absolute inset-0 m-auto size-[56%] object-contain" src="/logo-mark.jpg" width={1024} height={1024} alt="" loading="lazy" />
            <span className="footer__tint absolute inset-0 bg-flame opacity-0" />
          </span>
        </span>
      </p>
    </footer>
  );
}

// ---------------------------------------------------------------- page

export default async function Home() {
  return (
    <>
      <a className="skip fixed top-3 left-(--space-1) z-100 -translate-y-[160%] rounded-pill bg-paper px-4 py-2.5 font-body text-[15px] font-semibold text-ink no-underline focus-visible:translate-y-0" href="#main">Skip to content</a>
      <Navigation links={navLinks} />
      <main id="main">
        <Hero />
        <Statement />
        <Again />
        <Capabilities />
        <Method />
        <Contact />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
