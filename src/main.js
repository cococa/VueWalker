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

const data = { text: "123" };

const obj = new Proxy(data, {
  get(target, prop) {
    console.log("Proxy get", {target, prop});
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
    deps.add(activeEffect);
    return target[prop];
  },

  set(target, prop, value) {
    console.log("Proxy set", {target, prop, value});
    target[prop] = value;
    let depsMap = bucket.get(target);
    if (!depsMap) {
      return;
    }
    const fns = depsMap.get(prop);
    fns && fns.forEach((fn) => fn());
  },
});

function track(){

}

function trigger(){
  
}





// testcode 1
effect(() => {
  console.log("do effect");
  document.body.innerHTML = obj.text;
});
setTimeout(() => {
  obj.text = "Hello Vue";
}, 3000);


// testcode 2
// effect(() => {
//     console.log("do effect");
//     document.body.innerHTML = obj.otherText;
//   });
// setTimeout(() => {
//     console.log("setTimeout change otherText");
//     obj.otherText = "Hello Vue";
// }, 3000);
// setTimeout(() => {
//   console.log("bucket", bucket);
// }, 7000);
