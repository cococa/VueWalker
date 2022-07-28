let activeEffect;

function effect(fn) {
  activeEffect = fn;
  fn();
}

const bucket = new Set();

const data = { text: "123" };

const obj = new Proxy(data, {
  get(target, prop) {
    if (activeEffect) {
      bucket.add(activeEffect);
    }
    return target[prop];
  },

  set(target, prop, value) {
    target[prop] = value;
    console.log("Proxy set ", { prop, value });
    bucket.forEach((fn) => fn());
    return true;
  },
});

effect(() => {
  console.log("do effect");
  document.body.innerHTML = obj.text;
});

setTimeout(() => {
  obj.text = "Hello Vue";
}, 3000);
