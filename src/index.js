

function effect(){
    document.body.innerHTML = obj.text;
}

const bucket = new Set();

const data = { text: "123" }

const obj = new Proxy(data, {

    get: function(target, prop) {
        bucket.add(effect)
        return target[prop]    
    },

    set: function(target, prop, value) {
        target[prop] = value;
        bucket.forEach(effect  => effect());
        return true;
    }
})


effect();

setTimeout(()=>{
    obj.text = 'Hello Vue';
},3000)



