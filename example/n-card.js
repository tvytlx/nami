Nami.component("n-card", {
  data() {
    return {
      props: {
        code: "",
        title: "",
      },
      codeData: "",
    };
  },
  created() {
    this.request(this.props.code).then((response) => {
      this.codeData = response.data;
    });
  },
  methods: {
    clickMe(event) {
      alert("clicked");
    },
  },
  template: `
<div class="shadow-md m-3 p-3">
  <h1 class="font-medium text-2xl mb-3">{{props.title}}</h1>
  <div class="flex space-x-4">
    <div class="w-1/2">
      <h1>代码：</h1>
      <div class="border border-grey-600 my-3 mr-3">
        <pre><code class="js">{{codeData}}</code></pre>
      </div>
    </div>
    <div class="w-1/2">
      <h1>效果：</h1>
      <div class="border border-grey-600 my-3 mr-3 p-3 overflow-x-scroll overflow-auto">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</div>
  `,
});
