import { toVNode } from "./vdom";
import render, { compileToFunc } from "./render";

function getRenderFuncs(node) {
  if (!("__renderFuncs" in node)) {
    node.__renderFuncs = [];
  }
  return node.__renderFuncs;
}
export default class Nami {
  constructor(options) {
    this.options = options;
    this.initial(options);
  }
  initial({ root, data, methods }) {
    window.nami = this;
    this._deps = {};
    this.vnodeTemplateTree = compileToFunc(document.querySelector(root));
    this.data = this.makeReactive(data());
    this.methods = methods;
    this.collectDeps();
    Object.keys(this._deps).forEach((key) => {
      this._deps[key].forEach(({ vnode }) => {
        render(vnode);
      });
    });
  }
  makeReactive(target) {
    self = this;
    return new Proxy(target, {
      get(obj, prop) {
        return prop in obj ? obj[prop] : "";
      },
      set(obj, prop, value) {
        if (obj[prop] === value) return false;
        obj[prop] = value;
        self.notifyDeps("changed", prop);
        return true;
      },
    });
  }
  notifyDeps(event, name) {
    if (!(name in this._deps)) return;
    this._deps[name].forEach(({ vnode }) => {
      render(vnode);
    });
  }
  collectDeps() {
    const helper = (node, parent) => {
      this.parseNode(node, parent);
      (node.children || []).forEach((child) => {
        helper(child, node);
      });
    };
    helper(this.vnodeTemplateTree, null);
  }
  parseNode(vnode, parent) {
    self = this;
    if (vnode.text) {
      const text = vnode.text;
      Array.from(text.matchAll(/{{(.*?)}}/g)).forEach((res) => {
        const depName = res[1];
        getRenderFuncs(parent).push(function () {
          if (!this.text) this.text = "";
          this.text += text.replace(`{{${depName}}}`, self.data[depName]);
        });
        this._collectDep(depName, "data", parent);
      });
    }
    const attrs = Array.from(Object.entries(vnode.data?.attrs || {}));
    if (attrs.length) {
      attrs.forEach(([key, value]) => {
        if (key.startsWith("$")) {
          if (key.slice(1) === "click") {
            getRenderFuncs(vnode).push(function () {
              this.data.on = {};
              this.data.on.click = function () {
                self.methods[value].call(self.data);
              };
            });
            this._collectDep(value, "methods", vnode);
          }
        }
      });
    }
  }
  _collectDep(name, type, vnode) {
    if (!(name in this[type])) {
      throw Error("undefined variable", name);
    }
    if (name in this._deps) {
      this._deps[name].push({ type, vnode });
    } else this._deps[name] = [{ type, vnode }];
    vnode.__deps = this._deps[name];
  }
}
