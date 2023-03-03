let activeEffect;
let effectStrack = []

function effect(fn) {
  const effectFn = () => {
    console.log("effectFn", effectFn.deps);
    //4.0 新增代码
    cleanup(effectFn);
    activeEffect = effectFn;
    fn();
    // 当前的副作用函数执行结束后, 出栈
    effectStrack.pop()
    // activeEffect 还原为之前的值
    activeEffect = effectStrack[effectStrack.length - 1]
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

const data = { ok: true, text: "this is text props value", count: 0 };

const obj = new Proxy(data, {
  get(target, prop) {
    console.log("Proxy get", { target, prop });
    track(target, prop);
    return target[prop];
  },

  set(target, prop, value) {
    console.log("Proxy set", { target, prop, value });
    target[prop] = value;
    trigger(target, prop);
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
  console.log("start trigger depsMap", depsMap);
  if (!depsMap) {
    return;
  }
  const fns = depsMap.get(key);
  console.log("start trigger fns", fns);
  const effectToRun = new Set();
  //5.0 新增代码 防止死循环
  fns && fns.forEach((fn) => {
    if (activeEffect !== fn) {
      effectToRun.add(fn);
    }
  });
  console.log("start trigger effectToRun", effectToRun);
  effectToRun.forEach((fn) => fn());
  console.log("effectStrack",effectStrack);
}

effect(() => {
  console.log("do effect");
  document.body.innerHTML = obj.count;
});
setTimeout(() => {
  obj.count++;
}, 3000);
