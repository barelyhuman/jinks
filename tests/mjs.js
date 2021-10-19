// THIS FILE IS A DUPLICATE OF `cjs.js` BUT WITH IMPORTS AS ESM

import { test } from "uvu";
import * as assert from "uvu/assert";
// Hard required to make sure we get the mjs file
import { jinks, matcher } from "../dist/index.mjs";
const TEXTS = {
  WITH_LINKS: `Lorem Ipsum is https://github.com/barelyhuman of the https://google.com/ industry. Lorem https://dev.to industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,`,
  NO_LINKS:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
  ONLY_LINK: "https://github.com/barelyhuman",
};

test("linked text", () => {
  const parsed = jinks(TEXTS.WITH_LINKS);
  const links = [];
  const text = [];
  parsed.forEach((item) => {
    if (item.isLink) {
      links.push(item);
    } else {
      text.push(item);
    }
  });
  assert.is(text.length, 4);
  assert.is(links.length, 3);
});

test("unlinked text", () => {
  const parsed = jinks(TEXTS.NO_LINKS);
  const links = [];
  const text = [];

  parsed.forEach((item) => {
    if (item.isLink) {
      links.push(item);
    } else {
      text.push(item);
    }
  });
  assert.is(text.length, 1);
  assert.is(links.length, 0);
});

test("only link", () => {
  const parsed = jinks(TEXTS.ONLY_LINK);
  const links = [];
  const text = [];

  parsed.forEach((item) => {
    if (item.isLink) {
      links.push(item);
    } else {
      text.push(item);
    }
  });
  assert.is(text.length, 0);
  assert.is(links.length, 1);
});

test("matcher", () => {
  const parsed = matcher(TEXTS.ONLY_LINK);
  const link = parsed.next().value;
  assert.is(link[0], "https://github.com/barelyhuman");
});

test.run();
