// 目前组件传参，只支持穿字符串字面量，父子之间传data参数暂不支持
// p-xxxx 来指定props
// 插槽和vue的命名插槽一样
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
