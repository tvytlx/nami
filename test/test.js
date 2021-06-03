import htmlParsing from "../src/html-parser";
import { compileToFunc } from "../src/render";

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
describe("compile template to function string", function () {
  it("compile should work", function () {
    let result = compileToFunc(
      `<html><body><div :attr="attrv" @attr2="attr2v">hello</div></body></html>`
    );
    assert.strictEqual(
      result,
      `h('html', {on: {}, props: {}}, [h('body', {on: {}, props: {}}, [h('div', {on: {attr2:'attr2v',}, props: {attr:'attrv',}}, ['hello'])])])`
    );
  });
});
