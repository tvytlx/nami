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
      setTimeout(() => {
        hljs.highlightElement(document.querySelector(`#code${this.id}`));
      });
    });
  },
  template: `
<div class="shadow-md m-3 p-3">
  <h1 class="font-medium text-2xl mb-3">{{props.title}}</h1>
  <div class="lg:flex lg:space-x-4 space-x-0">
    <div class="lg:w-1/2 w-full">
      <h1>代码：</h1>
      <div class="border border-grey-600 my-3 mr-3">
        <pre><code class="js" :id="'code'+id">{{codeData}}</code></pre>
      </div>
    </div>
    <div class="lg:w-1/2 w-full">
      <h1>效果：</h1>
      <div class="border border-grey-600 my-3 mr-3 p-3 overflow-x-scroll overflow-auto">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</div>
  `,
});
