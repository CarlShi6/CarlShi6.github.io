import type { Metadata } from "next";
import { ProjectCaseStudiesPage } from "../project-case-studies";

export const metadata: Metadata = {
  alternates: { canonical: '/homepage-poc/projects/case-studies/' },
  robots: { index: true, follow: true },
  title: "Project Case Studies — Carl Shi",
  description: "Five connected product case studies spanning content operations, AI decision support, computer vision, planning, and spatial interaction.",
};

export default function CaseStudiesPage() {
  return <ProjectCaseStudiesPage />;
}
