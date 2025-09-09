import{a as v}from"./chunk-6L543SC5.js";import{c as y}from"./chunk-7VWXQFPJ.js";import{a as h}from"./chunk-GWSX6PRO.js";import{a as g}from"./chunk-4LDVFWME.js";import{a as S}from"./chunk-GV3ZFCVD.js";import{a as N}from"./chunk-T7PUQGWM.js";import{a as p}from"./chunk-MVDZB4AK.js";import{a as o,b as c}from"./chunk-47NSYSFY.js";import{a as f}from"./chunk-QXNVQZT7.js";import{C as x}from"./chunk-5WKDXHVH.js";import{d as u,h as R}from"./chunk-NHSDW26F.js";function w({normalTexture:e,metallicRoughnessTexture:t,metallicFactor:a,roughnessFactor:r,emissiveTexture:l,emissiveFactor:d,occlusionTexture:s}){return e==null&&t==null&&l==null&&(d==null||x(d,R))&&s==null&&(r==null||r===1)&&(a==null||a===1)}var I=u(1,1,.5),M=u(0,.6,.2),B=u(0,1,.2);var n;(function(e){e[e.Disabled=0]="Disabled",e[e.Normal=1]="Normal",e[e.Schematic=2]="Schematic",e[e.Water=3]="Water",e[e.WaterOnIntegratedMesh=4]="WaterOnIntegratedMesh",e[e.Simplified=5]="Simplified",e[e.TerrainWithWater=6]="TerrainWithWater",e[e.COUNT=7]="COUNT"})(n||(n={}));function E(e,t){let a=t.pbrMode,r=e.fragment;if(a!==n.Schematic&&a!==n.Disabled&&a!==n.Normal)return void r.code.add(o`void applyPBRFactors() {}`);if(a===n.Disabled)return void r.code.add(o`void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);if(a===n.Schematic)return void r.code.add(o`vec3 mrr = vec3(0.0, 0.6, 0.2);
float occlusion = 1.0;
void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);let{hasMetallicRoughnessTexture:l,hasMetallicRoughnessTextureTransform:d,hasOcclusionTexture:s,hasOcclusionTextureTransform:T,bindType:m}=t;(l||s)&&e.include(y,t),r.code.add(o`vec3 mrr;
float occlusion;`),l&&r.uniforms.add(m===f.Pass?new g("texMetallicRoughness",i=>i.textureMetallicRoughness):new p("texMetallicRoughness",i=>i.textureMetallicRoughness)),s&&r.uniforms.add(m===f.Pass?new g("texOcclusion",i=>i.textureOcclusion):new p("texOcclusion",i=>i.textureOcclusion)),r.uniforms.add(m===f.Pass?new N("mrrFactors",i=>i.mrrFactors):new S("mrrFactors",i=>i.mrrFactors)),r.code.add(o`
    ${c(l,o`void applyMetallicRoughness(vec2 uv) {
            vec3 metallicRoughness = textureLookup(texMetallicRoughness, uv).rgb;
            mrr[0] *= metallicRoughness.b;
            mrr[1] *= metallicRoughness.g;
          }`)}

    ${c(s,"void applyOcclusion(vec2 uv) { occlusion *= textureLookup(texOcclusion, uv).r; }")}

    float getBakedOcclusion() {
      return ${s?"occlusion":"1.0"};
    }

    void applyPBRFactors() {
      mrr = mrrFactors;
      occlusion = 1.0;

      ${c(l,`applyMetallicRoughness(${d?"metallicRoughnessUV":"vuv0"});`)}
      ${c(s,`applyOcclusion(${T?"occlusionUV":"vuv0"});`)}
    }
  `)}function F(e){e.uniforms.add(new h("mainLightDirection",t=>t.lighting.mainLight.direction))}function H(e){e.uniforms.add(new h("mainLightIntensity",t=>t.lighting.mainLight.intensity))}function j(e){F(e.fragment),H(e.fragment),e.fragment.code.add(o`vec3 applyShading(vec3 shadingNormalWorld, float shadow) {
float dotVal = clamp(dot(shadingNormalWorld, mainLightDirection), 0.0, 1.0);
return mainLightIntensity * ((1.0 - shadow) * dotVal);
}`)}function b(e){let t=e.fragment.code;t.add(o`vec3 evaluateDiffuseIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float NdotNG)
{
return ((1.0 - NdotNG) * ambientGround + (1.0 + NdotNG) * ambientSky) * 0.5;
}`),t.add(o`float integratedRadiance(float cosTheta2, float roughness)
{
return (cosTheta2 - 1.0) / (cosTheta2 * (1.0 - roughness * roughness) - 1.0);
}`),t.add(o`vec3 evaluateSpecularIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float RdotNG, float roughness)
{
float cosTheta2 = 1.0 - RdotNG * RdotNG;
float intRadTheta = integratedRadiance(cosTheta2, roughness);
float ground = RdotNG < 0.0 ? 1.0 - intRadTheta : 1.0 + intRadTheta;
float sky = 2.0 - ground;
return (ground * ambientGround + sky * ambientSky) * 0.5;
}`)}function te(e,t){let a=e.fragment.code;e.include(v),t.pbrMode!==n.Normal&&t.pbrMode!==n.Schematic&&t.pbrMode!==n.Simplified&&t.pbrMode!==n.TerrainWithWater||(a.add(o`float normalDistribution(float NdotH, float roughness)
{
float a = NdotH * roughness;
float b = roughness / (1.0 - NdotH * NdotH + a * a);
return b * b * INV_PI;
}`),a.add(o`const vec4 c0 = vec4(-1.0, -0.0275, -0.572,  0.022);
const vec4 c1 = vec4( 1.0,  0.0425,  1.040, -0.040);
const vec2 c2 = vec2(-1.04, 1.04);
vec2 prefilteredDFGAnalytical(float roughness, float NdotV) {
vec4 r = roughness * c0 + c1;
float a004 = min(r.x * r.x, exp2(-9.28 * NdotV)) * r.x + r.y;
return c2 * a004 + r.zw;
}`)),t.pbrMode!==n.Normal&&t.pbrMode!==n.Schematic||(e.include(b),a.add(o`struct PBRShadingInfo
{
float NdotV;
float LdotH;
float NdotNG;
float RdotNG;
float NdotAmbDir;
float NdotH_Horizon;
vec3 skyRadianceToSurface;
vec3 groundRadianceToSurface;
vec3 skyIrradianceToSurface;
vec3 groundIrradianceToSurface;
float averageAmbientRadiance;
float ssao;
vec3 albedoLinear;
vec3 f0;
vec3 f90;
vec3 diffuseColor;
float metalness;
float roughness;
};`),a.add(o`vec3 evaluateEnvironmentIllumination(PBRShadingInfo inputs) {
vec3 indirectDiffuse = evaluateDiffuseIlluminationHemisphere(inputs.groundIrradianceToSurface, inputs.skyIrradianceToSurface, inputs.NdotNG);
vec3 indirectSpecular = evaluateSpecularIlluminationHemisphere(inputs.groundRadianceToSurface, inputs.skyRadianceToSurface, inputs.RdotNG, inputs.roughness);
vec3 diffuseComponent = inputs.diffuseColor * indirectDiffuse * INV_PI;
vec2 dfg = prefilteredDFGAnalytical(inputs.roughness, inputs.NdotV);
vec3 specularColor = inputs.f0 * dfg.x + inputs.f90 * dfg.y;
vec3 specularComponent = specularColor * indirectSpecular;
return (diffuseComponent + specularComponent);
}`),a.add(o`float gamutMapChanel(float x, vec2 p){
return (x < p.x) ? mix(0.0, p.y, x/p.x) : mix(p.y, 1.0, (x - p.x) / (1.0 - p.x) );
}`),a.add(o`vec3 blackLevelSoftCompression(vec3 inColor, PBRShadingInfo inputs){
vec3 outColor;
vec2 p = vec2(0.02 * (inputs.averageAmbientRadiance), 0.0075 * (inputs.averageAmbientRadiance));
outColor.x = gamutMapChanel(inColor.x, p) ;
outColor.y = gamutMapChanel(inColor.y, p) ;
outColor.z = gamutMapChanel(inColor.z, p) ;
return outColor;
}`))}function ae(e,t){let a=e.fragment.code;e.include(v),a.add(o`
  struct PBRShadingWater
  {
      float NdotL;   // cos angle between normal and light direction
      float NdotV;   // cos angle between normal and view direction
      float NdotH;   // cos angle between normal and half vector
      float VdotH;   // cos angle between view direction and half vector
      float LdotH;   // cos angle between light direction and half vector
      float VdotN;   // cos angle between view direction and normal vector
  };

  float dtrExponent = ${t.useCustomDTRExponentForWater?"2.2":"2.0"};
  `),a.add(o`vec3 fresnelReflection(float angle, vec3 f0, float f90) {
return f0 + (f90 - f0) * pow(1.0 - angle, 5.0);
}`),a.add(o`float normalDistributionWater(float NdotH, float roughness)
{
float r2 = roughness * roughness;
float NdotH2 = NdotH * NdotH;
float denom = pow((NdotH2 * (r2 - 1.0) + 1.0), dtrExponent) * PI;
return r2 / denom;
}`),a.add(o`float geometricOcclusionKelemen(float LoH)
{
return 0.25 / (LoH * LoH);
}`),a.add(o`vec3 brdfSpecularWater(in PBRShadingWater props, float roughness, vec3 F0, float F0Max)
{
vec3  F = fresnelReflection(props.VdotH, F0, F0Max);
float dSun = normalDistributionWater(props.NdotH, roughness);
float V = geometricOcclusionKelemen(props.LdotH);
float diffusionSunHaze = mix(roughness + 0.045, roughness + 0.385, 1.0 - props.VdotH);
float strengthSunHaze  = 1.2;
float dSunHaze = normalDistributionWater(props.NdotH, diffusionSunHaze) * strengthSunHaze;
return ((dSun + dSunHaze) * V) * F;
}`)}export{w as a,I as b,M as c,B as d,n as e,E as f,F as g,H as h,j as i,te as j,ae as k};
