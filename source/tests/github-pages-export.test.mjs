import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import test from "node:test";

const output = new URL("../dist/client/", import.meta.url);

test("exports the portfolio and case studies with GitHub Pages metadata", async () => {
  for (const route of ["index.html", "homepage-poc/projects/index.html", "homepage-poc/projects/case-studies/index.html"]) {
    const html = await readFile(new URL(route, output), "utf8");
    assert.match(html, /https:\/\/carlshi6\.github\.io/);
    assert.doesNotMatch(html, /localhost:3000/);
  }
});

test("includes the current Build Hope narrative and interactive controls", async () => {
  const html = await readFile(new URL("homepage-poc/projects/case-studies/index.html", output), "utf8");
  for (const content of ["My contribution · Product Strategy", "Recommendation logic · Qualitative assessment", "Explore content workflow", "In this phase · Proposed tasks", "Unequal observation periods; no causal attribution", "does not establish full roadmap adoption"]) assert.ok(html.includes(content), content);
  assert.match(html, /type="range" min="1" max="30"/);
  assert.doesNotMatch(html, /Alphabet|Saratoga/);
});

test("exports the current résumé and skill artwork", async () => {
  const digest = bytes => createHash("sha256").update(bytes).digest("hex");
  assert.equal(digest(await readFile(new URL("carl-shi-resume.pdf", output))), digest(await readFile(new URL("../public/carl-shi-resume.pdf", import.meta.url))));
  for (const name of ["ai", "build", "design", "strategy"]) await access(new URL(`media/skill-objects/${name}.png`, output));
});
