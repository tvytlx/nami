Nami.component("n-navleft", {
  data() {
    return {
      props: {
        titles: "",
        anchors: "",
      },
      titles: [],
      anchors: [],
    };
  },
  created() {
    this.titles = this.props.titles.split(",");
    this.anchors = this.props.anchors.split(",");
  },
  template: `
    <div class="fixed h-full lg:w-1/5 lg:block hidden shadow-md m-3 p-3 bg-white divide-y-2 divide-indigo-300 divide-dotted">
      <a class="block leading-10" :repeat="titles.length" :href="'#' + anchors[i]">{{titles[i]}}</a>
    </div>
  `,
});
