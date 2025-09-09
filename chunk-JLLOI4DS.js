import{a as l}from"./chunk-GV3ZFCVD.js";import{a as m}from"./chunk-47NSYSFY.js";import{a as w}from"./chunk-ALWV3RJ2.js";import{c as b,d as B,e as p,x as t}from"./chunk-5WKDXHVH.js";import{h as v}from"./chunk-7B2UKJ5N.js";import{a as r,h as P}from"./chunk-NHSDW26F.js";function Z(a,s){x(a,s,new l("slicePlaneOrigin",(e,i)=>h(s,e,i)),new l("slicePlaneBasis1",(e,i)=>f(s,e,i,i.slicePlane?.basis1)),new l("slicePlaneBasis2",(e,i)=>f(s,e,i,i.slicePlane?.basis2)))}function k(a,s){S(a,s,new l("slicePlaneOrigin",(e,i)=>h(s,e,i)),new l("slicePlaneBasis1",(e,i)=>f(s,e,i,i.slicePlane?.basis1)),new l("slicePlaneBasis2",(e,i)=>f(s,e,i,i.slicePlane?.basis2)))}var O=m`struct SliceFactors {
float front;
float side0;
float side1;
float side2;
float side3;
};
SliceFactors calculateSliceFactors(vec3 pos) {
vec3 rel = pos - slicePlaneOrigin;
vec3 slicePlaneNormal = -cross(slicePlaneBasis1, slicePlaneBasis2);
float slicePlaneW = -dot(slicePlaneNormal, slicePlaneOrigin);
float basis1Len2 = dot(slicePlaneBasis1, slicePlaneBasis1);
float basis2Len2 = dot(slicePlaneBasis2, slicePlaneBasis2);
float basis1Dot = dot(slicePlaneBasis1, rel);
float basis2Dot = dot(slicePlaneBasis2, rel);
return SliceFactors(
dot(slicePlaneNormal, pos) + slicePlaneW,
-basis1Dot - basis1Len2,
basis1Dot - basis1Len2,
-basis2Dot - basis2Len2,
basis2Dot - basis2Len2
);
}
bool sliceByFactors(SliceFactors factors) {
return factors.front < 0.0
&& factors.side0 < 0.0
&& factors.side1 < 0.0
&& factors.side2 < 0.0
&& factors.side3 < 0.0;
}
bool sliceEnabled() {
return dot(slicePlaneBasis1, slicePlaneBasis1) != 0.0;
}
bool sliceByPlane(vec3 pos) {
return sliceEnabled() && sliceByFactors(calculateSliceFactors(pos));
}
bool rejectBySlice(vec3 pos) {
return sliceByPlane(pos);
}`;function S(a,s,...e){s.hasSlicePlane?(a.uniforms.add(...e),a.code.add(O)):a.code.add("bool rejectBySlice(vec3 pos) { return false; }")}function x(a,s,...e){S(a,s,...e),s.hasSlicePlane?a.code.add(`
    void discardBySlice(vec3 pos) {
      if (sliceByPlane(pos)) {
        discard;
      }
    }

    vec4 applySliceOutline(vec4 color, vec3 pos) {
      SliceFactors factors = calculateSliceFactors(pos);

      factors.front /= 2.0 * fwidth(factors.front);
      factors.side0 /= 2.0 * fwidth(factors.side0);
      factors.side1 /= 2.0 * fwidth(factors.side1);
      factors.side2 /= 2.0 * fwidth(factors.side2);
      factors.side3 /= 2.0 * fwidth(factors.side3);

      // return after calling fwidth, to avoid aliasing caused by discontinuities in the input to fwidth
      if (sliceByFactors(factors)) {
        return color;
      }

      float outlineFactor = (1.0 - step(0.5, factors.front))
        * (1.0 - step(0.5, factors.side0))
        * (1.0 - step(0.5, factors.side1))
        * (1.0 - step(0.5, factors.side2))
        * (1.0 - step(0.5, factors.side3));

      return mix(color, vec4(vec3(0.0), color.a), outlineFactor * 0.3);
    }

    vec4 applySlice(vec4 color, vec3 pos) {
      return sliceEnabled() ? applySliceOutline(color, pos) : color;
    }
  `):a.code.add(m`void discardBySlice(vec3 pos) { }
vec4 applySlice(vec4 color, vec3 pos) { return color; }`)}function y(a,s,e){return a.instancedDoublePrecision?b(D,e.camera.viewInverseTransposeMatrix[3],e.camera.viewInverseTransposeMatrix[7],e.camera.viewInverseTransposeMatrix[11]):s.slicePlaneLocalOrigin}function F(a,s){return a!=null?p(d,s.origin,a):s.origin}function g(a,s,e){return a.hasSliceTranslatedView?s!=null?v(L,e.camera.viewMatrix,s):e.camera.viewMatrix:null}function h(a,s,e){if(e.slicePlane==null)return P;let i=y(a,s,e),n=F(i,e.slicePlane),c=g(a,i,e);return c!=null?t(d,n,c):n}function f(a,s,e,i){if(i==null||e.slicePlane==null)return P;let n=y(a,s,e),c=F(n,e.slicePlane),u=g(a,n,e);return u!=null?(B(o,i,c),t(d,c,u),t(o,o,u),p(o,o,d)):i}var D=r(),d=r(),o=r(),L=w();export{Z as a,k as b};
