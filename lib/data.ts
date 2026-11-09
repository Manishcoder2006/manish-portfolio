export interface Project {
  id: string;
  num: string;
  category: string;
  title: string;
  tagline: string;
  line: string;
  description: string;
  keyFeatures?: string[];
  tech: string[];
  image: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  imageBg?: string;
  liveUrl?: string;
  githubUrl?: string;
  playStoreUrl?: string;
}

export const techIconMap: Record<string, string> = {
  "Next.js": "devicon:nextjs",
  "React": "devicon:react",
  "React.js": "devicon:react",
  "React Native": "devicon:react",
  "TypeScript": "devicon:typescript",
  "Tailwind CSS": "devicon:tailwindcss",
  "Node.js": "devicon:nodejs",
  "MongoDB": "devicon:mongodb",
  "Firebase": "devicon:firebase",
  "Razorpay": "simple-icons:razorpay",
  "Three.js": "devicon:threejs",
  "Vite": "devicon:vite",
  "Figma": "devicon:figma",
  "Python": "devicon:python",
  "FastAPI": "devicon:fastapi",
  "LangChain": "simple-icons:langchain",
  "LangGraph": "simple-icons:langgraph",
  "Groq": "logos:groq",
  "Supabase": "devicon:supabase",
  "Qdrant": "simple-icons:qdrant",
  "Redis": "devicon:redis",
};

export const projects: Project[] = [
  {
    id: "skillbridge-india",
    num: "01 / 02",
    category: "AGENTIC AI & CAREER PLATFORM",
    title: "SkillBridge India",
    tagline:
      "An agentic AI career preparation platform delivering personalized mock interviews, ATS resume analysis, and adaptive interview workflows.",
    line:
      "An agentic AI career preparation platform delivering personalized mock interviews, ATS resume analysis, and adaptive interview workflows.",
    description:
      "Built an Agentic AI platform delivering personalized mock interviews, ATS resume analysis, and AI-generated career roadmaps for job-seeking students. Designed adaptive AI interview workflows with LangGraph and Groq, evaluating responses in real time and generating personalized feedback through a multi-agent evaluation pipeline.",
    keyFeatures: [
      "Agentic AI platform delivering personalized mock interviews.",
      "ATS resume analysis and AI-generated career roadmaps.",
      "Adaptive interview workflows powered by LangGraph and Groq.",
      "Real-time response evaluation and personalized feedback pipeline.",
    ],
    tech: ["React", "FastAPI", "LangGraph", "Groq", "Python"],
    image: "/projects/fresher-preview.webp",
    imageFit: "contain",
    imagePosition: "object-center",
    imageBg: "bg-[#09090b]",
    liveUrl: "https://skillbridge-india-eight.vercel.app",
    githubUrl: "https://github.com/Manishcoder2006",
  },
  {
    id: "shoe-store",
    num: "02 / 02",
    category: "LUXURY E-COMMERCE",
    title: "Premium Shoe Store",
    tagline:
      "A premium footwear e-commerce storefront featuring editorial product showcases, immersive visuals, responsive design, and refined shopping experiences.",
    line:
      "A premium footwear e-commerce storefront featuring editorial product showcases, immersive visuals, responsive design, and refined shopping experiences.",
    description:
      "A premium footwear e-commerce storefront featuring editorial product showcases, immersive visuals, responsive design, and refined shopping experiences.",
    keyFeatures: [
      "Firebase-powered hosting.",
      "Premium editorial shopping experience.",
    ],
    tech: ["React", "Firebase", "Node.js", "Tailwind CSS"],
    image: "/projects/shoes-website.webp",
    imageFit: "contain",
    imagePosition: "object-center",
    imageBg: "bg-[#060a08]",
    liveUrl: "https://bloom-app-9246e.web.app/",
    githubUrl: "https://github.com/Manishcoder2006",
  },
];

export const featuredProjects = projects;
