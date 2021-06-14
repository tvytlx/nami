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
  <n-card>
    <div slot="content">
      <button @click="clickMe">clickMe</button>
    </div>
  </n-card>
  `,
});
