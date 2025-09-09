var t=[];function e(o){t.push(o),t.length===1&&queueMicrotask(()=>{let n=t.slice();t.length=0;for(let c of n)c()})}export{e as a};
