import{a as o}from"./chunk-ELCBU4NP.js";import{a as n}from"./chunk-GMZFCQJQ.js";import{a as c}from"./chunk-5WDH2LXO.js";import{a as u}from"./chunk-3AS27HNO.js";import{a as d}from"./chunk-44A27HB7.js";import{a as l}from"./chunk-47NSYSFY.js";import{a as r}from"./chunk-QXNVQZT7.js";var g=class extends d{constructor(e,t){super(e,"ivec2",r.Bind,(i,a)=>i.setUniform2iv(e,t(a)))}};function B(h,e){let{fragment:t}=h;e.output===u.Highlight?(t.uniforms.add(new o("depthTexture",i=>i.mainDepth),new o("highlightTexture",i=>i.highlightMixTexture),new n("highlightLevel",i=>i.highlightLevel??0),new g("highlightMixOrigin",i=>i.highlightMixOrigin)),h.outputs.add("fragHighlight","vec2",0),h.include(c),t.code.add(l`vec2 getAccumulatedHighlight() {
return texelFetch(highlightTexture, ivec2(gl_FragCoord.xy) - highlightMixOrigin, 0).rg;
}
void outputHighlight(bool occluded) {
if (highlightLevel == 0) {
uint bits = occluded ? 3u : 1u;
fragHighlight = vec2(float(bits) / 255.0, 0.0);
} else {
int ll = (highlightLevel & 3) << 1;
int li = (highlightLevel >> 2) & 3;
uint bits;
if (occluded) {
bits = 3u << ll;
} else {
bits = 1u << ll;
}
vec2 combinedHighlight = getAccumulatedHighlight();
uint accumulatedI = uint(combinedHighlight[li] * 255.0);
combinedHighlight[li] = float(bits | accumulatedI) / 255.0;
fragHighlight = combinedHighlight;
}
}
bool isHighlightOccluded() {
float sceneDepth = texelFetch(depthTexture, ivec2(gl_FragCoord.xy), 0).x;
return gl_FragCoord.z > sceneDepth + 5e-7;
}
void calculateOcclusionAndOutputHighlight() {
outputHighlight(isHighlightOccluded());
}`),e.canHaveOverlay&&t.code.add(l`void calculateOcclusionAndOutputHighlightOverlay(vec2 highlightToAdd) {
uint levelBits = readLevelBits(highlightToAdd, highlightLevel);
if ((levelBits & 1u) == 0u) { discard; }
outputHighlight(isHighlightOccluded());
}`)):t.code.add(l`void calculateOcclusionAndOutputHighlight() {}`)}var A=.003913894324853229;export{B as a,A as b};
