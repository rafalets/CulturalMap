import{a as l}from"./chunk-L7NOU4T2.js";import{a as o}from"./chunk-4XEE5PE3.js";import{a as c}from"./chunk-DHLVTH5U.js";import{a as u}from"./chunk-MVDZB4AK.js";import{a as i}from"./chunk-47NSYSFY.js";var r=class extends l{};function s(){let e=new c,{outputs:x,fragment:t}=e;return e.include(o),t.uniforms.add(new u("textureInput",d=>d.input)),t.constants.add("outlineWidth","int",Math.ceil(a)),t.constants.add("cellSize","int",n),x.add("fragGrid","vec2"),t.main.add(i`ivec2 inputTextureSize = textureSize(textureInput, 0);
ivec2 cellBottomLeftCornerInput = ivec2(floor(gl_FragCoord.xy) * vec2(cellSize));
ivec2 coordMid =  cellBottomLeftCornerInput + ivec2(cellSize >> 1);
uvec2 centreTexel = uvec2( texelFetch(textureInput, coordMid, 0).rg * 255.0) & uvec2(0x55u);
float marginSquare = float(outlineWidth*outlineWidth);
uvec2 outputValue = centreTexel & uvec2(0x55u);
for(int y = -outlineWidth; y <= cellSize + outlineWidth; y+=2) {
int dy = y < 0 ? -y : y > cellSize ? y-cellSize : 0;
int xMargin = dy > 0 ? int(ceil(sqrt(marginSquare - float(dy*dy)))) : outlineWidth;
for(int x = -xMargin; x <= cellSize + xMargin; x+=2) {
ivec2 coord = cellBottomLeftCornerInput + ivec2(x, y);
uvec2[4] texels = uvec2[4] (
uvec2(texelFetch(textureInput,coord+ivec2(0,0),0).rg * 255.0) & uvec2(0x55u),
uvec2(texelFetch(textureInput,coord+ivec2(1,0),0).rg * 255.0) & uvec2(0x55u),
uvec2(texelFetch(textureInput,coord+ivec2(0,1),0).rg * 255.0) & uvec2(0x55u),
uvec2(texelFetch(textureInput,coord+ivec2(1,1),0).rg * 255.0) & uvec2(0x55u)
);
if (texels[0] == texels[1] && texels[1] == texels[2] && texels[2] == texels[3] && texels[3] ==  centreTexel) {
continue;
}
for (int i=0; i<4; ++i){
outputValue |= ((texels[i] ^ centreTexel) << 1);
outputValue |= texels[i];
}
}
}
fragGrid = vec2(outputValue) / 255.0;`),e}var n=32,a=9,v=.4,h=Object.freeze(Object.defineProperty({__proto__:null,HighlightDownsampleDrawParameters:r,blurSize:v,build:s,gridCellPixelSize:n,outlineSize:a},Symbol.toStringTag,{value:"Module"}));export{r as a,s as b,n as c,a as d,v as e,h as f};
