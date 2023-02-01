
import getHello from './index.ts';

console.log(
    getHello()
    );


function effect(){
    document.body.innerHTML = obj.text;
}

const bucket = new Set();

const data = { text: "123" }

const obj = new Proxy(data, {

    get(target, prop) {
        bucket.add(effect)
        return target[prop]    
    },

    set(target, prop, value) {
        target[prop] = value;
        bucket.forEach(effect  => effect());
        return true;
    }
})


effect();

setTimeout(()=>{
    obj.text = 'Hello Vue';
},3000)



