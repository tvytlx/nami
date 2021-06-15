Nami.component("exp-lifecycle", {
  data() {
    return {
      createdMsg: "",
      mountedMsg: "",
    };
  },
  created() {
    // 在vnode生成之后，渲染到document之前
    const elm = document.querySelector("#testLifeCycle");
    this.createdMsg = elm ? "组件已挂载" : "组件没有挂载";
  },
  mounted() {
    // 在vnode生成之后，渲染到document之后
    const elm = document.querySelector("#testLifeCycle");
    this.mountedMsg = elm ? "组件已经挂载" : "组件没有挂载";
  },
  // updated hooks，有问题
  // 目前如果父组件没有挂载到document之前，子组件在created里改了依赖，
  // 子组件的vnode会重新渲染，但是父组件的vnode tree记录的是之前的
  // vnode，父组件渲染的就会是之前的vnode，也就是说在beforeMounted
  // 期间子组件的变化，父组件捕获不到，最终渲染也捕获不到
  template: `
    <div id="testLifeCycle">
    <h1>generated at created: {{createdMsg}}</h1>
    <h1>generated at mounted: {{mountedMsg}}</h1>
    </div>
  `,
});
