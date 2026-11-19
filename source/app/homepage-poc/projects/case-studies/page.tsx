import type { Metadata } from "next";
import { ProjectCaseStudiesPage } from "../project-case-studies";

export const metadata: Metadata = {
  alternates: { canonical: '/homepage-poc/projects/case-studies/' },
  robots: { index: true, follow: true },
  title: "Project Case Studies — Carl Shi",
  description: "Six product case studies spanning content operations, AI decision support, computer vision, planning, spatial interaction, and reversible 3D editing.",
};

export default function CaseStudiesPage() {
  return <ProjectCaseStudiesPage />;
}
