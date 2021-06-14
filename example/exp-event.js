Nami.component("exp-event", {
  data() {
    return {};
  },
  methods: {
    clickMe(event) {
      alert("clicked");
    },
  },
  template: `
  <n-card p-code="/example/exp-event.js" p-title="事件函数">
    <div slot="content">
      <button @click="clickMe">clickMe</button>
    </div>
  </n-card>
  `,
});
