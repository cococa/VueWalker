let activeEffect;

function effect(fn) {
  activeEffect = fn;
  fn();
}

/**
 *  这里注释下：
 *  WeakMap的 key 是 Proxy 的代理对象（对应下面代码中的 target ），value 则是 Map
 *  Map 中的 key 是代理对象的属性，value 则是一个 Set , 存放与代理对象的属性绑定的副作用函数集合
 *
 *
 *
 *
 *  Q:
 *   1. WeakMap 的 key 用的是一个对象，怎么确保唯一性？
 *   2.
 *
 */
const bucket = new WeakMap();

const data = { text: "123", age: 123 };

const obj = new Proxy(data, {
  get(target, prop) {
    console.log("Proxy get", { target, prop ,activeEffect });
    if (!activeEffect) {
      return;
    }
    let depsMap = bucket.get(target);
    if (!depsMap) {
      bucket.set(target, (depsMap = new Map()));
    }
    let deps = depsMap.get(prop);
    if (!deps) {
      depsMap.set(prop, (deps = new Set()));
    }
    console.log("--activeEffect---"+ activeEffect);
    deps.add(activeEffect);
    console.log("-----"+ deps.size);
    return target[prop];
  },

  set(target, prop, value) {
    console.log("Proxy set", { target, prop, value });
    target[prop] = value;
    let depsMap = bucket.get(target);
    if (!depsMap) {
      return;
    }
    const fns = depsMap.get(prop);
    console.log("the fns =" + (fns ? fns.size : "empry"));
    console.log({bucket})
    fns && fns.forEach((fn) => fn());
  },
});

function track() {}

function trigger() {}

// testcode 1
effect(() => {
  console.log("do effect test1");
  document.getElementById("test1").innerHTML = obj.text;
});
setTimeout(() => {
  obj.text = "Hello Vue";
}, 3000);

// 测试其他属性（存在的）
effect(() => {
  console.log("do effect test2");
  document.getElementById("test2").innerHTML = obj.age;
});
setTimeout(() => {
  obj.age = 1;
}, 6000);

// 测试其他的属性（不存在）
// effect(() => {
//     console.log("do effect");
//     document.getElementById("test3").innerHTML = obj.otherText;
//   });
// setTimeout(() => {
//     console.log("setTimeout change otherText");
//     obj.otherText = "Hello Vue from test3";
// }, 3000);
// setTimeout(() => {
//   console.log("bucket", bucket);
// }, 7000);
