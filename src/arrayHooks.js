
//__proto__  原型链demo

class Person{
  constructor(name){
    this.name = name;
  }
  sayName(){
    console.log(this.name);
  }
}

var p  = new Person("zhangsan");
p.__proto__.sayName = function(){
  console.log("__proto__ hook", this.name);
}
p.sayName();


// Object.create
// Object.defineProperty


const hooksMethods = ['push']

const arrayOriginMethods = Array.prototype;

// console.log(arrayOriginMethods)

const objArray = Object.create(arrayOriginMethods);

const origina = arrayOriginMethods['push'];

// console.log(objArray)




Object.defineProperty(objArray, 'push', {
  value: function mutator(...arguments){
    // debugger;
    console.log("defineProperty push", arguments);
    // console.log(this);
    const result =  origina.apply(list, arguments);
    // console.log("result",result);
    return result;
  },
  writable: true,
  configurable: true
})

console.log(objArray);


const list = []
list.__proto__ = objArray

console.log(objArray);


list.push(1);
list.push(2);
list.push(3);
console.log(list);


