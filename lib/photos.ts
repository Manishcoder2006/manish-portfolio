// Photo table for the page: ids and sizes of the Unsplash photos (credits: CREDITS.md).
// `photoSrc` / `photoSrcSet` rebuild the Unsplash URLs for each photo.

export type Photo = {
  /** Unsplash photo id, without the `photo-` prefix (optional if src is provided). */
  id?: string;
  ixid?: string;
  src?: string;
  srcSet?: string;
  /** Intrinsic size of the largest crop, used for the width/height attributes and the `src`. */
  width: number;
  height: number;
  q?: number;
  /** Widths offered in the srcset; heights follow the intrinsic ratio. */
  widths?: number[];
  sizes: string;
  /** Placeholder shown while the photo loads: a dominant colour, or a colour plus a tiny blurred preview. */
  bg: string;
  alt: string;
  lazy?: boolean;
  priority?: boolean;
};

const unsplash = (p: Photo, w: number, h: number, q: number) =>
  `https://images.unsplash.com/photo-${p.id}?ixid=${p.ixid}&ixlib=rb-4.1.0&auto=format&fit=crop&w=${w}&h=${h}&q=${q}`;

export const photoSrc = (p: Photo) => p.src ?? (p.id ? unsplash(p, p.width, p.height, p.q ?? 80) : "");

export const photoSrcSet = (p: Photo) =>
  p.srcSet ?? (p.src ? p.src : (p.widths ?? []).map(w => `${unsplash(p, w, Math.round((w * p.height) / (p.width || 1)), p.q ?? 80)} ${w}w`).join(', '));

