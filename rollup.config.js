import resolve from "@rollup/plugin-node-resolve";

import html from "@rollup/plugin-html";
import example from "./example/index";
import fs from "fs";

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
  plugins: [resolve(), html(htmlPluginOption)],
};
