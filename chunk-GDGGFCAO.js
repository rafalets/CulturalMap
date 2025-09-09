import{f}from"./chunk-WPMNZVYJ.js";import{h as b}from"./chunk-7VWXQFPJ.js";import{b as h,c as P}from"./chunk-OTUHXNWB.js";import{a as m}from"./chunk-JLLOI4DS.js";import{a as p,b as u,c as w}from"./chunk-4MZNR6MW.js";import{a as l}from"./chunk-GVSOJUIP.js";import{a as v}from"./chunk-B2RVSTL3.js";import{a as S}from"./chunk-HUUJBVXR.js";import{a as g}from"./chunk-DHLVTH5U.js";import{a as c}from"./chunk-T7PUQGWM.js";import{a}from"./chunk-47NSYSFY.js";import{a as s}from"./chunk-RWCIDBNQ.js";import{a as d}from"./chunk-PTZYZULI.js";function z(i,o){if(!o.screenSizeEnabled)return;let e=i.vertex;p(e,o),e.uniforms.add(new v("perScreenPixelRatio",r=>r.camera.perScreenPixelRatio),new S("screenSizeScale",r=>r.screenSizeScale)).code.add(a`float computeRenderPixelSizeAt( vec3 pWorld ){
vec3 viewForward = - vec3(view[0][2], view[1][2], view[2][2]);
float viewDirectionDistance = abs(dot(viewForward, pWorld - cameraPosition));
return viewDirectionDistance * perScreenPixelRatio;
}
vec3 screenSizeScaling(vec3 position, vec3 anchor){
return position * screenSizeScale * computeRenderPixelSizeAt(anchor) + anchor;
}`)}function x(i){let o=new g;o.include(f,i),o.include(z,i),o.fragment.include(m,i),o.include(b,i),o.include(h,i);let{vertex:e,fragment:r}=o;return r.include(P),u(e,i),r.uniforms.add(new l("uColor",t=>t.color)),o.attributes.add(s.POSITION,"vec3"),o.varyings.add("vWorldPosition","vec3"),i.screenSizeEnabled&&o.attributes.add(s.OFFSET,"vec3"),i.shadingEnabled&&(w(e),o.attributes.add(s.NORMAL,"vec3"),o.varyings.add("vViewNormal","vec3"),r.uniforms.add(new c("shadingDirection",t=>t.shadingDirection)),r.uniforms.add(new l("shadedColor",t=>C(t.shadingTint,t.color)))),e.main.add(a`
      vWorldPosition = ${i.screenSizeEnabled?a`screenSizeScaling(offset, position)`:a`position`};
      ${i.shadingEnabled?a`vec3 worldNormal = normal;
                 vViewNormal = (viewNormal * vec4(worldNormal, 1)).xyz;`:""}
      forwardViewPosDepth((view * vec4(vWorldPosition, 1.0)).xyz);
      gl_Position = transformPosition(proj, view, vWorldPosition);
  `),r.main.add(a`
      discardBySlice(vWorldPosition);
      discardByTerrainDepth();
      ${i.shadingEnabled?a`vec3 viewNormalNorm = normalize(vViewNormal);
             float shadingFactor = 1.0 - clamp(-dot(viewNormalNorm, shadingDirection), 0.0, 1.0);
             vec4 finalColor = mix(uColor, shadedColor, shadingFactor);`:a`vec4 finalColor = uColor;`}
      outputColorHighlightOID(finalColor, vWorldPosition);`),o}function C(i,o){let e=1-i[3],r=i[3]+o[3]*e;return r===0?(n[3]=r,n):(n[0]=(i[0]*i[3]+o[0]*o[3]*e)/r,n[1]=(i[1]*i[3]+o[1]*o[3]*e)/r,n[2]=(i[2]*i[3]+o[2]*o[3]*e)/r,n[3]=o[3],n)}var n=d(),L=Object.freeze(Object.defineProperty({__proto__:null,build:x},Symbol.toStringTag,{value:"Module"}));export{x as a,L as b};
