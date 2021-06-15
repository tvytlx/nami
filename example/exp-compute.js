Nami.component("exp-compute", {
  data() {
    return {
      message: "Hello",
    };
  },
  compute: {
    reversedMessage: function () {
      return this.message.split("").reverse().join("");
    },
  },
  template: `
    <div class="text-red-500">
      {{reversedMessage}}
    </div>
  `,
});
