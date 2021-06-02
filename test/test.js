import HTMLParser from "../src/html-parser";

var assert = require("assert");
describe("html parser", function () {
  it("raw html show return correct", function () {
    const parser = new HTMLParser();
    console.log(
      parser.HTMLParser(
        `<html><body><div :attr="132">hello</div></body></html>`,
        {
          start: function (tag, attrs, unary) {
            console.log("start", arguments);
          },
          end: function (tag) {
            console.log("end", arguments);
          },
          chars: function (text) {
            console.log("chars", arguments);
          },
          comment: function (text) {
            console.log("comment", arguments);
          },
        }
      )
    );
  });
});
