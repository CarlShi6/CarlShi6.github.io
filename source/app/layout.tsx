import type { Metadata } from "next";
import { SiteBackground } from "@/src/components/SiteBackground";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL("https://carlshi6.github.io");

  return {
    metadataBase,
    title: "Carl Shi — Technical Product, Technical Program & AI Product",
    description: "Carl Shi connects technical execution, product thinking, and implementation planning through AI and user-centered projects.",
    openGraph: {
      title: "Carl Shi — Technical Product & AI Product",
      description: "Technical product, program planning, and AI-assisted product work.",
      type: "website",
      images: [{ url: "/og-ai-pm.png", width: 1200, height: 630, alt: "Carl Shi — AI products, clear decisions" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Carl Shi — Technical Product & AI Product",
      description: "Technical product, program planning, and AI-assisted product work.",
      images: ["/og-ai-pm.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-portfolio-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('carl-portfolio-home-theme');if(t==='dark'||t==='light')document.documentElement.dataset.portfolioTheme=t;}catch(e){}})();` }} />
      </head>
      <body>
        <SiteBackground />
        {children}
      </body>
    </html>
  );
}
