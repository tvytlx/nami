// 目前暂不支持组件的repeat

Nami.component("exp-repeat", {
  data() {
    return {
      items: [{ message: "Foo" }, { message: "Bar" }],
    };
  },
  template: `
  <ul class="list-disc p-3">
    <li :repeat="items.length">
      {{ items[i].message }}
    </li>
  </ul>
  `,
});
