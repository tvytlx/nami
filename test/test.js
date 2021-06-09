import htmlParsing from "../src/html-parser";
import { compileToFunc, parseHtml, compileText } from "../src/render";
import { h } from "snabbdom";
import { AssertionError } from "assert";

var assert = require("assert");
describe("html parser", function () {
  it("html string parsing should return correct result", function () {
    const result = ["html", "body", "div", "hello", "div", "body", "html"];
    let index = 0;
    htmlParsing(
      `<html><body><div :attr="132" @attr2="1333">hello</div></body></html>`,
      {
        start: function (tag, attrs, unary) {
          assert.strictEqual(result[index], tag);
          index += 1;
        },
        end: function (tag) {
          assert.strictEqual(result[index], tag);
          index += 1;
        },
        chars: function (text) {
          assert.strictEqual(result[index], text);
          index += 1;
        },
        comment: function (text) {},
      }
    );
  });
});
describe("compile template", function () {
  it("compile to function string", function () {
    let result = parseHtml(
      `<html><body><div :attr="attrv" @attr2="attr2v">hello</div></body></html>`
    );
    assert.strictEqual(
      result.funcStr,
      "h('html', {on: {}, props: {}, attrs: {}}, [h('body', {on: {}, props: {}, attrs: {}}, [h('div', {on: {attr2: (...args)=>{attr2v.call(this, ...args)},}, props: {attr:attrv,}, attrs: {}}, [`hello`])])])"
    );
    result = parseHtml(
      `<div>component data {{num}}<button type="button" @click="clickMe">clickme</button></div>`
    );
    assert.strictEqual(
      result.funcStr,
      "h('div', {on: {}, props: {}, attrs: {}}, [`component data {{num}}`.replace(/{{\\s*num\\s*}}/g, num),h('button', {on: {click: (...args)=>{clickMe.call(this, ...args)},}, props: {type:'button',}, attrs: {type:'button',}}, [`clickme`])])"
    );
  });
  it("compile to function then run corrected", function () {
    context = {
      h,
      attrv: "你好",
      attr2v: () => {
        console.log("Nihao");
      },
    };
    let func = compileToFunc(
      `<html><body><div :attr="attrv" @attr2="attr2v">hello</div></body></html>`
    );
    func.call(context);
  });
  it("compile text", function () {
    assert.strictEqual(
      compileText(" {{abc}} {{abcd  }}"),
      "` {{abc}} {{abcd  }}`.replace(/{{\\s*abc\\s*}}/g, abc).replace(/{{\\s*abcd\\s*}}/g, abcd)"
    );
  });
});
