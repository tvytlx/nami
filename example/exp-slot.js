Nami.component("exp-slot", {
  data() {
    return {};
  },
  template: `
    <div>
      <n-card p-code="/example/exp-slot.js" p-title="测试">
        <div slot="content">
          插槽组件
        </div>
      </n-card>
    </div>
  `,
});
