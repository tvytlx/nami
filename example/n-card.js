Nami.component("n-card", {
  data() {
    return {};
  },
  methods: {
    clickMe(event) {
      alert("clicked");
    },
  },
  template: `
<div class="shadow-md m-3 flex">
  <div class="flex-grow">
    <h1>代码</h1>
    <div></div>
  </div>
  <div class="flex-grow">
    <h1>效果</h1>
    <div>
      <slot name="content"></slot>
    </div>
  </div>
</div>
  `,
});
