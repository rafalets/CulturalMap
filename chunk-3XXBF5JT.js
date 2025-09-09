import{b as g}from"./chunk-4MZNR6MW.js";import{a as i}from"./chunk-GVSOJUIP.js";import{a as l}from"./chunk-HUUJBVXR.js";import{a as c}from"./chunk-DHLVTH5U.js";import{a as d}from"./chunk-47NSYSFY.js";import{a as o}from"./chunk-RWCIDBNQ.js";function u(n){let a=new c,{vertex:e,fragment:s,attributes:t,varyings:v}=a;return g(e,n),t.add(o.POSITION,"vec3"),t.add(o.UV0,"vec2"),v.add("vUV","vec2"),e.main.add(d`vUV = uv0;
gl_Position = proj * view * vec4(position, 1.0);`),s.uniforms.add(new i("backgroundColor",r=>r.backgroundColor),new i("gridColor",r=>r.gridColor),new l("gridWidth",r=>r.gridWidth)).main.add(d`const float LINE_WIDTH = 1.0;
vec2 uvScaled = vUV * gridWidth;
vec2 gridUV = (fract(uvScaled + 0.5) - 0.5) / (LINE_WIDTH * fwidth(uvScaled));
vec2 grid = (1.0 - step(0.5, gridUV)) * step(-0.5, gridUV);
grid.x *= step(0.5, uvScaled.x) * step(uvScaled.x, gridWidth - 0.5);
grid.y *= step(0.5, uvScaled.y) * step(uvScaled.y, gridWidth - 0.5);
float gridFade = max(grid.x, grid.y);
float gridAlpha = gridColor.a * gridFade;
fragColor =
vec4(backgroundColor.rgb * backgroundColor.a, backgroundColor.a) * (1.0 - gridAlpha) +
vec4(gridColor.rgb, 1.0) * gridAlpha;`),a}var C=Object.freeze(Object.defineProperty({__proto__:null,build:u},Symbol.toStringTag,{value:"Module"}));export{u as a};
