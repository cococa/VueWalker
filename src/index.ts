export default function getHello() {
  return "Hello";
}

function effect() {
  document.body.innerHTML = obj.text;
}

const bucket = new Set();

const data = { text: "123" };

const obj = new Proxy(data, {
  get(target, prop) {
    bucket.add(effect);
    return Reflect.get(target, prop);
  },

  set(target, prop, value) {
    Reflect.defineProperty(target, prop, { value: value });
    bucket.forEach((effect: Function) => effect());
    return true;
  },
});

effect();

setTimeout(() => {
  obj.text = "Hello Vue";
}, 3000);
