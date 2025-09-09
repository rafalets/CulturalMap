import{a as i}from"./chunk-ELCBU4NP.js";import{a as n}from"./chunk-A5S42OSQ.js";import{a as t,b as o}from"./chunk-47NSYSFY.js";var p;(function(e){e[e.NONE=0]="NONE",e[e.ColorAlpha=1]="ColorAlpha",e[e.FrontFace=2]="FrontFace",e[e.COUNT=3]="COUNT"})(p||(p={}));function m(e,{occlusionPass:r,terrainDepthTest:v,cullAboveTerrain:d}){let a=e.vertex,c=e.fragment;if(!v)return a.code.add("void forwardViewPosDepth(vec3 pos) {}"),void c.code.add(`${r?"bool":"void"} discardByTerrainDepth() { ${o(r,"return false;")}}`);e.varyings.add("viewPosDepth","float"),a.code.add(`void forwardViewPosDepth(vec3 pos) {
    viewPosDepth = pos.z;
  }`),c.include(n),c.uniforms.add(new i("terrainDepthTexture",s=>s.terrainDepth?.attachment)).code.add(t`
    ${r?"bool":"void"} discardByTerrainDepth() {
      float depth = texelFetch(terrainDepthTexture, ivec2(gl_FragCoord.xy), 0).r;
      float linearDepth = linearizeDepth(depth);
      ${r?"return viewPosDepth < linearDepth && depth < 1.0;":`if(viewPosDepth ${d?">":"<="} linearDepth) discard;`}
    }`)}function w(e){e.code.add(t`vec4 premultiplyAlpha(vec4 v) {
return vec4(v.rgb * v.a, v.a);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), min(d / (q.x + e), 1.0), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
float rgb2v(vec3 c) {
return max(c.x, max(c.y, c.z));
}`)}export{p as a,m as b,w as c};
