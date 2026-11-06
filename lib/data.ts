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
    id: "fresher-ai",
    num: "01 / 08",
    category: "AI & AGENTIC SYSTEMS",
    title: "Fresher.AI",
    tagline:
      "An agentic AI career platform featuring multi-agent mock interviews, ATS resume analysis, and intelligent career preparation powered by RAG.",
    line:
      "An agentic AI career platform featuring multi-agent mock interviews, ATS resume analysis, and intelligent career preparation powered by RAG.",
    description:
      "An agentic AI career platform featuring multi-agent mock interviews, ATS resume analysis, and intelligent career preparation powered by RAG.",
    keyFeatures: [
      "Multi-agent AI interview system powered by LangGraph.",
      "AI-powered mock interviews.",
      "ATS-based resume analysis.",
      "Intelligent career preparation.",
      "RAG-based knowledge retrieval.",
      "LLM inference using Groq.",
    ],
    tech: ["React.js", "Python", "FastAPI", "LangGraph", "LangChain", "Groq", "Supabase", "Qdrant"],
    image: "/projects/fresher-preview.png",
    imageFit: "cover",
    imagePosition: "object-top",
    liveUrl: "https://fresherai-silk.vercel.app/",
    githubUrl: "https://github.com/Manav111111/FresherInterview",
  },
  {
    id: "ai-workspace",
    num: "02 / 08",
    category: "AGENTIC AI & ENTERPRISE AUTOMATION",
    title: "AI Workspace",
    tagline:
      "An enterprise AI employee platform where businesses create intelligent AI workers that learn from uploaded documents and answer knowledge-based questions.",
    line:
      "An enterprise AI employee platform where businesses create intelligent AI workers that learn from uploaded documents and answer knowledge-based questions.",
    description:
      "An enterprise AI employee platform where businesses create intelligent AI workers that learn from uploaded documents and answer knowledge-based questions.",
    keyFeatures: [
      "Create and configure custom AI employees.",
      "Upload documents and organizational knowledge.",
      "Knowledge-based question answering.",
      "Intelligent AI-powered responses using uploaded data.",
      "Enterprise-oriented AI employee management.",
      "Multi-tenant AI infrastructure.",
      "AI employee deployment and management.",
    ],
    tech: ["Next.js", "FastAPI", "Python", "Qdrant", "Redis", "TypeScript"],
    image: "/projects/ai-workspace.png",
    imageFit: "cover",
    imagePosition: "object-top",
    liveUrl: "https://ai-workspace-kjkj.vercel.app/",
    githubUrl: "https://github.com/Manav111111/AI-Workspace",
  },
  {
    id: "campus-ninja",
    num: "03 / 08",
    category: "EDTECH & MOBILE PLATFORM",
    title: "Campus Ninja",
    tagline:
      "An all-in-one student platform offering semester notes, PYQs, academic resources, learning roadmaps, and a dedicated Android application.",
    line:
      "An all-in-one student platform offering semester notes, PYQs, academic resources, learning roadmaps, and a dedicated Android application.",
    description:
      "An all-in-one student platform offering semester notes, PYQs, academic resources, learning roadmaps, and a dedicated Android application.",
    keyFeatures: [
      "Android application available on Google Play.",
      "Academic resources and learning materials.",
      "Student-focused educational platform.",
      "Actively maintained live product.",
    ],
    tech: ["Next.js", "React Native", "TypeScript", "Tailwind CSS"],
    image: "/projects/campus-ninja.png",
    imageFit: "contain",
    imagePosition: "object-center",
    imageBg: "bg-[#eceef2]",
    liveUrl: "https://campusninja.vercel.app/",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.campusninja.app",
    githubUrl: "https://github.com/Manav111111/CampusNinja-Web",
  },
  {
    id: "course-marketplace",
    num: "04 / 08",
    category: "E-LEARNING & FINTECH",
    title: "Course Marketplace",
    tagline:
      "A full-stack learning marketplace connecting students and creators through secure authentication, course management, and integrated Razorpay payments.",
    line:
      "A full-stack learning marketplace connecting students and creators through secure authentication, course management, and integrated Razorpay payments.",
    description:
      "A full-stack learning marketplace connecting students and creators through secure authentication, course management, and integrated Razorpay payments.",
    keyFeatures: [
      "Automated Razorpay checkout.",
      "Role-based access for students and creators.",
    ],
    tech: ["React", "Node.js", "MongoDB", "Razorpay"],
    image: "/projects/project-1-v2.png",
    imageFit: "cover",
    imagePosition: "object-top",
    liveUrl: "https://lms-4-97qt.onrender.com/",
    githubUrl: "https://github.com/Manav111111/VirtualCourses",
  },
  {
    id: "velocity",
    num: "05 / 08",
    category: "QUICK COMMERCE & MOBILE",
    title: "Velocity",
    tagline:
      "A React Native quick-commerce application offering grocery browsing, product discovery, cart management, and a smooth mobile shopping experience.",
    line:
      "A React Native quick-commerce application offering grocery browsing, product discovery, cart management, and a smooth mobile shopping experience.",
    description:
      "A React Native quick-commerce application offering grocery browsing, product discovery, cart management, and a smooth mobile shopping experience.",
    keyFeatures: [
      "Smooth 60 FPS performance.",
      "Android mobile application.",
    ],
    tech: ["React Native", "Firebase", "Node.js"],
    image: "/projects/velocity.jpg",
    imageFit: "contain",
    imagePosition: "object-center",
    imageBg: "bg-[#09090b]",
    liveUrl: "https://drive.google.com/file/d/1bl7GVgoPACLKjtlEC4qps9QuAsV-1FBD/view",
    githubUrl: "https://github.com/Manav111111/velocity",
  },
  {
    id: "counselling-hub",
    num: "06 / 08",
    category: "ADMISSIONS & EDTECH",
    title: "IPU Counselling Hub",
    tagline:
      "A student counselling platform providing IPU admission guidance, round-wise cutoffs, college comparisons, and intelligent B.Tech college predictions.",
    line:
      "A student counselling platform providing IPU admission guidance, round-wise cutoffs, college comparisons, and intelligent B.Tech college predictions.",
    description:
      "A student counselling platform providing IPU admission guidance, round-wise cutoffs, college comparisons, and intelligent B.Tech college predictions.",
    keyFeatures: [
      "1,000+ monthly users.",
      "IPU college cutoff analytics.",
    ],
    tech: ["Next.js", "Firebase", "React", "Tailwind CSS"],
    image: "/projects/counselling-hub.png",
    imageFit: "cover",
    imagePosition: "object-top",
    liveUrl: "https://councelling-delta.vercel.app/",
    githubUrl: "https://github.com/Manav111111/Councelling",
  },
  {
    id: "code-veda",
    num: "07 / 08",
    category: "WEB3 & HACKATHON",
    title: "Code Veda 2.0",
    tagline:
      "An immersive hackathon event website featuring interactive Three.js visuals, event schedules, sponsors, and developer registration.",
    line:
      "An immersive hackathon event website featuring interactive Three.js visuals, event schedules, sponsors, and developer registration.",
    description:
      "An immersive hackathon event website featuring interactive Three.js visuals, event schedules, sponsors, and developer registration.",
    keyFeatures: [
      "3D WebGL visuals.",
      "1,500+ event impressions.",
    ],
    tech: ["React", "Three.js", "Vite", "Figma"],
    image: "/projects/code-veda.png",
    imageFit: "cover",
    imagePosition: "object-center",
    liveUrl: "https://codeveda2.vercel.app/",
    githubUrl: "https://github.com/AyushChoudhary6/Code-Veda-2.0",
  },
  {
    id: "shoe-store",
    num: "08 / 08",
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
    image: "/projects/shoes-website.png",
    imageFit: "cover",
    imagePosition: "object-top",
    liveUrl: "https://bloom-app-9246e.web.app/",
    githubUrl: "https://github.com/Manav111111/bloom-app",
  },
];

export const featuredProjects = projects;
