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
<div>
  <button @click="clickMe">clickMe</button>
</div>
  `,
  slotOn: "n-card",
});
