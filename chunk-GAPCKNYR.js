import{a as L,b as R}from"./chunk-2IWALBQY.js";import{a as B,d as z,e as H,f as k,g as Z,h as J,i as uo}from"./chunk-KRE5JNQN.js";import{b as ro,c as io,d as no,e as so}from"./chunk-WKFWO47P.js";import{c as lo,d as mo}from"./chunk-BHGFQO2D.js";import{e as g,f as $,h as ao,j as to}from"./chunk-VOJIMLDZ.js";import{a as Q}from"./chunk-CUV3BSEW.js";import{a as I,e as _,f as W}from"./chunk-WPMNZVYJ.js";import{a as m,b as E,c as F,h as vo}from"./chunk-7VWXQFPJ.js";import{d as q}from"./chunk-XXQKBDTN.js";import{a as K}from"./chunk-6DKBN3BZ.js";import{b as co}from"./chunk-OTUHXNWB.js";import{b as X}from"./chunk-NBT2WTKD.js";import{a as G}from"./chunk-JLLOI4DS.js";import{a as h,b as j}from"./chunk-4MZNR6MW.js";import{a as Y}from"./chunk-GVSOJUIP.js";import{a as oo}from"./chunk-WOZSH7YY.js";import{a as w}from"./chunk-HUUJBVXR.js";import{a as u}from"./chunk-4LDVFWME.js";import{a as eo}from"./chunk-DHLVTH5U.js";import{e as A,f as c}from"./chunk-MEGSPQVO.js";import{h as S,q as l}from"./chunk-3AS27HNO.js";import{a as T}from"./chunk-T7PUQGWM.js";import{a as D}from"./chunk-MVDZB4AK.js";import{a as r,b as n}from"./chunk-47NSYSFY.js";import{a as O}from"./chunk-QXNVQZT7.js";import{a as d}from"./chunk-RWCIDBNQ.js";import{f as P}from"./chunk-2FO7ARYZ.js";import{c as s}from"./chunk-7C6Z24SS.js";function xo(o,e){let a=o.fragment;e.hasVertexTangents?(o.attributes.add(d.TANGENT,"vec4"),o.varyings.add("vTangent","vec4"),e.doubleSidedMode===R.WindingOrder?a.code.add(r`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = gl_FrontFacing ? vTangent.w : -vTangent.w;
vec3 tangent = normalize(gl_FrontFacing ? vTangent.xyz : -vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`):a.code.add(r`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = vTangent.w;
vec3 tangent = normalize(vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`)):a.code.add(r`mat3 computeTangentSpace(vec3 normal, vec3 pos, vec2 st) {
vec3 Q1 = dFdx(pos);
vec3 Q2 = dFdy(pos);
vec2 stx = dFdx(st);
vec2 sty = dFdy(st);
float det = stx.t * sty.s - sty.t * stx.s;
vec3 T = stx.t * Q2 - sty.t * Q1;
T = T - normal * dot(normal, T);
T *= inversesqrt(max(dot(T,T), 1.e-10));
vec3 B = sign(det) * cross(normal, T);
return mat3(T, B, normal);
}`),e.textureCoordinateType!==m.None&&(o.include(F,e),a.uniforms.add(e.bindType===O.Pass?new u("normalTexture",t=>t.textureNormal):new D("normalTexture",t=>t.textureNormal)),e.hasNormalTextureTransform&&(a.uniforms.add(new oo("scale",t=>t.scale??P)),a.uniforms.add(new l("normalTextureTransformMatrix",t=>t.normalTextureTransformMatrix??s))),a.code.add(r`vec3 computeTextureNormal(mat3 tangentSpace, vec2 uv) {
vec3 rawNormal = textureLookup(normalTexture, uv).rgb * 2.0 - 1.0;`),e.hasNormalTextureTransform&&a.code.add(r`mat3 normalTextureRotation = mat3(normalTextureTransformMatrix[0][0]/scale[0], normalTextureTransformMatrix[0][1]/scale[1], 0.0,
normalTextureTransformMatrix[1][0]/scale[0], normalTextureTransformMatrix[1][1]/scale[1], 0.0,
0.0, 0.0, 0.0 );
rawNormal.xy = (normalTextureRotation * vec3(rawNormal.x, rawNormal.y, 1.0)).xy;`),a.code.add(r`return tangentSpace * rawNormal;
}`))}function fo(o,e){e.hasColorTextureTransform?(o.varyings.add("colorUV","vec2"),o.vertex.uniforms.add(new l("colorTextureTransformMatrix",a=>a.colorTextureTransformMatrix??s)).code.add(r`void forwardColorUV(){
colorUV = (colorTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):o.vertex.code.add(r`void forwardColorUV(){}`)}function po(o,e){e.hasNormalTextureTransform&&e.textureCoordinateType!==m.None?(o.varyings.add("normalUV","vec2"),o.vertex.uniforms.add(new l("normalTextureTransformMatrix",a=>a.normalTextureTransformMatrix??s)).code.add(r`void forwardNormalUV(){
normalUV = (normalTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):o.vertex.code.add(r`void forwardNormalUV(){}`)}function To(o,e){e.hasEmissionTextureTransform&&e.textureCoordinateType!==m.None?(o.varyings.add("emissiveUV","vec2"),o.vertex.uniforms.add(new l("emissiveTextureTransformMatrix",a=>a.emissiveTextureTransformMatrix??s)).code.add(r`void forwardEmissiveUV(){
emissiveUV = (emissiveTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):o.vertex.code.add(r`void forwardEmissiveUV(){}`)}function go(o,e){e.hasOcclusionTextureTransform&&e.textureCoordinateType!==m.None?(o.varyings.add("occlusionUV","vec2"),o.vertex.uniforms.add(new l("occlusionTextureTransformMatrix",a=>a.occlusionTextureTransformMatrix??s)).code.add(r`void forwardOcclusionUV(){
occlusionUV = (occlusionTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):o.vertex.code.add(r`void forwardOcclusionUV(){}`)}function ho(o,e){e.hasMetallicRoughnessTextureTransform&&e.textureCoordinateType!==m.None?(o.varyings.add("metallicRoughnessUV","vec2"),o.vertex.uniforms.add(new l("metallicRoughnessTextureTransformMatrix",a=>a.metallicRoughnessTextureTransformMatrix??s)).code.add(r`void forwardMetallicRoughnessUV(){
metallicRoughnessUV = (metallicRoughnessTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):o.vertex.code.add(r`void forwardMetallicRoughnessUV(){}`)}function Mo(o){let e=new eo,{vertex:a,fragment:t,varyings:v}=e,{output:wo,normalType:x,offsetBackfaces:y,instancedColor:C,spherical:b,receiveShadows:yo,snowCover:f,pbrMode:V,textureAlphaPremultiplied:Co,instancedDoublePrecision:bo,hasVertexColors:N,hasVertexTangents:U,hasColorTexture:M,hasNormalTexture:Vo,hasNormalTextureTransform:No,hasColorTextureTransform:Uo}=o;if(j(a,o),e.include(I),v.add("vpos","vec3"),e.include(K,o),e.include(H,o),e.include(q,o),e.include(fo,o),!S(wo))return e.include(J,o),e;e.include(po,o),e.include(To,o),e.include(go,o),e.include(ho,o),h(a,o),e.include(A,o),e.include(W,o);let p=x===c.Attribute||x===c.Compressed;return p&&y&&e.include(z),e.include(xo,o),e.include(B,o),C&&e.attributes.add(d.INSTANCECOLOR,"vec4"),v.add("vPositionLocal","vec3"),e.include(E,o),e.include(_,o),e.include(k,o),e.include(Q,o),a.uniforms.add(new Y("externalColor",i=>i.externalColor)),v.add("vcolorExt","vec4"),e.include(co,o),a.main.add(r`
    forwardNormalizedVertexColor();
    vcolorExt = externalColor;
    ${n(C,"vcolorExt *= instanceColor * 0.003921568627451;")}
    vcolorExt *= vvColor();
    vcolorExt *= getSymbolColor();
    forwardColorMixMode();

    vpos = getVertexInLocalOriginSpace();
    vPositionLocal = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    ${n(p,"vNormalWorld = dpNormal(vvLocalNormal(normalModel()));")}
    vpos = addVerticalOffset(vpos, localOrigin);
    ${n(U,"vTangent = dpTransformVertexTangent(tangent);")}
    gl_Position = transformPosition(proj, view, vpos);
    ${n(p&&y,"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);")}

    forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
    forwardLinearDepth();
    forwardTextureCoordinates();
    forwardColorUV();
    forwardNormalUV();
    forwardEmissiveUV();
    forwardOcclusionUV();
    forwardMetallicRoughnessUV();

    if (vcolorExt.a < ${r.float(X)}) {
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
    }
  `),e.include(so,o),e.include(ro,o),e.include(Z,o),e.include(bo?lo:mo,o),e.fragment.include(G,o),e.include(vo,o),h(t,o),t.uniforms.add(a.uniforms.get("localOrigin"),new T("ambient",i=>i.ambient),new T("diffuse",i=>i.diffuse),new w("opacity",i=>i.opacity),new w("layerOpacity",i=>i.layerOpacity)),M&&t.uniforms.add(new u("tex",i=>i.texture)),e.include($,o),e.include(to,o),t.include(uo),e.include(L,o),io(t),no(t),ao(t),t.main.add(r`
    discardBySlice(vpos);
    discardByTerrainDepth();
    ${M?r`
            vec4 texColor = texture(tex, ${Uo?"colorUV":"vuv0"});
            ${n(Co,"texColor.rgb /= texColor.a;")}
            discardOrAdjustAlpha(texColor);`:r`vec4 texColor = vec4(1.0);`}
    shadingParams.viewDirection = normalize(vpos - cameraPosition);
    ${x===c.ScreenDerivative?r`vec3 normal = screenDerivativeNormal(vPositionLocal);`:r`shadingParams.normalView = vNormalWorld;
                vec3 normal = shadingNormal(shadingParams);`}
    applyPBRFactors();
    float ssao = evaluateAmbientOcclusionInverse() * getBakedOcclusion();

    vec3 posWorld = vpos + localOrigin;

      float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
      float shadow = ${yo?"max(lightingGlobalFactor * (1.0 - additionalAmbientScale), readShadowMap(vpos, linearDepth))":n(b,"lightingGlobalFactor * (1.0 - additionalAmbientScale)","0.0")};

    vec3 matColor = max(ambient, diffuse);
    vec3 albedo = mixExternalColor(${n(N,"vColor.rgb *")} matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
    float opacity_ = layerOpacity * mixExternalOpacity(${n(N,"vColor.a * ")} opacity, texColor.a, vcolorExt.a, int(colorMixMode));
    ${Vo?`mat3 tangentSpace = computeTangentSpace(${U?"normal":"normal, vpos, vuv0"});
            vec3 shadingNormal = computeTextureNormal(tangentSpace, ${No?"normalUV":"vuv0"});`:"vec3 shadingNormal = normal;"}
    vec3 normalGround = ${b?"normalize(posWorld);":"vec3(0.0, 0.0, 1.0);"}

    ${n(f,r`
          float snow = smoothstep(0.5, 0.55, dot(normal, normalGround));
          albedo = mix(albedo, vec3(1), snow);
          shadingNormal = mix(shadingNormal, normal, snow);
          ssao = mix(ssao, 1.0, snow);`)}

    vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;

    ${V===g.Normal||V===g.Schematic?r`
            float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
            ${n(f,r`mrr = mix(mrr, vec3(0.0, 1.0, 0.04), snow);`)}
            vec4 emission = ${f?"mix(getEmissions(), vec4(0.0), snow)":"getEmissions()"};
            vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:r`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
    vec4 finalColor = vec4(shadedColor, opacity_);
    outputColorHighlightOID(finalColor, vpos);
  `),e}var Se=Object.freeze(Object.defineProperty({__proto__:null,build:Mo},Symbol.toStringTag,{value:"Module"}));export{Mo as a,Se as b};
