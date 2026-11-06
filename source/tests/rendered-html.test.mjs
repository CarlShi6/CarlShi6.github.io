import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {productionRoutes} from '../scripts/production-policy.mjs';
import {sourceRoutes} from '../scripts/prepare-production-routes.mjs';

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const fetch = typeof worker === "function" ? worker : worker.fetch.bind(worker);

  return fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the accessible Light homepage without a hidden Dark runtime", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Carl Shi — Technical Product, Technical Program &amp; AI Product<\/title>/i);
  assert.match(html, /Ivory Cosmos portfolio/i);
  assert.match(html, /Carl Shi — Technical Product, Technical Program, and AI Product/i);
  assert.match(html, /href="\/homepage-poc\/projects#projects"/);
  assert.match(html, /href="\/homepage-poc\/projects#skills"/);
  assert.match(html, /data-home-light="formation-v24"/);
  assert.match(html, /data-formation-art/);
  assert.match(html, /data-falling-layer/);
  assert.match(html, /Explore my work/);
  assert.match(html, /Explore my toolbox/);
  assert.doesNotMatch(html, /Formation · Motion controls/);
  assert.doesNotMatch(html, /href="\/homepage-poc\/projects#education"/);
  assert.match(html, />Carl Shi<\/h1>/);
  assert.match(html, /I build at the intersection of AI, product, design, and technology/);
  assert.match(html, /Currently exploring Product, Technical PM, and AI Product opportunities/);
  assert.match(html, /href="\/homepage-poc\/projects#about"/);
  assert.doesNotMatch(html, /mailto:|carlshi617@gmail\.com/);
  assert.doesNotMatch(html, /New York University|M\.S\. IDBT/);
  assert.match(html, /href="\/carl-shi-resume\.pdf"/);
  assert.doesNotMatch(html, />View selected work<\/a>/);
  assert.doesNotMatch(html, /AI products,<span> made clear\.<\/span>/);
  assert.doesNotMatch(html, /carl-wing-hero\.glb/);
  assert.doesNotMatch(html, /WebGL motion E study|Motion E · Inspector|E\.6 Tidal Inspector|Dark gravitational portfolio system/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("server-renders the final project index and case-study routes", async () => {
  const [projectsResponse, casesResponse] = await Promise.all([
    render("/homepage-poc/projects/"),
    render("/homepage-poc/projects/case-studies/"),
  ]);

  assert.equal(projectsResponse.status, 200);
  assert.equal(casesResponse.status, 200);

  const projectsHtml = await projectsResponse.text();
  const projectHeading = projectsHtml.match(/<h1>[\s\S]*?<\/h1>/)?.[0] ?? "";
  assert.match(projectHeading, /data-semantic[^>]*>Projects<\/span>/);
  assert.match(projectHeading, /aria-hidden="true"/);
  assert.doesNotMatch(projectHeading, /data-motion-state="running"/);
  assert.doesNotMatch(projectsHtml, /Three connected views\./);
  assert.match(projectsHtml, /AI PC Build Advisor/);
  assert.match(projectsHtml, /Dog Behavior Camera/);
  assert.match(projectsHtml, /Luggage Helper/);
  assert.match(projectsHtml, /Music Pulse/);
  assert.match(projectsHtml, /<h2>skills<\/h2>/);
  assert.match(projectsHtml, /Methods and tools I have used to shape products, build software, and test prototypes\./);
  assert.doesNotMatch(projectsHtml, /<h3>Skills, organized by practice\.<\/h3>/);
  assert.match(projectsHtml, /USC Iovine and Young Academy/);
  assert.match(projectsHtml, /M\.S\. Integrated Design, Business and Technology/);
  assert.match(projectsHtml, /New York University/);
  assert.match(projectsHtml, /B\.S\. Computer Science/);
  assert.match(projectsHtml, /Technical/);
  assert.match(projectsHtml, /AI &amp; Data/);
  assert.doesNotMatch(projectsHtml, /ONNX|Full-stack builder/i);
  assert.match(projectsHtml, /Design &amp; Research/);
  assert.match(projectsHtml, /data-skills-overview/);
  assert.match(projectsHtml, /Prior exposure: PyTorch, TensorFlow/);
  assert.doesNotMatch(projectsHtml, /Drag horizontally or use the arrow keys to scroll/);
  assert.doesNotMatch(projectsHtml, /See project/i);
  assert.match(projectsHtml, /href="\/"/);

  const casesHtml = await casesResponse.text();
  assert.match(casesHtml, /Project Case Studies — Carl Shi/);
  assert.match(casesHtml, /id="ai-pc-build-advisor"/);
  // Keep the new local-beta evidence separate from earlier prototype research.
  const aiPcChapter = casesHtml.split('id="ai-pc-build-advisor"')[1]?.split('id="dog-behavior-camera"')[0] ?? '';
  for (const image of ['photo-entry', 'exploded-build', 'inspect-and-swap', 'shopping-plan']) {
    assert.ok(aiPcChapter.includes(`/media/ai-pc-build-advisor/v3/${image}.jpg`));
  }
  assert.match(aiPcChapter, /Local beta · Not publicly launched/);
  assert.match(aiPcChapter, /proportions estimated/);
  assert.match(aiPcChapter, /One real photo/);
  assert.match(aiPcChapter, /not a general accuracy benchmark/);
  assert.match(aiPcChapter, /Earlier prototype · June–August 2026/);
  assert.match(aiPcChapter, /not validation of the new photo-to-build flow/);
  assert.match(casesHtml, /id="dog-behavior-camera"/);
  assert.match(casesHtml, /id="ai-travel-assistant"/);
  assert.match(casesHtml, /id="interactive-music-installation"/);
  assert.match(casesHtml, /Not publicly launched/);
  assert.match(casesHtml, /8 platforms evaluated as a team/);
  assert.match(casesHtml, /Metricool/);
  assert.match(casesHtml, /Content assets/);
  assert.match(casesHtml, /Client feedback/);
  assert.match(casesHtml, /No verified quote or adoption record/);
  assert.match(casesHtml, /href="\/"/);
});

test("preserves the remote Travel redesign and its original evidence alongside local case-study content", async () => {
  const response = await render("/homepage-poc/projects/case-studies/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Luggage Helper visual redesign based on the existing mobile prototype/);
  for (const stage of ["01 / Set the trip", "02 / Check an item", "03 / See the whole bag"]) {
    assert.ok(html.includes(stage), `Missing remote Travel stage: ${stage}`);
  }
  assert.match(html, /The new hero is a visual redesign of those existing functions; it has not been separately tested/);
  assert.match(html, /The original tested screens appear in the evidence below/);
  for (const asset of ["app-home-screen.png", "app-item-analysis-flow.png", "app-trip-summary.png", "app-testing-photos.png"]) {
    assert.ok(html.includes(`/media/luggage-helper/${asset}`), `Missing original Travel evidence: ${asset}`);
  }
  assert.match(html, /My contribution · Product Strategy/);
  assert.match(html, /No verified quote or adoption record/);
  assert.match(html, /data-editorial-motion/);
});

test("redirects retired public routes into the final portfolio", async () => {
  const redirects = [
    ["/homepage-poc/", "/"],
    ["/work/", "/homepage-poc/projects#projects"],
    ["/motion-study/", "/homepage-poc/projects/case-studies#ai-pc-build-advisor"],
    ["/motion-study-v2/", "/homepage-poc/projects/case-studies#ai-pc-build-advisor"],
    ["/motion-study-v4/", "/homepage-poc/projects/case-studies#ai-pc-build-advisor"],
    ["/motion-study-v5/", "/homepage-poc/projects/case-studies#ai-pc-build-advisor"],
    ["/homepage-poc/systems/", "/homepage-poc/projects#projects"],
    ["/homepage-poc/education/", "/"],
  ];

  for (const [pathname, destination] of redirects) {
    const response = await render(pathname);
    assert.match(String(response.status), /^30[178]$/);
    const location = new URL(response.headers.get("location") ?? "", "http://localhost");
    assert.equal(`${location.pathname}${location.hash}`, destination);
  }
});

test("keeps the root wired to Light formation while preserving RC1–RC4 source but not public routes", async () => {
  const [page, homepage, scenes, rc2] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/homepage-poc/homepage-poc.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/homepage-poc/spatial-scenes.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/homepage-poc/homepage-rc3/prototype.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /HomepagePoc/);
  assert.match(homepage, /import \{HomepageLightFormation\}/);
  assert.match(rc2, /href="\/"/);
  assert.doesNotMatch(scenes, /useGLTF\.preload/);
  for (const route of sourceRoutes().filter(route=>!productionRoutes.includes(route))) {
    const response = await render(route+'/');
    assert.equal(response.status, 404);
    const html = await response.text();
    assert.doesNotMatch(html, /Ivory Cosmos portfolio/);
    assert.doesNotMatch(html, /Dark gravitational portfolio system/);
  }
});