// The template's 26 photos, grouped as they were first placed. `photos` below re-uses the ones that fit a
// developer community in their new slots. Swap in real event and community photos when you have them.
const raw = {
  hero: { id: "1754738381783-f9a2847bfef2", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8MXx8cHVycGxlJTIwYWJzdHJhY3QlMjAzZCUyMHNoYXBlfGVufDF8Mnx8fDE3OTEyMDk2Mjd8MA", width: 1200, height: 1200, q: 68, widths: [280, 400, 470, 560, 640, 960],
    sizes: "(max-width: 767px) 74vw, 36vw",
    bg: "#590ca6 url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wCEAAYHBwkLCQwNDQwQERAREBgWFBQWGCMZGxkbGSM1ISchISchNS85LysvOS9UQjs7QlRhUk5SYXZpaXaUjZTBwf8BBgcHCQsJDA0NDBAREBEQGBYUFBYYIxkbGRsZIzUhJyEhJyE1LzkvKy85L1RCOztCVGFSTlJhdmlpdpSNlMHB///AABEIACAAIAMBIgACEQEDEQH/xABwAAAABwEAAAAAAAAAAAAAAAAAAQIDBAUGBxAAAgIBAwQCAwAAAAAAAAAAAQIDEQAEElEFIUFxEzEiI7EBAQADAQAAAAAAAAAAAAAAAAIAAQUHEQACAgICAwEAAAAAAAAAAAABEQACAxIhUQQiQXH/2gAMAwEAAhEDEQA/AOTxhiaJ81kvqawDU1p1dEFD7Pfk4pI/0Fx3a/rEz1PESIyD4F8Z06vj10txyuJvjENT38gSGkP5tfu8VAsRC/NZTftJH9xxNSzadUjINi2Zj99+PFYHjVlKrd3XvFiwkbIIKXXGQ11KyR9SrpcTiNh3Hg3mn6cySaOWMxmkG68j65RDHGm8SJd0vGE/UwsDLW2wLpdooeAOMeK+r3sSW/yPHdH2MzesUxNwdxywVmMAYej7yLPKJHYkg2cegkVSVYgiQHtjpko7BoEIGSt6shphT//Z) 50% 50% / cover no-repeat",
    alt: "", priority: true },
  work: [
    { id: "1620802090791-fd9420668913", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8M3x8ZWxlY3RyaWMlMjBiaWtlJTIwY2l0eSUyMHJpZGVyfGVufDF8MHx8fDE3OTEyMDk3MDZ8MA", width: 1600, height: 1000, q: 80, widths: [400, 690, 960, 1340, 1600],
        sizes: "(max-width: 767px) 183vw, 52vw",
        bg: "#c0c0c0",
        alt: "A rider on an electric bike on a seaside promenade under a wide blue sky", lazy: true },
    { id: "1713371690087-baafaf440240", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8NXx8d29tYW4lMjBzbWlsaW5nJTIwaG9sZGluZyUyMHBob25lJTIwY29sb3JmdWx8ZW58MXwwfHx8MTc5MTIwOTcwN3ww", width: 1600, height: 1000, q: 80, widths: [400, 690, 960, 1340, 1600],
        sizes: "(max-width: 767px) 183vw, 52vw",
        bg: "#a68cd9",
        alt: "A smiling woman in an orange sweater against a lilac wall", lazy: true },
    { id: "1587241321921-91a834d6d191", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8MXx8YXJ0aXNhbiUyMGJha2VyeSUyMGJyZWFkJTIwY291bnRlcnxlbnwxfDB8fHwxNzkxMjA5NzA3fDA", width: 1600, height: 1000, q: 80, widths: [400, 690, 960, 1340, 1600],
        sizes: "(max-width: 767px) 183vw, 52vw",
        bg: "#262626",
        alt: "A baker in front of warmly lit wooden shelves of bread", lazy: true },
    { id: "1544213456-bc37cb97df74", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8Nnx8bXVzZXVtJTIwZ2FsbGVyeSUyMHZpc2l0b3JzfGVufDF8MHx8fDE3OTEyMDk3MDd8MA", width: 1600, height: 1000, q: 80, widths: [400, 690, 960, 1340, 1600],
        sizes: "(max-width: 767px) 183vw, 52vw",
        bg: "#d9d9d9",
        alt: "Visitors walking among white statues in a gallery with blue walls", lazy: true },
    { id: "1614149162883-504ce4d13909", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8Nnx8aGVhZHBob25lcyUyMGNvbG9yZnVsJTIwYmFja2dyb3VuZHxlbnwxfDB8fHwxNzkxMjA5NzA4fDA", width: 1600, height: 1000, q: 80, widths: [400, 690, 960, 1380, 1600],
        sizes: "(max-width: 767px) 183vw, 106vw",
        bg: "#0c8cd9",
        alt: "Black wireless headphones lit in red and blue", lazy: true },
  ],
  again: [
    { id: "1594386245199-289c2fe0bd0a", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8Mnx8YWlycGxhbmUlMjB3aW5kb3clMjBza3klMjBzdW5zZXR8ZW58MXwxfHx8MTc5MTIwOTcyOHww", width: 900, height: 1125, q: 80, widths: [350, 400, 690, 900],
        sizes: "(max-width: 767px) 91vw, 30vw",
        bg: "#26260c",
        alt: "A sunset sky and a wing seen through an airplane window", lazy: true },
    { id: "1532713107108-dfb5d8d2fc42", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8MXx8YmFyaXN0YSUyMHBvdXJpbmclMjBjb2ZmZWV8ZW58MXwxfHx8MTc5MTIwOTcyOXww", width: 900, height: 1125, q: 80, widths: [350, 400, 690, 900],
        sizes: "(max-width: 767px) 91vw, 30vw",
        bg: "#262626",
        alt: "A barista pouring milk into a latte", lazy: true },
    { id: "1658296777645-0f389d06867c", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8M3x8aGlrZXIlMjBtb3VudGFpbiUyMHJpZGdlfGVufDF8MXx8fDE3OTEyMDk3Mjl8MA", width: 900, height: 1125, q: 80, widths: [350, 400, 690, 900],
        sizes: "(max-width: 767px) 91vw, 30vw",
        bg: "#d9d9d9",
        alt: "A hiker with a backpack standing on a rock above green mountains", lazy: true },
    { id: "1558324190-c940eb141401", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8M3x8bmVvbiUyMGFyY2FkZSUyMGdhbWluZ3xlbnwxfDF8fHwxNzkxMjA5NzMwfDA", width: 900, height: 1125, q: 80, widths: [350, 400, 690, 900],
        sizes: "(max-width: 767px) 91vw, 30vw",
        bg: "#590c0c",
        alt: "Rows of arcade machines glowing with neon light", lazy: true },
    { id: "1641675301559-468f9f4ca037", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8MXx8Y2l0eSUyMGhhbGwlMjBwZW9wbGUlMjBzdHJlZXR8ZW58MXwxfHx8MTc5MTIwOTczMHww", width: 900, height: 1125, q: 80, widths: [350, 400, 690, 900],
        sizes: "(max-width: 767px) 91vw, 30vw",
        bg: "#4073a6",
        alt: "A cyclist riding past a red-brick city hall under a blue sky", lazy: true },
    { id: "1761234852163-23f2ededd04e", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8M3x8ZG9jdG9yJTIwcGF0aWVudCUyMGNsaW5pY3xlbnwxfDF8fHwxNzkxMjA5NzMxfDA", width: 900, height: 1125, q: 80, widths: [350, 400, 690, 900],
        sizes: "(max-width: 767px) 91vw, 30vw",
        bg: "#d9c08c",
        alt: "A nurse comforting a young child on a sofa", lazy: true },
  ],
  services: [
    { id: "1617825295690-28ae56c56135", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8MXx8cGFja2FnaW5nJTIwZGVzaWduJTIwbW9ja3VwJTIwYm94ZXN8ZW58MXwwfHx8MTc5MTIwOTc1MHww", width: 1200, height: 900, q: 80, widths: [310, 400, 640, 960, 1200],
        sizes: "(max-width: 767px) 82vw, 47vw",
        bg: "#f3f3f3",
        alt: "Pink and green printed boxes stacked together", lazy: true },
    { id: "1601972599720-36938d4ecd31", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8MXx8aGFuZCUyMGhvbGRpbmclMjBzbWFydHBob25lJTIwYXBwJTIwc2NyZWVufGVufDF8MXx8fDE3OTEyMDk3NzJ8MA", width: 1200, height: 900, q: 80, widths: [310, 400, 640, 960, 1200],
        sizes: "(max-width: 767px) 82vw, 47vw",
        bg: "#c0c0c0",
        alt: "A hand holding a phone that shows a food ordering app", lazy: true },
    { id: "1720175646447-e37d994007fc", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8M3x8YmlsbGJvYXJkJTIwY2l0eSUyMHN0cmVldCUyMHBvc3RlcnxlbnwxfDF8fHwxNzkxMjA5NzUxfDA", width: 1200, height: 900, q: 80, widths: [310, 400, 640, 960, 1200],
        sizes: "(max-width: 767px) 82vw, 47vw",
        bg: "#262626",
        alt: "A large advertisement on the side of a city building", lazy: true },
    { id: "1512758017271-d7b84c2113f1", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8NHx8d29ya3Nob3AlMjBzdGlja3klMjBub3RlcyUyMHdhbGx8ZW58MXwwfHx8MTc5MTIwOTc1MHww", width: 1200, height: 900, q: 80, widths: [310, 400, 640, 960, 1200],
        sizes: "(max-width: 767px) 82vw, 47vw",
        bg: "#c0c0d9",
        alt: "A wall of printed sticky notes from a research workshop", lazy: true },
    { id: "1769675353367-e581059c7c43", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8M3x8YWJzdHJhY3QlMjBsaWdodCUyMHRyYWlscyUyMGRhcmslMjB2aW9sZXR8ZW58MXwwfHx8MTc5MTIwOTc3M3ww", width: 1200, height: 900, q: 80, widths: [310, 400, 640, 960, 1200],
        sizes: "(max-width: 767px) 82vw, 47vw",
        bg: "#260c40",
        alt: "Violet light trails curving across a dark background", lazy: true },
  ],
  studio: [
    { id: "1787647559705-d2ad3322020e", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8MXx8Y3JlYXRpdmUlMjB0ZWFtJTIwbWVldGluZyUyMHN0dWRpb3xlbnwxfDB8fHwxNzkxMjA5NzQ5fDA", width: 1400, height: 933, q: 80, widths: [350, 410, 690, 960],
        sizes: "(max-width: 767px) 91vw, 32vw",
        bg: "#8c8c8c",
        alt: "A team working together around a desk in a colourful studio", lazy: true },
    { id: "1643373977342-73cfc7cc0c5e", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8Nnx8cGVvcGxlJTIwbGF1Z2hpbmclMjBvZmZpY2V8ZW58MXwxfHx8MTc5MTIwOTc1MHww", width: 900, height: 1200, q: 80, widths: [170, 230, 340, 400, 640],
        sizes: "(max-width: 767px) 44vw, 18vw",
        bg: "#f3c0a6",
        alt: "Two colleagues laughing together on a blue chair", lazy: true },
    { id: "1745434159123-4908d0b9df94", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8NHx8cGVvcGxlJTIwbGF1Z2hpbmclMjBvZmZpY2V8ZW58MXwxfHx8MTc5MTIwOTc1MHww", width: 900, height: 1200, q: 80, widths: [170, 240, 340, 400, 640],
        sizes: "(max-width: 767px) 44vw, 19vw",
        bg: "#a68c73",
        alt: "A smiling person standing in front of a warm wall", lazy: true },
    { id: "1787647560262-ebfcf6c5f979", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8M3x8Y3JlYXRpdmUlMjB0ZWFtJTIwbWVldGluZyUyMHN0dWRpb3xlbnwxfDB8fHwxNzkxMjA5NzQ5fDA", width: 1400, height: 933, q: 80, widths: [350, 400, 490, 690, 960, 1280],
        sizes: "(max-width: 767px) 91vw, 38vw",
        bg: "#737359",
        alt: "Four people collaborating around a table seen from above", lazy: true },
    { id: "1623652653308-d49d335c92eb", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8Nnx8d29ya3Nob3AlMjBzdGlja3klMjBub3RlcyUyMHdhbGx8ZW58MXwwfHx8MTc5MTIwOTc1MHww", width: 1400, height: 933, q: 80, widths: [350, 430, 690, 860, 960],
        sizes: "(max-width: 767px) 91vw, 34vw",
        bg: "#a6a6a6",
        alt: "A team discussing ideas in front of a wall of notes", lazy: true },
  ],
  journal: [
    { id: "1769755409781-9e8924c57362", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8NXx8Y29uZmVyZW5jZSUyMHN0YWdlJTIwYXVkaWVuY2UlMjBsaWdodHN8ZW58MXwwfHx8MTc5MTIwOTc3M3ww", width: 1000, height: 1250, q: 80, widths: [350, 400, 510, 690, 1000],
        sizes: "(max-width: 767px) 91vw, 39vw",
        bg: "#260c0c",
        alt: "A speaker on a stage addressing a large audience in a dim hall", lazy: true },
    { id: "1783094269325-4ba186e8e01b", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8Nnx8c2VydmljZSUyMGRlc2slMjBjdXN0b21lciUyMHNtaWxpbmd8ZW58MXwwfHx8MTc5MTIwOTc3NXww", width: 1000, height: 1250, q: 80, widths: [350, 400, 510, 690, 1000],
        sizes: "(max-width: 767px) 91vw, 39vw",
        bg: "#f3f3f3",
        alt: "A smiling woman working on a laptop at a bright desk", lazy: true },
    { id: "1581080247486-57989c1f14ab", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8NXx8cHJpbnRlZCUyMG1hZ2F6aW5lJTIwcGFnZXMlMjB0eXBvZ3JhcGh5fGVufDF8MHx8fDE3OTEyMDk3NzR8MA", width: 1000, height: 1250, q: 80, widths: [350, 400, 510, 690, 1000],
        sizes: "(max-width: 767px) 91vw, 39vw",
        bg: "#d9a60c",
        alt: "Bold yellow and blue type printed on a box", lazy: true },
    { id: "1542626991-cbc4e32524cc", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8Mnx8d29ya3Nob3AlMjBzdGlja3klMjBub3RlcyUyMHdhbGx8ZW58MXwwfHx8MTc5MTIwOTc1MHww", width: 1000, height: 1250, q: 80, widths: [350, 400, 510, 690, 1000],
        sizes: "(max-width: 767px) 91vw, 39vw",
        bg: "#d9c0a6",
        alt: "Handwritten sticky notes pinned to a corkboard after a research session", lazy: true },
  ],
  footer: { id: "1754738381783-f9a2847bfef2", ixid: "M3w0Mzc5fDB8MXxzZWFyY2h8MXx8cHVycGxlJTIwYWJzdHJhY3QlMjAzZCUyMHNoYXBlfGVufDF8Mnx8fDE3OTEyMDk2Mjd8MA", width: 1200, height: 1200, q: 68, widths: [280, 400, 470, 560, 640, 960],
    sizes: "(max-width: 767px) 74vw, 36vw",
    bg: "#590ca6 url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wCEAAYHBwkLCQwNDQwQERAREBgWFBQWGCMZGxkbGSM1ISchISchNS85LysvOS9UQjs7QlRhUk5SYXZpaXaUjZTBwf8BBgcHCQsJDA0NDBAREBEQGBYUFBYYIxkbGRsZIzUhJyEhJyE1LzkvKy85L1RCOztCVGFSTlJhdmlpdpSNlMHB///AABEIACAAIAMBIgACEQEDEQH/xABwAAAABwEAAAAAAAAAAAAAAAAAAQIDBAUGBxAAAgIBAwQCAwAAAAAAAAAAAQIDEQAEElEFIUFxEzEiI7EBAQADAQAAAAAAAAAAAAAAAAIAAQUHEQACAgICAwEAAAAAAAAAAAABEQACAxIhUQQiQXH/2gAMAwEAAhEDEQA/AOTxhiaJ81kvqawDU1p1dEFD7Pfk4pI/0Fx3a/rEz1PESIyD4F8Z06vj10txyuJvjENT38gSGkP5tfu8VAsRC/NZTftJH9xxNSzadUjINi2Zj99+PFYHjVlKrd3XvFiwkbIIKXXGQ11KyR9SrpcTiNh3Hg3mn6cySaOWMxmkG68j65RDHGm8SJd0vGE/UwsDLW2wLpdooeAOMeK+r3sSW/yPHdH2MzesUxNwdxywVmMAYej7yLPKJHYkg2cegkVSVYgiQHtjpko7BoEIGSt6shphT//Z) 50% 50% / cover no-repeat",
    alt: "" },
} satisfies Record<string, Photo | Photo[]>;

