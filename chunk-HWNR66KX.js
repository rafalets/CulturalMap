function s(n,o){let t=0;for(let i of o){let e=i.attributes?.[n];typeof e=="number"&&isFinite(e)&&(t=Math.max(t,e))}return t}export{s as a};
