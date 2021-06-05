import { compileToFunc } from "./render";
import { Watcher, Dep } from "./observer";
import { toVNode, h } from "snabbdom";
import { shareProperty } from "./util";

const depMap = {};

/**
 * everytime when component created, now only support root component
 * @param {component instance} vm
 */
function makeReactive(vm, target) {
  return new Proxy(target, {
    get(obj, prop) {
      const dep = prop in depMap ? depMap[prop] : new Dep();
      depMap[prop] = dep;
      dep.depend();
      return Reflect.get(...arguments);
    },
    set(obj, prop, value) {
      const dep = prop in depMap ? depMap[prop] : new Dep();
      depMap[prop] = dep;
      dep.notify();
      return Reflect.set(...arguments);
    },
  });
}

class Nami {
  constructor(options) {
    this.options = options;
    this.initial(options);
    this.mount();
  }
  initial({ root, data, methods, watch }) {
    const templateNode = document.querySelector(root);
    window.nami = this;
    // as uuid
    this.id = Date.now();
    this.watcher = new Watcher(this);
    Dep.target = this.watcher;
    this.vnode = toVNode(templateNode);
    this.render = compileToFunc(templateNode.outerHTML);
    this.initData(data(), methods);
    this.initUserWatcher(watch);
    Dep.target = this.watcher;
  }
  initData(data, methods) {
    Object.keys(data).forEach((key) => shareProperty(this, "data", key));
    this.data = makeReactive(this, data);
    this.h = h;
    this.methods = methods;
    Object.keys(methods).forEach((key) => shareProperty(this, "methods", key));
  }
  initUserWatcher(watch) {
    Object.keys(watch).forEach((key) => {
      Dep.target = new Watcher(this, watch[key]);
      // 触发依赖收集
      this.data.key;
    });
  }
  mount() {
    this.watcher.run();
  }
}

export default Nami;
