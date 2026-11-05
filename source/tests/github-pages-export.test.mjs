import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import test from "node:test";
import { productionRoutes } from '../scripts/production-policy.mjs';
import { sourceRoutes } from '../scripts/prepare-production-routes.mjs';

const output = new URL("../dist/client/", import.meta.url);

test("exports the portfolio and case studies with GitHub Pages metadata", async () => {
  for (const route of ["index.html", "homepage-poc/projects/index.html", "homepage-poc/projects/case-studies/index.html"]) {
    const html = await readFile(new URL(route, output), "utf8");
    assert.match(html, /https:\/\/carlshi6\.github\.io/);
    assert.doesNotMatch(html, /localhost:3000/);
    const path = route === "index.html" ? "" : route.replace(/index\.html$/, "");
    assert.ok(html.includes(`rel="canonical" href="https://carlshi6.github.io/${path}"`));
    assert.match(html, /name="robots" content="index, follow"/);
  }
});

test("excludes development route HTML and RSC while retaining their source", async () => {
  const experiments=sourceRoutes().filter(route=>!productionRoutes.includes(route));
  assert.ok(experiments.length>=37);
  for(const route of experiments){
    await assert.rejects(access(new URL(route.slice(1)+'/index.html',output)));
    await assert.rejects(access(new URL(route.slice(1)+'.rsc',output)));
    await access(new URL('../app'+route+'/page.tsx',import.meta.url));
  }
  const manifest=JSON.parse(await readFile(new URL('../dist/server/vinext-prerender.json',import.meta.url),'utf8'));
  for(const entry of manifest.routes)assert.ok(productionRoutes.includes(entry.route)||entry.route==='/404',entry.route);
  for(const environment of ['client','ssr','rsc']){
    const modules=JSON.parse(await readFile(new URL(`../dist/release-modules/${environment}.json`,import.meta.url),'utf8'));
    for(const route of experiments)assert.ok(!modules.some(path=>path===`app${route}/page.tsx`),`${environment}: ${route}`);
  }
  for (const route of ["index.html", "homepage-poc/projects/index.html", "homepage-poc/projects/case-studies/index.html"]) {
    const html = await readFile(new URL(route, output), "utf8");
    assert.doesNotMatch(html, /<a[^>]+href="[^"]*(?:typography-motion-lab|dark-motion-e6|homepage-rc2)/);
    const links=[...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match=>new URL(match[1],'http://localhost').pathname.replace(/\/$/,''));
    for(const route of experiments)assert.ok(!links.includes(route),`Public navigation links to ${route}`);
  }
});

test("omits experiment entry modules and unused artwork without removing shared production modules", async()=>{
  const modules=JSON.parse(await readFile(new URL('../dist/release-modules/client.json',import.meta.url),'utf8'));
  for(const name of ['typography-motion-lab/lab.tsx','inner-theme-transition-study/study.tsx','theme-spiral-prototype.tsx','dark-motion-e6/prototype.tsx'])assert.ok(!modules.some(path=>path.endsWith(name)),name);
  for(const name of ['editorial-motion.tsx','homepage-light-formation/controller.ts','dark-reference-flow/scanner.tsx'])assert.ok(modules.some(path=>path.endsWith(name)),name);
  for(const path of ['homepage-poc/motion-e6/approved-field-1440.png','models/carl-wing-hero.glb'])await assert.rejects(access(new URL(path,output)));
  const audit=JSON.parse(await readFile(new URL('../dist/production-audit.json',import.meta.url),'utf8'));
  assert.deepEqual([...audit.htmlRoutes].sort(),[...productionRoutes].sort());
  for(const path of audit.includedAssets)await access(new URL(path.slice(1),output));
});

test("includes the current Build Hope narrative and interactive controls", async () => {
  const html = await readFile(new URL("homepage-poc/projects/case-studies/index.html", output), "utf8");
  for (const content of ["My contribution · Product Strategy", "qualitative presence/absence matrix, not a scored ranking", "Explore the proposed content operations workflow", "In this phase · Proposed tasks", "Unequal observation periods; no causal attribution", "does not establish full roadmap adoption"]) assert.ok(html.includes(content), content);
  assert.match(html, /type="range" min="1" max="30"/);
  assert.doesNotMatch(html, /Alphabet|Saratoga/);
});

test("exports the current résumé and skill artwork", async () => {
  const digest = bytes => createHash("sha256").update(bytes).digest("hex");
  assert.equal(digest(await readFile(new URL("carl-shi-resume.pdf", output))), digest(await readFile(new URL("../public/carl-shi-resume.pdf", import.meta.url))));
  for (const name of ["ai", "build", "design", "strategy"]) await access(new URL(`media/skill-objects/${name}.png`, output));
});
