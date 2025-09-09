import{a as U}from"./chunk-DJ5ZP6NM.js";import{a as g}from"./chunk-GVSOJUIP.js";import{a as j}from"./chunk-GWSX6PRO.js";import{g as T}from"./chunk-PSIELDY2.js";import{a as P}from"./chunk-WOZSH7YY.js";import{a as R}from"./chunk-B2RVSTL3.js";import{a as F}from"./chunk-4XEE5PE3.js";import{a as u}from"./chunk-HUUJBVXR.js";import{a as G}from"./chunk-DHLVTH5U.js";import{a as f}from"./chunk-T7PUQGWM.js";import{a as o}from"./chunk-47NSYSFY.js";import{g as I}from"./chunk-3BZAI7HK.js";import{m as y,q as E}from"./chunk-SKMO433W.js";import{a as O}from"./chunk-2FO7ARYZ.js";import{b as z}from"./chunk-QXXXCEV5.js";import{a as b,b as x,d as A,e as L,o as S,t as h,v as V,x as d}from"./chunk-5WKDXHVH.js";import{a as M}from"./chunk-PTZYZULI.js";import{k as v}from"./chunk-KZKWOEFD.js";import{a as m}from"./chunk-NHSDW26F.js";import{f as w}from"./chunk-VOFKUGRY.js";var B=w(6);function N(e){let r=new G;r.include(F),r.include(U,e);let t=r.fragment;if(e.lineVerticalPlaneEnabled||e.heightManifoldEnabled)if(t.uniforms.add(new u("maxPixelDistance",(i,n)=>e.heightManifoldEnabled?2*n.camera.computeScreenPixelSizeAt(i.heightManifoldTarget):2*n.camera.computeScreenPixelSizeAt(i.lineVerticalPlaneSegment.origin))),t.code.add(o`float planeDistancePixels(vec4 plane, vec3 pos) {
float dist = dot(plane.xyz, pos) + plane.w;
float width = fwidth(dist);
dist /= min(width, maxPixelDistance);
return abs(dist);
}`),e.spherical){let i=(a,c,_)=>d(a,c.heightManifoldTarget,_.camera.viewMatrix),n=(a,c)=>d(a,[0,0,0],c.camera.viewMatrix);t.uniforms.add(new g("heightManifoldOrigin",(a,c)=>(i(s,a,c),n(p,c),L(p,p,s),h(l,p),l[3]=b(p),l)),new j("globalOrigin",a=>n(s,a)),new u("cosSphericalAngleThreshold",(a,c)=>1-Math.max(2,S(c.camera.eye,a.heightManifoldTarget)*c.camera.perRenderPixelRatio)/b(a.heightManifoldTarget))),t.code.add(o`float globeDistancePixels(float posInGlobalOriginLength) {
float dist = abs(posInGlobalOriginLength - heightManifoldOrigin.w);
float width = fwidth(dist);
dist /= min(width, maxPixelDistance);
return abs(dist);
}
float heightManifoldDistancePixels(vec4 heightPlane, vec3 pos) {
vec3 posInGlobalOriginNorm = normalize(globalOrigin - pos);
float cosAngle = dot(posInGlobalOriginNorm, heightManifoldOrigin.xyz);
vec3 posInGlobalOrigin = globalOrigin - pos;
float posInGlobalOriginLength = length(posInGlobalOrigin);
float sphericalDistance = globeDistancePixels(posInGlobalOriginLength);
float planarDistance = planeDistancePixels(heightPlane, pos);
return cosAngle < cosSphericalAngleThreshold ? sphericalDistance : planarDistance;
}`)}else t.code.add(o`float heightManifoldDistancePixels(vec4 heightPlane, vec3 pos) {
return planeDistancePixels(heightPlane, pos);
}`);if(e.pointDistanceEnabled&&(t.uniforms.add(new u("maxPixelDistance",(i,n)=>2*n.camera.computeScreenPixelSizeAt(i.pointDistanceTarget))),t.code.add(o`float sphereDistancePixels(vec4 sphere, vec3 pos) {
float dist = distance(sphere.xyz, pos) - sphere.w;
float width = fwidth(dist);
dist /= min(width, maxPixelDistance);
return abs(dist);
}`)),e.intersectsLineEnabled&&t.uniforms.add(new R("perScreenPixelRatio",i=>i.camera.perScreenPixelRatio)).code.add(o`float lineDistancePixels(vec3 start, vec3 dir, float radius, vec3 pos) {
float dist = length(cross(dir, pos - start)) / (length(pos) * perScreenPixelRatio);
return abs(dist) - radius;
}`),(e.lineVerticalPlaneEnabled||e.intersectsLineEnabled)&&t.code.add(o`bool pointIsWithinLine(vec3 pos, vec3 start, vec3 end) {
vec3 dir = end - start;
float t2 = dot(dir, pos - start);
float l2 = dot(dir, dir);
return t2 >= 0.0 && t2 <= l2;
}`),t.main.add(o`vec3 pos;
vec3 normal;
float angleCutoffAdjust;
float depthDiscontinuityAlpha;
if (!laserlineReconstructFromDepth(pos, normal, angleCutoffAdjust, depthDiscontinuityAlpha)) {
fragColor = vec4(0.0);
return;
}
vec4 color = vec4(0.0);`),e.heightManifoldEnabled){t.uniforms.add(new P("angleCutoff",n=>D(n)),new g("heightPlane",(n,a)=>H(n.heightManifoldTarget,n.renderCoordsHelper.worldUpAtPosition(n.heightManifoldTarget,s),a.camera.viewMatrix)));let i=e.spherical?o`normalize(globalOrigin - pos)`:o`heightPlane.xyz`;t.main.add(o`
      vec2 angleCutoffAdjusted = angleCutoff - angleCutoffAdjust;
      // Fade out laserlines on flat surfaces
      float heightManifoldAlpha = 1.0 - smoothstep(angleCutoffAdjusted.x, angleCutoffAdjusted.y, abs(dot(normal, ${i})));
      vec4 heightManifoldColor = laserlineProfile(heightManifoldDistancePixels(heightPlane, pos));
      color = max(color, heightManifoldColor * heightManifoldAlpha);`)}return e.pointDistanceEnabled&&(t.uniforms.add(new P("angleCutoff",i=>D(i)),new g("pointDistanceSphere",(i,n)=>$(i,n))),t.main.add(o`float pointDistanceSphereDistance = sphereDistancePixels(pointDistanceSphere, pos);
vec4 pointDistanceSphereColor = laserlineProfile(pointDistanceSphereDistance);
float pointDistanceSphereAlpha = 1.0 - smoothstep(angleCutoff.x, angleCutoff.y, abs(dot(normal, normalize(pos - pointDistanceSphere.xyz))));
color = max(color, pointDistanceSphereColor * pointDistanceSphereAlpha);`)),e.lineVerticalPlaneEnabled&&(t.uniforms.add(new P("angleCutoff",i=>D(i)),new g("lineVerticalPlane",(i,n)=>k(i,n)),new f("lineVerticalStart",(i,n)=>q(i,n)),new f("lineVerticalEnd",(i,n)=>J(i,n))),t.main.add(o`if (pointIsWithinLine(pos, lineVerticalStart, lineVerticalEnd)) {
float lineVerticalDistance = planeDistancePixels(lineVerticalPlane, pos);
vec4 lineVerticalColor = laserlineProfile(lineVerticalDistance);
float lineVerticalAlpha = 1.0 - smoothstep(angleCutoff.x, angleCutoff.y, abs(dot(normal, lineVerticalPlane.xyz)));
color = max(color, lineVerticalColor * lineVerticalAlpha);
}`)),e.intersectsLineEnabled&&(t.uniforms.add(new P("angleCutoff",i=>D(i)),new f("intersectsLineStart",(i,n)=>d(s,i.lineStartWorld,n.camera.viewMatrix)),new f("intersectsLineEnd",(i,n)=>d(s,i.lineEndWorld,n.camera.viewMatrix)),new f("intersectsLineDirection",(i,n)=>(x(l,i.intersectsLineSegment.vector),l[3]=0,h(s,v(l,l,n.camera.viewMatrix)))),new u("intersectsLineRadius",i=>i.intersectsLineRadius)),t.main.add(o`if (pointIsWithinLine(pos, intersectsLineStart, intersectsLineEnd)) {
float intersectsLineDistance = lineDistancePixels(intersectsLineStart, intersectsLineDirection, intersectsLineRadius, pos);
vec4 intersectsLineColor = laserlineProfile(intersectsLineDistance);
float intersectsLineAlpha = 1.0 - smoothstep(angleCutoff.x, angleCutoff.y, 1.0 - abs(dot(normal, intersectsLineDirection)));
color = max(color, intersectsLineColor * intersectsLineAlpha);
}`)),t.main.add(o`fragColor = laserlineOutput(color * depthDiscontinuityAlpha);`),r}function D(e){return z(K,Math.cos(e.angleCutoff),Math.cos(Math.max(0,e.angleCutoff-w(2))))}function $(e,r){return d(C,e.pointDistanceOrigin,r.camera.viewMatrix),C[3]=S(e.pointDistanceOrigin,e.pointDistanceTarget),C}function k(e,r){let t=T(e.lineVerticalPlaneSegment,.5,s),i=e.renderCoordsHelper.worldUpAtPosition(t,Q),n=h(p,e.lineVerticalPlaneSegment.vector),a=V(s,i,n);return h(a,a),H(e.lineVerticalPlaneSegment.origin,a,r.camera.viewMatrix)}function q(e,r){let t=x(s,e.lineVerticalPlaneSegment.origin);return e.renderCoordsHelper.setAltitude(t,0),d(t,t,r.camera.viewMatrix)}function J(e,r){let t=A(s,e.lineVerticalPlaneSegment.origin,e.lineVerticalPlaneSegment.vector);return e.renderCoordsHelper.setAltitude(t,0),d(t,t,r.camera.viewMatrix)}function H(e,r,t){return d(W,e,t),x(l,r),l[3]=0,v(l,l,t),E(W,l,X)}var K=O(),s=m(),l=M(),Q=m(),p=m(),W=m(),X=y(),C=I(),De=Object.freeze(Object.defineProperty({__proto__:null,build:N,defaultAngleCutoff:B},Symbol.toStringTag,{value:"Module"}));export{B as a,N as b,De as c};
