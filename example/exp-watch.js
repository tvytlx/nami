Nami.component("exp-watch", {
  data() {
    return {
      flag: true,
    };
  },
  methods: {
    clickMe() {
      this.flag = !this.flag;
    },
  },
  watch: {
    flag(val) {
      setTimeout(() => alert("flag changed to " + val), 2000);
    },
  },
  template: `
    <div>
      <button class="ring-1" @click="clickMe">{{flag}}</button>
      <h1>点击按钮两秒后将通知flag已改变</h1>
    </div>
  `,
});
