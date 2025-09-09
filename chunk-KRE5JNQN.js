import{a as R}from"./chunk-WKFWO47P.js";import{b as z,c as U,d as W,f as M}from"./chunk-WPMNZVYJ.js";import{b as v}from"./chunk-7VWXQFPJ.js";import{a as j}from"./chunk-CSFAHB4Y.js";import{a as B}from"./chunk-AMISFAT3.js";import{b as E,c as G}from"./chunk-PTXLSCMJ.js";import{a as h}from"./chunk-6DKBN3BZ.js";import{a as H}from"./chunk-WDRWH4L7.js";import{i as $}from"./chunk-3D4Y6BLC.js";import{c as K}from"./chunk-OTUHXNWB.js";import{a as q,b as J}from"./chunk-NBT2WTKD.js";import{a as g}from"./chunk-JLLOI4DS.js";import{b as w,c as k}from"./chunk-4MZNR6MW.js";import{a as T}from"./chunk-GWSX6PRO.js";import{a as Y}from"./chunk-HUUJBVXR.js";import{a as x}from"./chunk-4LDVFWME.js";import{a as u,d as L,e as N,f as l}from"./chunk-MEGSPQVO.js";import{a as _,b as F}from"./chunk-FSWSNKJD.js";import{a as s,q as O}from"./chunk-3AS27HNO.js";import{a as e,b as p}from"./chunk-47NSYSFY.js";import{a as c}from"./chunk-RWCIDBNQ.js";import{g as d}from"./chunk-ONYJLWAD.js";import{q as S}from"./chunk-DJW5LMRG.js";import{d as P}from"./chunk-ALWV3RJ2.js";import{a as f}from"./chunk-7C6Z24SS.js";import{c as I}from"./chunk-5WKDXHVH.js";import{a as D}from"./chunk-PTZYZULI.js";import{a as V}from"./chunk-NHSDW26F.js";function Z(o,r){switch(r.normalType){case l.Attribute:case l.Compressed:o.include(N,r),o.varyings.add("vNormalWorld","vec3"),o.varyings.add("vNormalView","vec3"),o.vertex.uniforms.add(new F("transformNormalGlobalFromModel",a=>a.transformNormalGlobalFromModel),new O("transformNormalViewFromGlobal",a=>a.transformNormalViewFromGlobal)),o.vertex.code.add(e`void forwardNormal() {
vNormalWorld = transformNormalGlobalFromModel * normalModel();
vNormalView = transformNormalViewFromGlobal * vNormalWorld;
}`);break;case l.ScreenDerivative:o.vertex.code.add(e`void forwardNormal() {}`);break;default:r.normalType;case l.COUNT:}}var Q=class extends z{constructor(){super(...arguments),this.transformNormalViewFromGlobal=f()}},X=class extends U{constructor(){super(...arguments),this.transformNormalGlobalFromModel=f(),this.toMapSpace=D()}};function vo(o){o.vertex.code.add(e`vec4 offsetBackfacingClipPosition(vec4 posClip, vec3 posWorld, vec3 normalWorld, vec3 camPosWorld) {
vec3 camToVert = posWorld - camPosWorld;
bool isBackface = dot(camToVert, normalWorld) > 0.0;
if (isBackface) {
posClip.z += 0.0000003 * posClip.w;
}
return posClip;
}`)}var oo=f();function Lo(o,r){let a=r.hasModelTransformation,t=r.instancedDoublePrecision;a&&(o.vertex.uniforms.add(new j("model",n=>n.modelTransformation??P)),o.vertex.uniforms.add(new O("normalLocalOriginFromModel",n=>(S(oo,n.modelTransformation??P),oo)))),r.instanced&&t&&(o.attributes.add(c.INSTANCEMODELORIGINHI,"vec3"),o.attributes.add(c.INSTANCEMODELORIGINLO,"vec3"),o.attributes.add(c.INSTANCEMODEL,"mat3"),o.attributes.add(c.INSTANCEMODELNORMAL,"mat3"));let i=o.vertex;t&&(i.include(_,r),i.uniforms.add(new T("viewOriginHi",n=>E(I(A,n.camera.viewInverseTransposeMatrix[3],n.camera.viewInverseTransposeMatrix[7],n.camera.viewInverseTransposeMatrix[11]),A)),new T("viewOriginLo",n=>G(I(A,n.camera.viewInverseTransposeMatrix[3],n.camera.viewInverseTransposeMatrix[7],n.camera.viewInverseTransposeMatrix[11]),A)))),i.code.add(e`
    vec3 getVertexInLocalOriginSpace() {
      return ${a?t?"(model * vec4(instanceModel * localPosition().xyz, 1.0)).xyz":"(model * localPosition()).xyz":t?"instanceModel * localPosition().xyz":"localPosition().xyz"};
    }

    vec3 subtractOrigin(vec3 _pos) {
      ${t?e`
          // Negated inputs are intentionally the first two arguments. The other way around the obfuscation in dpAdd() stopped
          // working for macOS 14+ and iOS 17+.
          // Issue: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/56280
          vec3 originDelta = dpAdd(-instanceModelOriginHi, -instanceModelOriginLo, viewOriginHi, viewOriginLo);
          return _pos - originDelta;`:"return vpos;"}
    }
    `),i.code.add(e`
    vec3 dpNormal(vec4 _normal) {
      return normalize(${a?t?"normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz)":"normalLocalOriginFromModel * _normal.xyz":t?"instanceModelNormal * _normal.xyz":"_normal.xyz"});
    }
    `),r.output===s.Normal&&(k(i),i.code.add(e`
    vec3 dpNormalView(vec4 _normal) {
      return normalize((viewNormal * ${a?t?"vec4(normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz), 1.0)":"vec4(normalLocalOriginFromModel * _normal.xyz, 1.0)":t?"vec4(instanceModelNormal * _normal.xyz, 1.0)":"_normal"}).xyz);
    }
    `)),r.hasVertexTangents&&i.code.add(e`
    vec4 dpTransformVertexTangent(vec4 _tangent) {
      ${a?t?"return vec4(normalLocalOriginFromModel * (instanceModelNormal * _tangent.xyz), _tangent.w);":"return vec4(normalLocalOriginFromModel * _tangent.xyz, _tangent.w);":t?"return vec4(instanceModelNormal * _tangent.xyz, _tangent.w);":"return _tangent;"}
    }`)}var A=V();function Wo(o,r){r.hasSymbolColors?(o.include(L),o.attributes.add(c.SYMBOLCOLOR,"vec4"),o.varyings.add("colorMixMode","mediump float"),o.vertex.code.add(e`int symbolColorMixMode;
vec4 getSymbolColor() {
return decodeSymbolColor(symbolColor, symbolColorMixMode) * 0.003921568627451;
}
void forwardColorMixMode() {
colorMixMode = float(symbolColorMixMode) + 0.5;
}`)):(o.fragment.uniforms.add(new B("colorMixMode",a=>$[a.colorMixMode])),o.vertex.code.add(e`vec4 getSymbolColor() { return vec4(1.0); }
void forwardColorMixMode() {}`))}function C(o,r){eo(o,r,new Y("textureAlphaCutoff",a=>a.textureAlphaCutoff))}function eo(o,r,a){let t=o.fragment,i=r.alphaDiscardMode,n=i===d.Blend;i!==d.Mask&&i!==d.MaskBlend||t.uniforms.add(a),t.code.add(e`
    void discardOrAdjustAlpha(inout vec4 color) {
      ${i===d.Opaque?"color.a = 1.0;":`if (color.a < ${n?e.float(J):"textureAlphaCutoff"}) {
              discard;
             } ${p(i===d.Mask,"else { color.a = 1.0; }")}`}
    }
  `)}function xr(o,r){let{vertex:a,fragment:t}=o,i=r.hasColorTexture&&r.alphaDiscardMode!==d.Opaque,{output:n,normalType:b,hasColorTextureTransform:y}=r;switch(n){case s.Depth:w(a,r),o.include(M,r),o.fragment.include(g,r),o.include(v,r),i&&t.uniforms.add(new x("tex",m=>m.texture)),a.main.add(e`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();`),o.include(C,r),t.main.add(e`
        discardBySlice(vpos);
        ${p(i,e`vec4 texColor = texture(tex, ${y?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}`);break;case s.Shadow:case s.ShadowHighlight:case s.ShadowExcludeHighlight:case s.ViewshedShadow:case s.ObjectAndLayerIdColor:w(a,r),o.include(M,r),o.include(v,r),o.include(h,r),o.include(R,r),o.fragment.include(g,r),o.include(H,r),W(o),o.varyings.add("depth","float"),i&&t.uniforms.add(new x("tex",m=>m.texture)),a.main.add(e`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);
forwardTextureCoordinates();
forwardObjectAndLayerIdColor();`),o.include(C,r),t.main.add(e`
        discardBySlice(vpos);
        ${p(i,e`vec4 texColor = texture(tex, ${y?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}
        ${n===s.ObjectAndLayerIdColor?e`outputObjectAndLayerIdColor();`:e`outputDepth(depth);`}`);break;case s.Normal:{w(a,r),o.include(M,r),o.include(N,r),o.include(Z,r),o.include(v,r),o.include(h,r),i&&t.uniforms.add(new x("tex",ro=>ro.texture)),b===l.ScreenDerivative&&o.varyings.add("vPositionView","vec3");let m=b===l.Attribute||b===l.Compressed;a.main.add(e`
        vpos = getVertexInLocalOriginSpace();
        ${m?e`vNormalWorld = dpNormalView(vvLocalNormal(normalModel()));`:e`vPositionView = (view * vec4(vpos, 1.0)).xyz;`}
        vpos = subtractOrigin(vpos);
        vpos = addVerticalOffset(vpos, localOrigin);
        gl_Position = transformPosition(proj, view, vpos);
        forwardTextureCoordinates();`),o.fragment.include(g,r),o.include(C,r),t.main.add(e`
        discardBySlice(vpos);
        ${p(i,e`vec4 texColor = texture(tex, ${y?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}

        ${b===l.ScreenDerivative?e`vec3 normal = screenDerivativeNormal(vPositionView);`:e`vec3 normal = normalize(vNormalWorld);
                    if (gl_FrontFacing == false){
                      normal = -normal;
                    }`}
        fragColor = vec4(0.5 + 0.5 * normal, 1.0);`);break}case s.Highlight:w(a,r),o.include(M,r),o.include(v,r),o.include(h,r),i&&t.uniforms.add(new x("tex",m=>m.texture)),a.main.add(e`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();`),o.fragment.include(g,r),o.include(C,r),o.include(q,r),t.main.add(e`
        discardBySlice(vpos);
        ${p(i,e`vec4 texColor = texture(tex, ${y?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}
        calculateOcclusionAndOutputHighlight();`)}}function br(o){o.include(K),o.code.add(e`
    vec3 mixExternalColor(vec3 internalColor, vec3 textureColor, vec3 externalColor, int mode) {
      // workaround for artifacts in macOS using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      vec3 internalMixed = internalColor * textureColor;
      vec3 allMixed = internalMixed * externalColor;

      if (mode == ${e.int(u.Multiply)}) {
        return allMixed;
      }
      if (mode == ${e.int(u.Ignore)}) {
        return internalMixed;
      }
      if (mode == ${e.int(u.Replace)}) {
        return externalColor;
      }

      // tint (or something invalid)
      float vIn = rgb2v(internalMixed);
      vec3 hsvTint = rgb2hsv(externalColor);
      vec3 hsvOut = vec3(hsvTint.x, hsvTint.y, vIn * hsvTint.z);
      return hsv2rgb(hsvOut);
    }

    float mixExternalOpacity(float internalOpacity, float textureOpacity, float externalOpacity, int mode) {
      // workaround for artifacts in macOS using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      float internalMixed = internalOpacity * textureOpacity;
      float allMixed = internalMixed * externalOpacity;

      if (mode == ${e.int(u.Ignore)}) {
        return internalMixed;
      }
      if (mode == ${e.int(u.Replace)}) {
        return externalOpacity;
      }

      // multiply or tint (or something invalid)
      return allMixed;
    }
  `)}export{Z as a,Q as b,X as c,vo as d,Lo as e,Wo as f,C as g,xr as h,br as i};
