import{a}from"./chunk-7FS3ZJLK.js";import{a as h}from"./chunk-AMISFAT3.js";import{a as g}from"./chunk-5WDH2LXO.js";import{a as r}from"./chunk-4LDVFWME.js";import{a as o}from"./chunk-DHLVTH5U.js";import{a as l}from"./chunk-47NSYSFY.js";function s(){let e=new o;e.include(a),e.include(g);let{fragment:t}=e;return e.outputs.add("fragSingleHighlight","vec2",0),t.uniforms.add(new r("highlightTexture",i=>i.highlightTexture),new h("highlightLevel",i=>i.highlightLevel)),t.main.add(l`ivec2 iuv = ivec2(gl_FragCoord.xy);
vec2 inputTexel = texelFetch(highlightTexture, iuv, 0).rg;
uint bits = readLevelBits(inputTexel, highlightLevel);
bool hasHighlight = (bits & 1u) == 1u;
bool hasOccluded  = (bits & 2u) == 2u;
fragSingleHighlight = vec2(hasHighlight ? 1.0 : 0.0, hasOccluded ? 1.0 : 0.0);`),e}var p=Object.freeze(Object.defineProperty({__proto__:null,build:s},Symbol.toStringTag,{value:"Module"}));export{s as a,p as b};
