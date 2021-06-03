import htmlParsing from "../src/html-parser";

var assert = require("assert");
describe("html parser", function () {
  it("html string parsing should return correct result", function () {
    const result = ['html', 'body', 'div', 'hello', 'div', 'body', 'html'];
    let index = 0;
    console.log(typeof htmlParsing)
    htmlParsing(
      `<html><body><div :attr="132" @attr2="1333">hello</div></body></html>`,
      {
        start: function (tag, attrs, unary) {
          assert.strictEqual(result[index], tag);
          index += 1;
        },
        end: function (tag) {
          assert.strictEqual(result[index], tag)
          index += 1;
        },
        chars: function (text) {
          assert.strictEqual(result[index], text)
          index += 1;
        },
        comment: function (text) {
        },
      }
    );
  })
});
