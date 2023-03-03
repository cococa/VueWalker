let activeEffect;

function effect(fn) {
  const effectFn = () => {
    console.log("effectFn", effectFn.deps);
    //4.0 新增代码
    cleanup(effectFn)
    activeEffect = effectFn;
    fn();
  };
  effectFn.deps = [];
  effectFn();
}

function cleanup(effectFn) {
  for (var i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

const bucket = new WeakMap();

const data = { ok: true, text: "this is text props value" };

const obj = new Proxy(data, {
  get(target, prop) {
    console.log("Proxy get", { target, prop });
    track(target, prop);
    return target[prop];
  },

  set(target, prop, value) {
    console.log("Proxy set", { target, prop, value });
    target[prop] = value;
    trigger(target,prop);
  },
});

function track(target, key) {
  if (!activeEffect) {
    return;
  }
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

function trigger(target, key) {

  let depsMap = bucket.get(target);
  if (!depsMap) {
    return;
  }
  const fns = depsMap.get(key);
  
  //4.0 新增代码 防止死循环
  //在调用 forEach 遍历 Set 集合时，如果一个值已经被访问过了，但该值被删除并重新添加到集合，如果此时 forEach 遍历没有结束，那么该值会重新被访问。因此，上面的代码会无限执行。解决办法很简单，我们可以构造另外一个 Set 集合并遍历它：
  const effectToRun = new Set(fns);
  effectToRun.forEach(fn => fn());
  // 3.0 删除的代码
  //  fns && fns.forEach((fn) => fn());
}

// testcode 1
effect(() => {
  // 3.0 会执行三次，4.0 只会执行两次
  console.log("do effect");
  document.body.innerHTML = obj.ok ? obj.text : "not";
});
setTimeout(() => {
  obj.ok = false;
  obj.text = 'hello vue3'
}, 3000);


