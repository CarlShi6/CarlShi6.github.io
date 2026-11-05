import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const source = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("E.3 remains an isolated extension of Motion E", async () => {
  const prototype = await source("../app/homepage-poc/dark-motion-e3/prototype.tsx");
  assert.match(prototype, /import \{ DarkMotionE \}/);
  assert.match(prototype, /"current" \| "reference" \| "coupled"/);
  assert.doesNotMatch(prototype, /createCaptureController/);
});

test("E.3 debris is coupled to capture state and observed object motion", async () => {
  const debris = await source("../app/homepage-poc/dark-motion-e3/debris-field.tsx");
  assert.match(debris, /snapshot\.phases\[target\.index\]/);
  assert.match(debris, /snapshot\.poses\[target\.index\]/);
  assert.match(debris, /objectX - lastX/);
  assert.match(debris, /holeX - objectX/);
  assert.doesNotMatch(debris, /Math\.random/);
});

test("E.3 only replaces the approved representative pair", async () => {
  const styles = await source("../app/homepage-poc/dark-motion-e3/study.module.css");
  assert.match(styles, /project-1-reference\.png/);
  assert.match(styles, /skill-1-reference\.png/);
  assert.equal((styles.match(/background-image:/g) ?? []).length, 2);
});

test("E.3 transparent assets are persisted", async () => {
  for (const path of [
    "../public/homepage-poc/motion-e3/project-1-reference.png",
    "../public/homepage-poc/motion-e3/skill-1-reference.png",
  ]) {
    const info = await stat(new URL(path, import.meta.url));
    assert.ok(info.size > 500_000, `${path} is unexpectedly small`);
  }
});
