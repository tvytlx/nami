import htmlParsing from "../src/html-parser";
import { compileToFunc, parseHtml } from "../src/render";
import { h } from "snabbdom";

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
      `h('html', {on: {}, props: {}}, [h('body', {on: {}, props: {}}, [h('div', {on: {attr2:'attr2v',}, props: {attr:'attrv',}}, ['hello'])])])`
    );
  });
  it("compile to function then run corrected", function () {
    context = {
      h, attrv: '你好', attr2: ()=>{console.log('Nihao')}
    }
    let func = compileToFunc(
      `<html><body><div :attr="attrv" @attr2="attr2v">hello</div></body></html>`
    );
    func.call(context);
  });
});
