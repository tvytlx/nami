import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/main.js",
  output: {
    name: "Nami",
    file: "dist/nami.js",
    format: "umd",
  },
  plugins: [resolve()],
};
