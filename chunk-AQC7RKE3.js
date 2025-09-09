import{a as g}from"./chunk-MH7FV4OG.js";import{a as z}from"./chunk-2IWALBQY.js";import{a as I,b as H,c as G,d as T,e as k}from"./chunk-WKFWO47P.js";import{d as u}from"./chunk-BHGFQO2D.js";import{e as f,f as S,h as $}from"./chunk-VOJIMLDZ.js";import{a as C,d as V,e as A,f as d}from"./chunk-WPMNZVYJ.js";import{h as q}from"./chunk-7VWXQFPJ.js";import{a as R}from"./chunk-WDRWH4L7.js";import{m as j,n as m,v as B,w as p}from"./chunk-3D4Y6BLC.js";import{b as W,c as X}from"./chunk-OTUHXNWB.js";import{a as U}from"./chunk-NBT2WTKD.js";import{a as c}from"./chunk-JLLOI4DS.js";import{a as N,b as L,c as D}from"./chunk-4MZNR6MW.js";import{a as M}from"./chunk-WOZSH7YY.js";import{a as E}from"./chunk-HUUJBVXR.js";import{a as _}from"./chunk-DHLVTH5U.js";import{a as l,h as x}from"./chunk-3AS27HNO.js";import{a as n}from"./chunk-T7PUQGWM.js";import{a as e,b as w}from"./chunk-47NSYSFY.js";import{a as v}from"./chunk-RWCIDBNQ.js";import{c as b}from"./chunk-2FO7ARYZ.js";var h=8;function K(a,o){let t=v.FEATUREVALUE;a.attributes.add(t,"vec4");let i=a.vertex;i.code.add(e`
  bool isCapVertex() {
    return ${t}.w == 1.0;
  }
  `),i.uniforms.add(new M("size",r=>r.size)),o.vvSize?(i.uniforms.add(new n("vvSizeMinSize",r=>r.vvSize.minSize),new n("vvSizeMaxSize",r=>r.vvSize.maxSize),new n("vvSizeOffset",r=>r.vvSize.offset),new n("vvSizeFactor",r=>r.vvSize.factor)),i.code.add(e`
    vec2 getSize() {
      return size * clamp(vvSizeOffset + ${t}.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize).xz;
    }
    `)):i.code.add(e`vec2 getSize(){
return size;
}`),o.vvOpacity?(i.constants.add("vvOpacityNumber","int",h),i.uniforms.add(new m("vvOpacityValues",r=>r.vvOpacity.values,h),new m("vvOpacityOpacities",r=>r.vvOpacity.opacityValues,h)),i.code.add(e`
    vec4 applyOpacity(vec4 color) {
      float value = ${t}.z;
      if (value <= vvOpacityValues[0]) {
        return vec4( color.xyz, vvOpacityOpacities[0]);
      }

      for (int i = 1; i < vvOpacityNumber; ++i) {
        if (vvOpacityValues[i] >= value) {
          float f = (value - vvOpacityValues[i-1]) / (vvOpacityValues[i] - vvOpacityValues[i-1]);
          return vec4( color.xyz, mix(vvOpacityOpacities[i-1], vvOpacityOpacities[i], f));
        }
      }

      return vec4( color.xyz, vvOpacityOpacities[vvOpacityNumber - 1]);
    }
    `)):i.code.add(e`vec4 applyOpacity(vec4 color){
return color;
}`),o.vvColor?(i.constants.add("vvColorNumber","int",p),i.uniforms.add(new m("vvColorValues",r=>r.vvColor.values,p),new j("vvColorColors",r=>r.vvColor.colors,p)),i.code.add(e`
    vec4 getColor() {
      float value = ${t}.y;
      if (value <= vvColorValues[0]) {
        return applyOpacity(vvColorColors[0]);
      }

      for (int i = 1; i < vvColorNumber; ++i) {
        if (vvColorValues[i] >= value) {
          float f = (value - vvColorValues[i-1]) / (vvColorValues[i] - vvColorValues[i-1]);
          return applyOpacity(mix(vvColorColors[i-1], vvColorColors[i], f));
        }
      }

      return applyOpacity(vvColorColors[vvColorNumber - 1]);
    }
    `)):i.code.add(e`vec4 getColor(){
return applyOpacity(vec4(1, 1, 1, 1));
}`),a.include(C),a.attributes.add(v.PROFILERIGHT,"vec4"),a.attributes.add(v.PROFILEUP,"vec4"),a.attributes.add(v.PROFILEVERTEXANDNORMAL,"vec4"),i.code.add(e`vec3 calculateVPos() {
vec2 size = getSize();
vec3 origin = position;
vec3 right = profileRight.xyz;
vec3 up = profileUp.xyz;
vec3 forward = cross(up, right);
vec2 profileVertex = profileVertexAndNormal.xy * size;
vec2 profileNormal = profileVertexAndNormal.zw;
float positionOffsetAlongProfilePlaneNormal = 0.0;
float normalOffsetAlongProfilePlaneNormal = 0.0;`),i.code.add(e`if(!isCapVertex()) {
vec2 rotationRight = vec2(profileRight.w, profileUp.w);
float maxDistance = length(rotationRight);`),i.code.add(e`rotationRight = maxDistance > 0.0 ? normalize(rotationRight) : vec2(0, 0);
float rx = dot(profileVertex, rotationRight);
if (abs(rx) > maxDistance) {
vec2 rotationUp = vec2(-rotationRight.y, rotationRight.x);
float ry = dot(profileVertex, rotationUp);
profileVertex = rotationRight * maxDistance * sign(rx) + rotationUp * ry;
}
}else{
positionOffsetAlongProfilePlaneNormal = profileRight.w * size[0];
normalOffsetAlongProfilePlaneNormal = profileUp.w;
}
vec3 offset = right * profileVertex.x + up * profileVertex.y + forward * positionOffsetAlongProfilePlaneNormal;
return origin + offset;
}`),i.code.add(e`vec3 localNormal() {
vec3 right = profileRight.xyz;
vec3 up = profileUp.xyz;
vec3 forward = cross(up, right);
vec2 profileNormal = profileVertexAndNormal.zw;
vec3 normal = right * profileNormal.x + up * profileNormal.y;
if(isCapVertex()) {
normal += forward * profileUp.w;
}
return normal;
}`)}var J=class extends B{constructor(){super(...arguments),this.size=b(1,1)}};function Y(a){let o=new _,{vertex:t,fragment:i}=o;L(t,a),o.varyings.add("vpos","vec3"),o.include(K,a);let{output:r,spherical:y,pbrMode:O,receiveShadows:Q}=a,P=x(r);switch((P||r===l.ObjectAndLayerIdColor)&&(o.include(d,a),o.include(u,a),o.include(A,a),o.include(R,a),o.include(W,a),o.varyings.add("vnormal","vec3"),o.varyings.add("vcolor","vec4"),t.main.add(e`
      vpos = calculateVPos();
      vnormal = normalize(localNormal());
      forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);

      gl_Position = transformPosition(proj, view, vpos);

      ${P?"forwardLinearDepth();":""}
      forwardObjectAndLayerIdColor();

      vcolor = getColor();`)),r){case l.ColorEmission:case l.Color:o.include(S,a),o.include(k,a),o.include(H,a),o.include(u,a),o.include(z,a),o.fragment.include(c,a),o.include(q,a),N(i,a),G(i),T(i),i.uniforms.add(t.uniforms.get("localOrigin"),new n("ambient",s=>s.ambient),new n("diffuse",s=>s.diffuse),new n("specular",s=>s.specular),new E("opacity",s=>s.opacity)),i.include(X),$(i),i.main.add(e`
        discardBySlice(vpos);
        discardByTerrainDepth();

        shadingParams.viewDirection = normalize(vpos - cameraPosition);
        shadingParams.normalView = vnormal;
        vec3 normal = shadingNormal(shadingParams);
        float ssao = evaluateAmbientOcclusionInverse();

        vec3 posWorld = vpos + localOrigin;
        vec3 normalGround = ${y?"normalize(posWorld);":"vec3(0.0, 0.0, 1.0);"}

        float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
        vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
        float shadow = ${Q?"max(lightingGlobalFactor * (1.0 - additionalAmbientScale), readShadowMap(vpos, linearDepth));":y?"lightingGlobalFactor * (1.0 - additionalAmbientScale);":"0.0;"}
        vec3 albedo = vcolor.rgb * max(ambient, diffuse); // combine the old material parameters into a single one
        float combinedOpacity = vcolor.a * opacity;
        albedo += 0.25 * specular; // don't completely ignore specular for now

        ${w(O===f.Schematic,`float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
           vec4 emission = getEmissions();`)}

        vec3 shadedColor = ${O===f.Schematic?"evaluateSceneLightingPBR(normal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);":"evaluateSceneLighting(normal, albedo, shadow, 1.0 - ssao, additionalLight);"}
        vec4 finalColor = vec4(shadedColor, combinedOpacity);
        outputColorHighlightOID(finalColor, vpos);`);break;case l.Depth:o.include(d,a),t.main.add(e`vpos = calculateVPos();
gl_Position = transformPosition(proj, view, vpos);`),o.fragment.include(c,a),i.main.add(e`discardBySlice(vpos);`);break;case l.Shadow:case l.ShadowHighlight:case l.ShadowExcludeHighlight:case l.ViewshedShadow:o.include(d,a),V(o),o.varyings.add("depth","float"),t.main.add(e`vpos = calculateVPos();
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);`),o.fragment.include(c,a),o.include(I,a),i.main.add(e`discardBySlice(vpos);
outputDepth(depth);`);break;case l.ObjectAndLayerIdColor:o.fragment.include(c,a),i.main.add(e`discardBySlice(vpos);
outputObjectAndLayerIdColor();`);break;case l.Normal:o.include(d,a),o.include(g,a),D(t),o.varyings.add("vnormal","vec3"),t.main.add(e`vpos = calculateVPos();
vnormal = normalize((viewNormal * vec4(localNormal(), 1.0)).xyz);
gl_Position = transformPosition(proj, view, vpos);`),o.fragment.include(c,a),i.main.add(e`discardBySlice(vpos);
vec3 normal = normalize(vnormal);
if (gl_FrontFacing == false) normal = -normal;
fragColor = vec4(vec3(0.5) + 0.5 * normal, 1.0);`);break;case l.Highlight:o.include(d,a),o.include(g,a),o.varyings.add("vnormal","vec3"),t.main.add(e`vpos = calculateVPos();
gl_Position = transformPosition(proj, view, vpos);`),o.fragment.include(c,a),o.include(U,a),i.main.add(e`discardBySlice(vpos);
calculateOcclusionAndOutputHighlight();`)}return o}var Ro=Object.freeze(Object.defineProperty({__proto__:null,build:Y},Symbol.toStringTag,{value:"Module"}));export{J as a,Y as b,Ro as c};
