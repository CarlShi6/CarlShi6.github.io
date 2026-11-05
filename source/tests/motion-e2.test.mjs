import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const prototypePath = new URL(
  "../app/homepage-poc/dark-motion-e2/prototype.tsx",
  import.meta.url,
);
const stylesPath = new URL(
  "../app/homepage-poc/dark-motion-e2/study.module.css",
  import.meta.url,
);

test("E.2 is an isolated Motion E asset study", async () => {
  const prototype = await readFile(prototypePath, "utf8");
  assert.match(prototype, /import \{ DarkMotionE \}/);
  assert.match(prototype, /data-e2-assets/);
  assert.doesNotMatch(prototype, /createCaptureController/);
});

test("E.2 replaces only the approved representative pair", async () => {
  const styles = await readFile(stylesPath, "utf8");
  assert.match(styles, /project-1-refined\.png/);
  assert.match(styles, /skill-1-refined\.png/);
  assert.equal((styles.match(/background-image:/g) ?? []).length, 2);
  assert.match(styles, /clip-path:\s*none\s*!important/);
});

test("E.2 project assets are persisted in the workspace", async () => {
  const assets = [
    new URL(
      "../public/homepage-poc/motion-e2/project-1-refined.png",
      import.meta.url,
    ),
    new URL(
      "../public/homepage-poc/motion-e2/skill-1-refined.png",
      import.meta.url,
    ),
  ];
  for (const asset of assets) {
    const info = await stat(asset);
    assert.ok(info.size > 500_000, `${asset.pathname} is unexpectedly small`);
  }
});