/** The same photo in another slot: takes that slot's `sizes`, and an `alt` of its own when given. */
const fit = (photo: Photo, slot: Photo, alt = photo.alt): Photo => ({ ...photo, sizes: slot.sizes, alt, lazy: true, priority: undefined });

const { again, services, studio, journal } = raw;

const eventsPhoto: Photo = {
  src: "/images/events.webp",
  width: 1600,
  height: 900,
  sizes: "(max-width: 767px) 183vw, 52vw",
  bg: "#1c140e",
  alt: "Developers collaborating at laptops during a vibrant hackathon with stage banner and warm orange ambient lighting",
  lazy: true,
};

const techNewsPhoto: Photo = {
  src: "/images/tech-news.webp",
  width: 1600,
  height: 900,
  sizes: "(max-width: 767px) 183vw, 52vw",
  bg: "#14110e",
  alt: "Developer reading tech and AI news on monitor, phone, and laptop in a warm studio",
  lazy: true,
};

const developerHelpPhoto: Photo = {
  src: "/images/developer-help.webp",
  width: 1600,
  height: 900,
  sizes: "(max-width: 767px) 183vw, 52vw",
  bg: "#18120d",
  alt: "Two developers pair programming and troubleshooting code together in an ambient office",
  lazy: true,
};

