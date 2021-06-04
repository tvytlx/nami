import { range } from "lodash";
import { createElm } from "./vdom";
import htmlParsing from "./html-parser";
import { h } from "snabbdom";

function compileAttrs(attrs) {
  let eventFuncStr = "";
  let userFuncStr = "";
  attrs.forEach(({ name, value, escaped }) => {
    switch (name[0]) {
      case "@":
        eventFuncStr += `${name.slice(1)}:'${value}',`;
        break;
      case ":":
        // support :style
        userFuncStr += `${name.slice(1)}:'${value}',`;
        break;
      default:
        break;
    }
  });
  return `{on: {${eventFuncStr}}, props: {${userFuncStr}}}`;
}

function compileNode(peekNode, children) {
  peekNode.funcStr = `h('${peekNode.tag}', ${compileAttrs(
    peekNode.attrs
  )}, [${children.join(",")}])`;
  peekNode.completed = true;
}

function parseHtml(template) {
  const stack = [];
  htmlParsing(template, {
    start: (tag, attrs, unary) => {
      stack.push({
        completed: false,
        tag,
        attrs,
      });
    },
    end: () => {
      let children = [];
      let peekNode = stack.pop();
      while (peekNode.completed) {
        children.unshift(peekNode.funcStr);
        peekNode = stack.pop();
      }
      compileNode(peekNode, children);
      stack.push(peekNode);
    },
    chars: (text) => {
      stack.push({
        completed: true,
        funcStr: `'${text}'`,
      });
    },
    comment: () => {},
  });
  return stack.pop();
}

function compileToFunc(template) {
  const { funcStr } = parseHtml(template);
  try {
    return new Function(`with(this){ return ${funcStr}}`);
  } catch (err) {
    return null;
  }
}

export { compileToFunc, parseHtml };