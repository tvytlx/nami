import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";

import html from "@rollup/plugin-html";
import example from "./example/index";
import fs from "fs";
import axios from "axios";

function processExample() {
  let exampleScripts = "";
  let exampleHtml = "";
  example.forEach((name) => {
    exampleScripts += `<script src="/example/${name}.js"></script>`;
    // 复用组件，非example代码
    if (name.startsWith("n-")) return;
    exampleHtml += `<${name}></${name}>`;
  });
  let content = fs.readFileSync(__dirname + "/example/template.html", "utf8");
  return content
    .replace("exampleScripts", exampleScripts)
    .replace("exampleHtml", exampleHtml);
}

const htmlPluginOption = {
  template: ({ attributes, bundle, files, publicPath, title }) => {
    return processExample();
  },
};

export default {
  input: "src/main.js",
  output: {
    name: "Nami",
    file: "dist/nami.js",
    format: "umd",
  },
  external: [/@babel\/runtime/],
  plugins: [
    resolve({ mainFields: ["jsnext", "preferBuiltins", "browser"] }),
    commonjs({
      browser: true,
    }),
    babel({
      exclude: ["node_modules/**"],
      babelHelpers: "runtime",
      plugins: ["@babel/plugin-transform-runtime"],
    }),
    json(),
    html(htmlPluginOption),
  ],
};
