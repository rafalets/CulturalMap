import{a}from"./chunk-7FS3ZJLK.js";import{d as r,e as s}from"./chunk-WJ6C4VZW.js";import{a as n}from"./chunk-AMISFAT3.js";import{a as u}from"./chunk-5WDH2LXO.js";import{a as c}from"./chunk-EG2DTURK.js";import{a as h}from"./chunk-HUUJBVXR.js";import{a as i}from"./chunk-4LDVFWME.js";import{a as g}from"./chunk-DHLVTH5U.js";import{a as o}from"./chunk-47NSYSFY.js";function d(){let t=new g;t.include(a);let{fragment:l}=t;return l.uniforms.add(new i("blurInput",e=>e.singleHighlightBlurTexture),new c("blurSize",e=>e.blurSize),new i("highlightTexture",e=>e.highlightTexture),new i("highlightOptionsTexture",e=>e.highlightOptionsTexture),new n("highlightLevel",e=>e.highlightLevel),new h("occludedIntensityFactor",e=>e.occludedFactor)),l.constants.add("inner","float",1-(r-s)/r),t.include(u),l.main.add(o`vec2 highlightTextureSize = vec2(textureSize(highlightTexture,0));
vec2 uv = sUV;
vec2 center = texture(blurInput, uv).rg;
vec2 blurredHighlightValue = (vOutlinePossible == 0.0)
? center
: center * 0.204164
+ texture(blurInput, uv + blurSize * 1.407333).rg * 0.304005
+ texture(blurInput, uv - blurSize * 1.407333).rg * 0.304005
+ texture(blurInput, uv + blurSize * 3.294215).rg * 0.093913
+ texture(blurInput, uv - blurSize * 3.294215).rg * 0.093913;
float highlightIntensity = blurredHighlightValue.r;
float occlusionWeight = blurredHighlightValue.g;
if (highlightIntensity <= 0.01) {
discard;
}
vec4 fillColor    = texelFetch(highlightOptionsTexture, ivec2(highlightLevel, 0), 0);
vec4 outlineColor = texelFetch(highlightOptionsTexture, ivec2(highlightLevel, 1), 0);
vec2 centerTexel = texelFetch(highlightTexture, ivec2(uv * highlightTextureSize), 0).rg;
uint centerBits = readLevelBits(centerTexel, highlightLevel);
bool centerFilled = (centerBits & 1u) == 1u;
bool centerOccluded = (centerBits & 3u) == 3u;
bool occluded = centerOccluded || (0.5 * highlightIntensity < occlusionWeight);
float occlusionFactor = occluded ? occludedIntensityFactor : 1.0;
float outlineFactor = centerFilled ? 1.0 : smoothstep(0.0, inner, highlightIntensity);
float fillFactor = centerFilled ? 1.0 : 0.0;
vec4 baseColor = mix(outlineColor, fillColor, fillFactor);
float intensity = baseColor.a * occlusionFactor * outlineFactor;
fragColor = vec4(baseColor.rgb, intensity);`),t}var I=Object.freeze(Object.defineProperty({__proto__:null,build:d},Symbol.toStringTag,{value:"Module"}));export{d as a,I as b};
