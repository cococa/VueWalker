// https://www.webpackjs.com/guides/getting-started/#%E4%BD%BF%E7%94%A8%E4%B8%80%E4%B8%AA%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6

export interface INode {
  style: string;
  children: Array<INode>;
  tag: string;
  text: string;
}

export class VNode implements INode {
  style: string;
  children: Array<INode>;
  tag: string;
  text: string;
  id : string;
  cls : string;

  constructor(
    style: string,
    children: Array<INode>,
    tag: string,
    text: string,
    id : string,
    cls: string
  ) {
    this.style = style;
    this.children = children;
    this.tag = tag;
    this.text = text;
    this.id = id;
    this.cls = cls;
  }

  toString() {
    return "style=" + this.style;
  }
}


let root = document.getElementById("root");
let vnode = createVNode(root);
console.log(vnode.toString());

export function createVNode(dom: Element): VNode{

    let root =  new VNode("123", null, "", "","id","cls");
    root.id = dom.id;
    root.style = dom.getAttribute("style");
    root.cls = dom.getAttribute('class');
    root.tag = dom.tagName ? dom.tagName :''


    console.log(root.id);
    console.log(root.style);
    console.log(root.cls);
    console.log(root.tag);

    let childNodes = dom.childNodes;        
    for(var i = 0 ; i < childNodes.length; i++){
        // createVNode(childNodes[i]); 
    }

    return root;
}



