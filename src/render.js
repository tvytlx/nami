import { range } from "lodash";
import { createElm } from "./vdom";

function parseHtml(template) {
  const parser = new DOMParser();
  parser.parseFromString(template, "application/xml");
}

function compileToFunc(template) {
  const dom = parseHtml(template);
  dom.text;
}
