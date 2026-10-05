import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
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

test("server-renders the neural portfolio at the production root", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Carl Shi — Technical Product, Technical Program &amp; AI Product<\/title>/i);
  assert.match(html, /Neural portfolio system/i);
  assert.match(html, /Carl Shi — Technical Product, Technical Program, and AI Product/i);
  assert.match(html, /href="\/homepage-poc\/projects#projects"/);
  assert.match(html, /href="\/homepage-poc\/projects#skills"/);
  assert.doesNotMatch(html, /href="\/homepage-poc\/projects#education"/);
  assert.match(html, />Carl Shi<\/strong>/);
  assert.match(html, /I build at the intersection of AI, product, design, and technology/);
  assert.match(html, /Currently exploring Product, Technical PM, and AI Product opportunities/);
  assert.match(html, /href="\/homepage-poc\/projects#about"/);
  assert.doesNotMatch(html, /mailto:|carlshi617@gmail\.com/);
  assert.doesNotMatch(html, /New York University|M\.S\. IDBT/);
  assert.match(html, /href="\/carl-shi-resume\.pdf"/);
  assert.doesNotMatch(html, /AI products,<span> made clear\.<\/span>/);
  assert.doesNotMatch(html, /carl-wing-hero\.glb/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("server-renders the final project index and case-study routes", async () => {
  const [projectsResponse, casesResponse] = await Promise.all([
    render("/homepage-poc/projects"),
    render("/homepage-poc/projects/case-studies"),
  ]);

  assert.equal(projectsResponse.status, 200);
  assert.equal(casesResponse.status, 200);

  const projectsHtml = await projectsResponse.text();
  assert.match(projectsHtml, /One practice\./);
  assert.match(projectsHtml, /Three connected views\./);
  assert.match(projectsHtml, /AI PC Build Advisor/);
  assert.match(projectsHtml, /Dog Behavior Camera/);
  assert.match(projectsHtml, /Luggage Helper/);
  assert.match(projectsHtml, /Music Pulse/);
  assert.match(projectsHtml, /Skills, organized by practice\./);
  assert.match(projectsHtml, /USC Iovine and Young Academy/);
  assert.match(projectsHtml, /M\.S\. Integrated Design, Business and Technology/);
  assert.match(projectsHtml, /New York University/);
  assert.match(projectsHtml, /B\.S\. Computer Science/);
  assert.match(projectsHtml, /Technical/);
  assert.match(projectsHtml, /AI &amp; Data/);
  assert.doesNotMatch(projectsHtml, /ONNX|Full-stack builder/i);
  assert.match(projectsHtml, /Design &amp; Research/);
  assert.match(projectsHtml, /Drag horizontally or use the arrow keys to scroll/);
  assert.doesNotMatch(projectsHtml, /See project/i);
  assert.match(projectsHtml, /href="\/"/);

  const casesHtml = await casesResponse.text();
  assert.match(casesHtml, /Project Case Studies — Carl Shi/);
  assert.match(casesHtml, /id="ai-pc-build-advisor"/);
  assert.match(casesHtml, /id="dog-behavior-camera"/);
  assert.match(casesHtml, /id="ai-travel-assistant"/);
  assert.match(casesHtml, /id="interactive-music-installation"/);
  assert.match(casesHtml, /Not publicly deployed/);
  assert.match(casesHtml, /href="\/"/);
});

test("redirects retired public routes into the final portfolio", async () => {
  const redirects = [
    ["/homepage-poc", "/"],
    ["/work", "/homepage-poc/projects#projects"],
    ["/motion-study", "/homepage-poc/projects/case-studies#ai-pc-build-advisor"],
    ["/motion-study-v2", "/homepage-poc/projects/case-studies#ai-pc-build-advisor"],
    ["/motion-study-v4", "/homepage-poc/projects/case-studies#ai-pc-build-advisor"],
    ["/motion-study-v5", "/homepage-poc/projects/case-studies#ai-pc-build-advisor"],
    ["/homepage-poc/systems", "/homepage-poc/projects#projects"],
    ["/homepage-poc/education", "/"],
  ];

  for (const [pathname, destination] of redirects) {
    const response = await render(pathname);
    assert.match(String(response.status), /^30[178]$/);
    const location = new URL(response.headers.get("location") ?? "", "http://localhost");
    assert.equal(`${location.pathname}${location.hash}`, destination);
  }
});

test("keeps the production root wired to the neural portfolio without the retired model preload", async () => {
  const [page, homepage, scenes] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/homepage-poc/homepage-poc.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/homepage-poc/spatial-scenes.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /HomepagePoc/);
  assert.match(homepage, /href="\/"/);
  assert.doesNotMatch(scenes, /useGLTF\.preload/);
});
