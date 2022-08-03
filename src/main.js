let activeEffect;

function effect(fn) {
  const effectFn = ()=>{
    cleanup(effectFn)
    activeEffect = effectFn;
    fn();
  }
  effectFn.deps = []
  effectFn()
}

function cleanup(effectFn){
  for(var i = 0; i< effectFn.deps.length; i++){
      const deps = effectFn.deps[i];
      deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}




function track(target ,key) {
  if(!activeEffect){return }
  let depsMap = bucket.get(target)
  if(!depsMap){
    bucket.set(target, depsMap = new Map())
  }
  let deps = depsMap.get(key)
  if(!deps){
    depsMap.set(key, deps = new Set())
  }
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}




const bucket = new WeakMap();

const data = { ok : false , text: "123" };

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


// testcode 1
effect(() => {
  console.log("do effect");
  document.body.innerHTML = obj.ok ? obj.text : 'not';
});
setTimeout(() => {
  obj.ok  = true
}, 3000);

