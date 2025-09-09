import{a as t}from"./chunk-44A27HB7.js";import{a as i}from"./chunk-47NSYSFY.js";import{a as r}from"./chunk-QXNVQZT7.js";function u({code:c},e){e.doublePrecisionRequiresObfuscation?c.add(i`vec3 dpPlusFrc(vec3 a, vec3 b) {
return mix(a, a + b, vec3(notEqual(b, vec3(0))));
}
vec3 dpMinusFrc(vec3 a, vec3 b) {
return mix(vec3(0), a - b, vec3(notEqual(a, b)));
}
vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 t1 = dpPlusFrc(hiA, hiB);
vec3 e = dpMinusFrc(t1, hiA);
vec3 t2 = dpMinusFrc(hiB, e) + dpMinusFrc(hiA, dpMinusFrc(t1, e)) + loA + loB;
return t1 + t2;
}`):c.add(i`vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 t1 = hiA + hiB;
vec3 e = t1 - hiA;
vec3 t2 = ((hiB - e) + (hiA - (t1 - e))) + loA + loB;
return t1 + t2;
}`)}var o=class extends t{constructor(e,v){super(e,"mat3",r.Draw,(s,a,n)=>s.setUniformMatrix3fv(e,v(a,n)))}};export{u as a,o as b};
