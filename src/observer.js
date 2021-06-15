import { uuid } from "./util";
import { update } from "./vdom";

const subsMap = {};
let taskQueue = new Set();
let wait = false;

class Dep {
  // Watcher
  target;

  constructor(vm) {
    this.id = uuid();
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
      if (!wait) {
        // setTimeout(() => {
        //   wait = false;
        //   Array.from(taskQueue).forEach((id) => subsMap[id].run());
        //   taskQueue = new Set();
        // });
        Promise.resolve().then(() => {
          wait = false;
          Array.from(taskQueue).forEach((id) => subsMap[id].run());
          taskQueue = new Set();
        });
        wait = true;
      }
      taskQueue.add(sub.id);
    });
  }
}

class Watcher {
  constructor(vm, cb) {
    this.id = uuid();
    subsMap[this.id] = this;
    this.vm = vm;
    this.cb = cb;
    this.deps = [];
    this.depIds = new Set();
  }
  addDep(dep) {
    // 这一段可有可无，观察者不需要知道自己观察了哪些依赖
    // if (!this.depIds.has(dep.id)) {
    //   this.deps.push(dep);
    //   this.depIds.add(dep.id);
    // }
    dep.addSub(this);
  }
  run() {
    Dep.target = this;
    if (this.cb) this.cb.call(this.vm, this.vm[this.cb.name]);
    else {
      update(this.vm);
      if (this.vm.updated) {
        this.vm.updated();
      }
    }
  }
}

export { Dep, Watcher };
