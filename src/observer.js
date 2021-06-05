import { update } from "./vdom";

class Dep {
  // Watcher
  target;

  constructor(vm) {
    this.id = Date().now;
    this.vm = vm;
    this.subIds = new Set();
    this.subs = [];
  }
  addSub(sub) {
    if (!this.subIds.has(sub.id)) {
      this.subs.push(sub);
    }
  }
  // 目前只有一个watcher
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
  notify() {
    this.subs.forEach((sub) => {
      // 非常奇怪的是，必须有个tick，否则两个同时的patch会只有一个生效
      setTimeout(() => sub.run());
    });
  }
}

class Watcher {
  constructor(vm, cb) {
    this.id = Date.now();
    this.vm = vm;
    this.cb = cb;
    this.deps = [];
  }
  addDep(dep) {
    this.deps.push(dep);
    dep.addSub(this);
  }
  // 每次更新都触发，效率低，之后改成nextTick的形式
  run() {
    if (this.cb) this.cb.call(this.vm);
    else update(this.vm);
  }
}

export { Dep, Watcher };
