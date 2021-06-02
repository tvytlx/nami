import {
  init,
  classModule,
  attributesModule,
  propsModule,
  styleModule,
  eventListenersModule,
  datasetModule,
  h,
  toVNode,
} from "snabbdom";

const patch = init([
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
  datasetModule,
  attributesModule,
]);

// update dom tree
function update(vnode) {
  oldNode = vnode._vnode;
  patch(oldNode, vnode);
}

function createElm() {}

export { toVNode, update, createElm };
