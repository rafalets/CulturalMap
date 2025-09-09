import{a as l}from"./chunk-VZWPFXBV.js";import{a}from"./chunk-NOHUHVCW.js";var p=class{constructor(e){this._rctx=e,this._store=new a}dispose(){this._store.forAll(e=>e.dispose()),this._store.clear()}acquire(e,t,o,i){let n=this._store.get(e,t);if(n!=null)return n.ref(),n;let s=new l(this._rctx,e,t,o,i);return s.ref(),this._store.set(e,t,s),s}get test(){}};function u(r){let{options:e,value:t}=r;return typeof e[t]=="number"}function _(r){let e="";for(let t in r){let o=r[t];if(typeof o=="boolean")o&&(e+=`#define ${t}
`);else if(typeof o=="number")e+=`#define ${t} ${o.toFixed()}
`;else if(typeof o=="object")if(u(o)){let{value:i,options:n,namespace:s}=o,f=s?`${s}_`:"";for(let c in n)e+=`#define ${f}${c} ${n[c].toFixed()}
`;e+=`#define ${t} ${f}${i}
`}else{let i=o.options,n=0;for(let s in i)e+=`#define ${i[s]} ${(n++).toFixed()}
`;e+=`#define ${t} ${i[o.value]}
`}}return e}export{p as a,_ as b};
