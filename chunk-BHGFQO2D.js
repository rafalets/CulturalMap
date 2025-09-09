import{e as b}from"./chunk-VOJIMLDZ.js";import{a as u}from"./chunk-GWSX6PRO.js";import{a as w}from"./chunk-ELCBU4NP.js";import{a as S}from"./chunk-GMZFCQJQ.js";import{a as i}from"./chunk-2PJRHNJW.js";import{a as l}from"./chunk-44A27HB7.js";import{a as r}from"./chunk-47NSYSFY.js";import{a as c}from"./chunk-QXNVQZT7.js";import{c as f}from"./chunk-5WKDXHVH.js";import{a as x}from"./chunk-PTZYZULI.js";import{b as n}from"./chunk-KZKWOEFD.js";import{a as v}from"./chunk-NHSDW26F.js";function z(s,e){let t=s.fragment,o=e.lightingSphericalHarmonicsOrder!==void 0?e.lightingSphericalHarmonicsOrder:2;o===0?(t.uniforms.add(new u("lightingAmbientSH0",({lighting:a})=>f(_,a.sh.r[0],a.sh.g[0],a.sh.b[0]))),t.code.add(r`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec3 ambientLight = 0.282095 * lightingAmbientSH0;
return ambientLight * (1.0 - ambientOcclusion);
}`)):o===1?(t.uniforms.add(new i("lightingAmbientSH_R",({lighting:a})=>n(m,a.sh.r[0],a.sh.r[1],a.sh.r[2],a.sh.r[3])),new i("lightingAmbientSH_G",({lighting:a})=>n(m,a.sh.g[0],a.sh.g[1],a.sh.g[2],a.sh.g[3])),new i("lightingAmbientSH_B",({lighting:a})=>n(m,a.sh.b[0],a.sh.b[1],a.sh.b[2],a.sh.b[3]))),t.code.add(r`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec4 sh0 = vec4(
0.282095,
0.488603 * normal.x,
0.488603 * normal.z,
0.488603 * normal.y
);
vec3 ambientLight = vec3(
dot(lightingAmbientSH_R, sh0),
dot(lightingAmbientSH_G, sh0),
dot(lightingAmbientSH_B, sh0)
);
return ambientLight * (1.0 - ambientOcclusion);
}`)):o===2&&(t.uniforms.add(new u("lightingAmbientSH0",({lighting:a})=>f(_,a.sh.r[0],a.sh.g[0],a.sh.b[0])),new i("lightingAmbientSH_R1",({lighting:a})=>n(m,a.sh.r[1],a.sh.r[2],a.sh.r[3],a.sh.r[4])),new i("lightingAmbientSH_G1",({lighting:a})=>n(m,a.sh.g[1],a.sh.g[2],a.sh.g[3],a.sh.g[4])),new i("lightingAmbientSH_B1",({lighting:a})=>n(m,a.sh.b[1],a.sh.b[2],a.sh.b[3],a.sh.b[4])),new i("lightingAmbientSH_R2",({lighting:a})=>n(m,a.sh.r[5],a.sh.r[6],a.sh.r[7],a.sh.r[8])),new i("lightingAmbientSH_G2",({lighting:a})=>n(m,a.sh.g[5],a.sh.g[6],a.sh.g[7],a.sh.g[8])),new i("lightingAmbientSH_B2",({lighting:a})=>n(m,a.sh.b[5],a.sh.b[6],a.sh.b[7],a.sh.b[8]))),t.code.add(r`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec3 ambientLight = 0.282095 * lightingAmbientSH0;
vec4 sh1 = vec4(
0.488603 * normal.x,
0.488603 * normal.z,
0.488603 * normal.y,
1.092548 * normal.x * normal.y
);
vec4 sh2 = vec4(
1.092548 * normal.y * normal.z,
0.315392 * (3.0 * normal.z * normal.z - 1.0),
1.092548 * normal.x * normal.z,
0.546274 * (normal.x * normal.x - normal.y * normal.y)
);
ambientLight += vec3(
dot(lightingAmbientSH_R1, sh1),
dot(lightingAmbientSH_G1, sh1),
dot(lightingAmbientSH_B1, sh1)
);
ambientLight += vec3(
dot(lightingAmbientSH_R2, sh2),
dot(lightingAmbientSH_G2, sh2),
dot(lightingAmbientSH_B2, sh2)
);
return ambientLight * (1.0 - ambientOcclusion);
}`),e.pbrMode!==b.Normal&&e.pbrMode!==b.Schematic||t.code.add(r`const vec3 skyTransmittance = vec3(0.9, 0.9, 1.0);
vec3 calculateAmbientRadiance(float ambientOcclusion)
{
vec3 ambientLight = 1.2 * (0.282095 * lightingAmbientSH0) - 0.2;
return ambientLight *= (1.0 - ambientOcclusion) * skyTransmittance;
}`))}var _=v(),m=x();function A(s){s.code.add(r`const float MAX_RGBA4_FLOAT =
15.0 / 16.0 +
15.0 / 16.0 / 16.0 +
15.0 / 16.0 / 16.0 / 16.0 +
15.0 / 16.0 / 16.0 / 16.0 / 16.0;
const vec4 FIXED_POINT_FACTORS_RGBA4 = vec4(1.0, 16.0, 16.0 * 16.0, 16.0 * 16.0 * 16.0);
vec4 floatToRgba4(const float value) {
float valueInValidDomain = clamp(value, 0.0, MAX_RGBA4_FLOAT);
vec4 fixedPointU4 = floor(fract(valueInValidDomain * FIXED_POINT_FACTORS_RGBA4) * 16.0);
const float toU4AsFloat = 1.0 / 15.0;
return fixedPointU4 * toU4AsFloat;
}
const vec4 RGBA4_2_FLOAT_FACTORS = vec4(
15.0 / (16.0),
15.0 / (16.0 * 16.0),
15.0 / (16.0 * 16.0 * 16.0),
15.0 / (16.0 * 16.0 * 16.0 * 16.0)
);
float rgba4ToFloat(vec4 rgba) {
return dot(rgba, RGBA4_2_FLOAT_FACTORS);
}`)}var h=class extends l{constructor(e,t,o){super(e,"mat4",c.Draw,(a,g,p,T)=>a.setUniformMatrix4fv(e,t(g,p,T)),o)}};var d=class extends l{constructor(e,t,o){super(e,"mat4",c.Pass,(a,g,p)=>a.setUniformMatrix4fv(e,t(g,p)),o)}};function ea(s,e){e.receiveShadows&&(s.fragment.uniforms.add(new d("shadowMapMatrix",(t,o)=>o.shadowMap.getShadowMapMatrices(t.origin),4)),M(s))}function sa(s,e){e.receiveShadows&&(s.fragment.uniforms.add(new h("shadowMapMatrix",(t,o)=>o.shadowMap.getShadowMapMatrices(t.origin),4)),M(s))}function M(s){let e=s.fragment;e.include(A),e.uniforms.add(new w("shadowMap",t=>t.shadowMap.depthTexture),new S("numCascades",t=>t.shadowMap.numCascades),new i("cascadeDistances",t=>t.shadowMap.cascadeDistances)).code.add(r`int chooseCascade(float depth, out mat4 mat) {
vec4 distance = cascadeDistances;
int i = depth < distance[1] ? 0 : depth < distance[2] ? 1 : depth < distance[3] ? 2 : 3;
mat = i == 0 ? shadowMapMatrix[0] : i == 1 ? shadowMapMatrix[1] : i == 2 ? shadowMapMatrix[2] : shadowMapMatrix[3];
return i;
}
vec3 lightSpacePosition(vec3 _vpos, mat4 mat) {
vec4 lv = mat * vec4(_vpos, 1.0);
lv.xy /= lv.w;
return 0.5 * lv.xyz + vec3(0.5);
}
vec2 cascadeCoordinates(int i, ivec2 textureSize, vec3 lvpos) {
float xScale = float(textureSize.y) / float(textureSize.x);
return vec2((float(i) + lvpos.x) * xScale, lvpos.y);
}
float readShadowMapDepth(ivec2 uv, sampler2D _depthTex) {
return rgba4ToFloat(texelFetch(_depthTex, uv, 0));
}
float posIsInShadow(ivec2 uv, vec3 lvpos, sampler2D _depthTex) {
return readShadowMapDepth(uv, _depthTex) < lvpos.z ? 1.0 : 0.0;
}
float filterShadow(vec2 uv, vec3 lvpos, ivec2 texSize, sampler2D _depthTex) {
vec2 st = fract(uv * vec2(texSize) + vec2(0.5));
ivec2 base = ivec2(uv * vec2(texSize) - vec2(0.5));
float s00 = posIsInShadow(ivec2(base.x, base.y), lvpos, _depthTex);
float s10 = posIsInShadow(ivec2(base.x + 1, base.y), lvpos, _depthTex);
float s11 = posIsInShadow(ivec2(base.x + 1, base.y + 1), lvpos, _depthTex);
float s01 = posIsInShadow(ivec2(base.x, base.y + 1), lvpos, _depthTex);
return mix(mix(s00, s10, st.x), mix(s01, s11, st.x), st.y);
}
float readShadowMap(const in vec3 _vpos, float _linearDepth) {
mat4 mat;
int i = chooseCascade(_linearDepth, mat);
if (i >= numCascades) { return 0.0; }
vec3 lvpos = lightSpacePosition(_vpos, mat);
if (lvpos.z >= 1.0 || lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) { return 0.0; }
ivec2 size = textureSize(shadowMap, 0);
vec2 uv = cascadeCoordinates(i, size, lvpos);
return filterShadow(uv, lvpos, size, shadowMap);
}`)}export{A as a,z as b,ea as c,sa as d};
