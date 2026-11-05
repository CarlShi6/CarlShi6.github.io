import type { Metadata } from "next";
import { BuildHopeV2Preview } from "../build-hope-v2";

export const metadata: Metadata = {
  title: "Build Hope v2 Preview — Carl Shi",
  description: "A local, visual-first prototype for the Build Hope content operations case study.",
};

export default function BuildHopeV2Page() {
  return <BuildHopeV2Preview />;
}
