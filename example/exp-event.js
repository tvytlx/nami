Nami.component("exp-event", {
  data() {
    return {};
  },
  methods: {
    clickMe(event) {
      alert(event);
    },
  },
  template: `
    <div>
      <button class="ring-1" @click="clickMe">clickMe</button>
    </div>
  `,
});
