Nami.component("exp-if", {
  data() {
    return {
      flag: true,
    };
  },
  methods: {
    clickMe(event) {
      this.flag = !this.flag;
    },
  },
  template: `
    <div>
      <button class="ring-1" @click="clickMe">{{flag}}</button>
      <h1 :if="flag" class="text-red-500">只有true的时候会显示</h1>
    </div>
  `,
});
