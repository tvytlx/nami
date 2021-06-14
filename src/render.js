import htmlParsing from "./html-parser";
import { components } from "./components";
import { uuid } from "./util";

function compileAttrs(attrs, node) {
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
        // support :model
        let directive = name.slice(1);
        if (directive === "model") {
          userAttrStr += `value:${value},`;
          userFuncStr += `value:${value},`;
          eventFuncStr += `input: (ev, node)=>{${value} = node.elm.value;},`;
        } else if (directive === "if") {
          node.ifFuncStr = value;
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
  return Array.from(text.matchAll(/{{\s*([\w\.]+)?\s*}}/g)).reduce(
    (acc, item) => {
      const capture = item[1];
      return (
        acc +
        `.replace(/{{\\s*${capture.replace(".", `\.`)}\\s*}}/g, ${capture})`
      );
    },
    str
  );
}

function compileNode(peekNode, children) {
  peekNode.funcStr = `h('${peekNode.tag}', ${compileAttrs(
    peekNode.attrs,
    peekNode
  )}, [${children.map((child) => child.funcStr).join(",")}])`;
  // 存在 if 条件语句
  if (peekNode.ifFuncStr) {
    peekNode.funcStr = `${peekNode.ifFuncStr} ? ${peekNode.funcStr} : ''`;
  }
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
      let children = [];
      let peekNode = stack.pop();
      if (tag === "slot") {
        const slot = peekNode.attrs.find((attr) => attr.name === "name");
        // slot 没有 children
        stack.push({
          completed: true,
          funcStr: `slotVnode['${slot.value}'] || ''`,
        });
        return;
      }
      while (peekNode.completed) {
        children.unshift(peekNode);
        peekNode = stack.pop();
      }
      if (tag in components) {
        let slotVnodeMapStr = "{";
        children.forEach((child) => {
          if (child.slotName) {
            slotVnodeMapStr += `${child.slotName}: ${child.funcStr},`;
          }
        });
        slotVnodeMapStr += "}";
        const props = {};
        peekNode.attrs
          .filter((attr) => attr.name.startsWith("p-"))
          .forEach((attr) => (props[attr.name.slice(2)] = attr.value));
        // 暂时不支持父子传参数传object，只支持json序列化
        stack.push({
          completed: true,
          funcStr: `createComponent(
            '${tag}',
            ${uuid()},
            ${slotVnodeMapStr},
            ${JSON.stringify(props)})`,
        });
        return;
      }
      compileNode(peekNode, children);
      const slot = peekNode.attrs.find((attr) => attr.name === "slot");
      if (slot) {
        peekNode.slotName = slot.value;
      }
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
