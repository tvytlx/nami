Nami.component("exp-compute", {
  data() {
    return {
      message: "Hello",
    };
  },
  methods: {
    clickMe() {
      this.message += this.message;
    },
  },
  compute: {
    reversedMessage: function () {
      return this.message.split("").reverse().join("");
    },
  },
  template: `
    <div>
      <button class="ring-1" @click="clickMe">Hello*2</button>
      <h1 class="text-red-500">reversedMessage: {{reversedMessage}}</h1>
    </div>
  `,
});