const techSupportPhoto: Photo = {
  src: "/images/tech-support.webp",
  width: 1600,
  height: 900,
  sizes: "(max-width: 767px) 183vw, 52vw",
  bg: "#111417",
  alt: "Software engineer deploying to production with CI/CD pipeline and server racks in the background",
  lazy: true,
};

const aiPhoto: Photo = {
  src: "/images/ai.webp",
  width: 1600,
  height: 900,
  sizes: "(max-width: 767px) 183vw, 52vw",
  bg: "#120e0c",
  alt: "Developer working with AI model, neural network visualization, and agent architecture",
  lazy: true,
};

const aiLlmCardPhoto: Photo = {
  src: "/images/skills/ai-llm-engineering.webp",
  width: 1122,
  height: 1402,
  sizes: "(max-width: 767px) 91vw, 30vw",
  bg: "#0d0906",
  alt: "AI & LLM Engineering - Building intelligent applications with LLMs, RAG pipelines, and AI agents",
  lazy: true,
};

const webFullStackCardPhoto: Photo = {
  src: "/images/skills/web-fullstack-development.webp",
  width: 1122,
  height: 1402,
  sizes: "(max-width: 767px) 91vw, 30vw",
  bg: "#0b0713",
  alt: "Web & Full-Stack Development - Modern web apps with React, Next.js, Node.js, and FastAPI",
  lazy: true,
};

