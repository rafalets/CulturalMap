import{c as g}from"./chunk-WJ6C4VZW.js";import{a}from"./chunk-AMISFAT3.js";import{a as h}from"./chunk-4LDVFWME.js";import{a as s}from"./chunk-44A27HB7.js";import{a as n}from"./chunk-47NSYSFY.js";import{a as r}from"./chunk-QXNVQZT7.js";import{a as c}from"./chunk-2FO7ARYZ.js";import{b as o}from"./chunk-QXXXCEV5.js";var l=class extends s{constructor(i,e){super(i,"ivec2",r.Pass,(d,u,m)=>d.setUniform2iv(i,e(u,m)))}};function R(t){let{vertex:i}=t;i.uniforms.add(new h("coverageTexture",e=>e.coverageTexture),new l("highlightRenderCellCount",e=>o(v,e.horizontalCellCount,e.verticalCellCount)),new l("highlightTextureResolution",({highlightTexture:e})=>o(v,e.descriptor.width,e.descriptor.height)),new a("highlightLevel",e=>e.highlightLevel)).constants.add("cellSize","int",g),t.varyings.add("sUV","vec2"),t.varyings.add("vOutlinePossible","float"),i.code.add(n`const ivec2 cellVertices[4] = ivec2[4](ivec2(0,0), ivec2(1,0), ivec2(0,1), ivec2(1,1));`).main.add(n`int cellIndex = gl_InstanceID;
int cellX = cellIndex % highlightRenderCellCount[0];
int cellY = (cellIndex - cellX) / highlightRenderCellCount[0];
ivec2 cellPos = ivec2(cellX, cellY);
uvec2 covTexel = uvec2(texelFetch(coverageTexture, cellPos, 0).rg * 255.0);
int channelIndex = (highlightLevel >> 2) & 3;
uint channelValue = covTexel[channelIndex];
int highlightIndex = (highlightLevel & 3) << 1;
bool covered = ((channelValue >> highlightIndex) & 1u) == 1u;
if (!covered) {
gl_Position = vec4(0.0);
return;
}
vOutlinePossible = (((channelValue >> highlightIndex) & 2u) == 2u) ? 1.0 : 0.0;
ivec2 iPosInCell = cellVertices[gl_VertexID];
vec2 sPos = vec2(cellPos * cellSize + iPosInCell * (cellSize));
vec2 vPos = sPos / vec2(highlightTextureResolution);
sUV = vPos;
gl_Position = vec4(2.0 * vPos - vec2(1.0), 0.0, 1.0);`)}var v=c();export{R as a};
