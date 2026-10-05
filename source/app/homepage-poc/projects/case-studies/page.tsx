import type { Metadata } from "next";
import { ProjectCaseStudiesPage } from "../project-case-studies";

export const metadata: Metadata = {
  title: "Project Case Studies — Carl Shi",
  description: "Five connected product case studies spanning content operations, AI decision support, computer vision, planning, and spatial interaction.",
};

export default function CaseStudiesPage() {
  return <ProjectCaseStudiesPage />;
}