const mobileAppCardPhoto: Photo = {
  src: "/images/skills/mobile-app-development.webp",
  width: 1122,
  height: 1402,
  sizes: "(max-width: 767px) 91vw, 30vw",
  bg: "#0d0906",
  alt: "Mobile App Development - Cross-platform mobile apps using React Native, Expo, and Firebase",
  lazy: true,
};

const mlDeepLearningCardPhoto: Photo = {
  src: "/images/skills/machine-learning-deep-learning.webp",
  width: 1122,
  height: 1402,
  sizes: "(max-width: 767px) 91vw, 30vw",
  bg: "#0a0713",
  alt: "Machine Learning & Deep Learning - Intelligent models using Python, PyTorch, TensorFlow, and NLP",
  lazy: true,
};

const productBuildingCardPhoto: Photo = {
  src: "/images/skills/product-building-leadership.webp",
  width: 1122,
  height: 1402,
  sizes: "(max-width: 767px) 91vw, 30vw",
  bg: "#0d0906",
  alt: "Product Building & Leadership - Turning ideas into working products through hackathons and collaboration",
  lazy: true,
};

const communicationSpeakingCardPhoto: Photo = {
  src: "/images/skills/communication-public-speaking.webp",
  width: 1122,
  height: 1402,
  sizes: "(max-width: 767px) 91vw, 30vw",
  bg: "#0d0906",
  alt: "Communication & Public Speaking - Tech talks, mentoring developers, and community leadership",
  lazy: true,
};

