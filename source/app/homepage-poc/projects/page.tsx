import { BranchDetailPage } from "../branch-detail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Projects, Skills & About — Carl Shi',
  alternates: { canonical: '/homepage-poc/projects/' },
  robots: { index: true, follow: true },
};

export default function ProjectsArchivePage() {
  return <BranchDetailPage branch="projects" />;
}

