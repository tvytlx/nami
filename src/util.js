const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
};

function shareProperty(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

let __uuid = 0;
function uuid() {
  __uuid += 1;
  return __uuid;
}

export { shareProperty, uuid };
