import htmlParsing from "./html-parser";
import { components } from "./components";
import { uuid } from "./util";

function compileAttrs(attrs) {
  let eventFuncStr = "";
  let userFuncStr = "";
  let userAttrStr = "";
  attrs.forEach(({ name, value, escaped }) => {
    switch (name[0]) {
      case "@":
        eventFuncStr += `${name.slice(
          1
        )}: (...args)=>{${value}.call(this, ...args)},`;
        break;
      case ":":
        // support :style :bind
        let directive = name.slice(1);
        if (directive === "model") {
          userAttrStr += `value:${value},`;
          userFuncStr += `value:${value},`;
          eventFuncStr += `input: (ev, node)=>{${value} = node.elm.value;},`;
        } else {
          userFuncStr += `${directive}:${value},`;
        }
        break;
      default:
        userFuncStr += `${name}:'${value}',`;
        userAttrStr += `${name}:'${value}',`;
        break;
    }
  });
  return `{on: {${eventFuncStr}}, props: {${userFuncStr}}, attrs: {${userAttrStr}}}`;
}

function compileText(text) {
  let str = `\`${text}\``;
  return Array.from(text.matchAll(/{{\s*(\w+)?\s*}}/g)).reduce((acc, item) => {
    const capture = item[1];
    return acc + `.replace(/{{\\s*${capture}\\s*}}/g, ${capture})`;
  }, str);
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
      if (["input", "br"].includes(tag)) {
        const node = {
          tag,
          attrs,
        };
        compileNode(node, []);
        stack.push(node);
        return;
      }
      stack.push({
        completed: false,
        tag,
        attrs,
      });
    },
    end: (tag) => {
      if (tag in components) {
        // 忽略掉组件的所有children
        let peekNode = stack.pop();
        while (peekNode.completed) {
          peekNode = stack.pop();
        }
        stack.push({
          completed: true,
          funcStr: `createComponent('${tag}', ${uuid()})`,
        });
        return;
      }
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
        funcStr: compileText(text),
      });
    },
    comment: () => {},
  });
  return stack.pop();
}

function compileToFunc(template) {
  const { funcStr } = parseHtml(template.trim());
  try {
    console.debug(funcStr);
    return new Function(`with(this){ return ${funcStr}}`);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export { compileToFunc, parseHtml, compileText };
