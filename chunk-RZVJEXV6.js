import{a as o}from"./chunk-7FS3ZJLK.js";import{a as s}from"./chunk-L7NOU4T2.js";import{a as n}from"./chunk-EG2DTURK.js";import{a}from"./chunk-DHLVTH5U.js";import{a as l}from"./chunk-MVDZB4AK.js";import{a as i}from"./chunk-47NSYSFY.js";import{a as u}from"./chunk-2FO7ARYZ.js";var t=class extends s{constructor(){super(...arguments),this.blurSize=u()}};function g(){let e=new a;return e.include(o),e.outputs.add("fragSingleHighlight","vec2",0),e.fragment.uniforms.add(new n("blurSize",r=>r.blurSize),new l("blurInput",r=>r.blurInput)).main.add(i`vec2 highlightTextureSize = vec2(textureSize(blurInput,0));
vec2 center = texture(blurInput, sUV).rg;
if (vOutlinePossible == 0.0) {
fragSingleHighlight = center;
} else {
vec2 sum = center * 0.204164;
sum += texture(blurInput, sUV + blurSize * 1.407333).rg * 0.304005;
sum += texture(blurInput, sUV - blurSize * 1.407333).rg * 0.304005;
sum += texture(blurInput, sUV + blurSize * 3.294215).rg * 0.093913;
sum += texture(blurInput, sUV - blurSize * 3.294215).rg * 0.093913;
fragSingleHighlight = sum;
}`),e}var d=Object.freeze(Object.defineProperty({__proto__:null,SingleHighlightBlurDrawParameters:t,build:g},Symbol.toStringTag,{value:"Module"}));export{t as a,g as b,d as c};