const campusNinjaPhoto: Photo = {
  src: "/projects/campus-ninja.webp",
  width: 1600,
  height: 1000,
  sizes: "(max-width: 767px) 183vw, 52vw",
  bg: "#101614",
  alt: "Campus Ninja - All-in-one B.Tech learning platform with Android app",
  lazy: true,
};

const courseMarketplacePhoto: Photo = {
  src: "/projects/project-1-v2.webp",
  width: 1600,
  height: 1000,
  sizes: "(max-width: 767px) 183vw, 52vw",
  bg: "#18120d",
  alt: "Course Marketplace - E-learning marketplace with Razorpay payments",
  lazy: true,
};

const velocityPhoto: Photo = {
  src: "/projects/velocity.webp",
  width: 1600,
  height: 1000,
  sizes: "(max-width: 767px) 183vw, 52vw",
  bg: "#14110e",
  alt: "Velocity - Fast React Native quick commerce grocery app",
  lazy: true,
};

const counsellingHubPhoto: Photo = {
  src: "/projects/counselling-hub.webp",
  width: 1600,
  height: 1000,
  sizes: "(max-width: 767px) 183vw, 52vw",
  bg: "#111417",
  alt: "IPU Counselling Hub - Admissions cutoff analytics and predictor",
  lazy: true,
};

const codeVedaPhoto: Photo = {
  src: "/projects/code-veda.webp",
  width: 1600,
  height: 1000,
  sizes: "(max-width: 767px) 183vw, 52vw",
  bg: "#120e0c",
  alt: "Code Veda 2.0 - Immersive 3D WebGL hackathon platform",
  lazy: true,
};

export const photos = {
  hero: raw.hero,
  // Five featured portfolio projects
  work: [
    campusNinjaPhoto,
    courseMarketplacePhoto,
    velocityPhoto,
    counsellingHubPhoto,
    codeVedaPhoto,
  ],
  // Six new generated expertise cards
  again: [
    aiLlmCardPhoto,
    webFullStackCardPhoto,
    mobileAppCardPhoto,
    mlDeepLearningCardPhoto,
    productBuildingCardPhoto,
    communicationSpeakingCardPhoto,
  ],
  // Events, Tech news, Developer help, Tech support, AI
  services: [
    fit(eventsPhoto, services[0]),
    fit(techNewsPhoto, services[1]),
    fit(developerHelpPhoto, services[2]),
    fit(techSupportPhoto, services[3]),
    fit(aiPhoto, services[4]),
  ],
  studio,
  journal: [
    fit(eventsPhoto, journal[0]),
    fit(developerHelpPhoto, journal[1]),
    fit(techNewsPhoto, journal[2]),
    fit(aiPhoto, journal[3]),
  ],
  footer: raw.footer,
} satisfies Record<string, Photo | Photo[]>;
