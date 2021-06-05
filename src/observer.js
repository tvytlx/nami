import { update } from "./vdom";

let taskQueue = [];
let wait = false;

class Dep {
  // Watcher
  target;

  constructor(vm) {
    this.id = Date.now();
    this.vm = vm;
    this.subIds = new Set();
    this.subs = [];
  }
  addSub(sub) {
    if (!this.subIds.has(sub.id)) {
      this.subIds.add(sub.id);
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
      const task = () => sub.run();
      if (!wait) {
        setTimeout(() => {
          wait = false;
          taskQueue.forEach((fn) => fn());
        });
        wait = true;
      }
      taskQueue.push(task);
    });
  }
}

class Watcher {
  constructor(vm, cb) {
    this.id = Date.now();
    this.vm = vm;
    this.cb = cb;
    this.deps = [];
    this.depIds = new Set();
  }
  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      this.deps.push(dep);
      this.depIds.add(dep.id);
    }
    dep.addSub(this);
  }
  // 每次更新都触发，效率低，之后改成nextTick的形式
  run() {
    if (this.cb) this.cb.call(this.vm);
    else update(this.vm);
  }
}

export { Dep, Watcher };
