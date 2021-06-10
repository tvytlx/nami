import { compileToFunc } from "./render";
import { Watcher, Dep } from "./observer";
import { toVNode, h } from "snabbdom";
import { shareProperty, uuid } from "./util";
import { components, componentCache } from "./components";

function createComponent(name, key) {
  let componentInstance;
  let uuid = name + key;
  if (uuid in componentCache) {
    // if props变化了，则重新创建组件实例
    // else
    componentInstance = componentCache[uuid];
  } else {
    componentInstance = new Nami({
      ...components[name],
      isComponent: true,
    });
    componentCache[uuid] = componentInstance;
  }
  return componentInstance.vnode;
}

function makeReactive(vm, target) {
  return new Proxy(target, {
    get(obj, prop) {
      const dep = prop in vm.depMap ? vm.depMap[prop] : new Dep();
      vm.depMap[prop] = dep;
      dep.depend();
      return Reflect.get(...arguments);
    },
    set(obj, prop, value) {
      const dep = prop in vm.depMap ? vm.depMap[prop] : new Dep();
      vm.depMap[prop] = dep;
      // 如果值不变，则不通知
      if (obj[prop] !== value) {
        dep.notify();
      }
      return Reflect.set(...arguments);
    },
  });
}

class Nami {
  constructor(options) {
    this.options = options;
    this.initial(options);
  }

  static component(name, options) {
    components[name] = options;
  }

  initial({ root, data, methods, watch, template, isComponent }) {
    this.id = uuid();
    this.depMap = {};
    this.watcher = new Watcher(this);
    this.initData(data(), methods);
    this.initUserWatcher(watch);
    if (isComponent) {
      this.render = compileToFunc(template);
      Dep.target = this.watcher;
      this.vnode = this.render();
    } else {
      const templateNode = document.querySelector(root);
      this.vnode = toVNode(templateNode);
      this.render = compileToFunc(templateNode.outerHTML);
    }
    this.vnode.__instance = this;
  }
  initData(data, methods) {
    if (data) {
      Object.keys(data).forEach((key) => shareProperty(this, "data", key));
      this.data = makeReactive(this, data);
    }
    if (methods) {
      this.methods = methods;
      Object.keys(methods).forEach((key) =>
        shareProperty(this, "methods", key)
      );
    }
    this.helper = { h, createComponent };
    Object.keys(this.helper).forEach((key) =>
      shareProperty(this, "helper", key)
    );
  }
  initUserWatcher(watch) {
    if (!watch) return;
    Object.keys(watch).forEach((key) => {
      const watcher = new Watcher(this, watch[key]);
      Dep.target = watcher;
      const dep = key in this.depMap ? this.depMap[key] : new Dep();
      this.depMap[key] = dep;
      dep.depend();
    });
  }
  mount() {
    this.watcher.run();
  }
}

export { Nami };
