import { redirect } from "next/navigation";

export default function LegacyWorkPage() {
  redirect("/homepage-poc/projects#projects");
}
