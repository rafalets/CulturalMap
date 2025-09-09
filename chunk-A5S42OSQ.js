import{a as d}from"./chunk-F6TN7E7K.js";import{a as r}from"./chunk-47NSYSFY.js";import{a as o}from"./chunk-2FO7ARYZ.js";import{b as a}from"./chunk-QXXXCEV5.js";function l(e){e.uniforms.add(new d("zProjectionMap",t=>p(t.camera))),e.code.add(r`float linearizeDepth(float depth) {
float depthNdc = depth * 2.0 - 1.0;
float c1 = zProjectionMap[0];
float c2 = zProjectionMap[1];
return -(c1 / (depthNdc + c2 + 1e-7));
}`),e.code.add(r`float depthFromTexture(sampler2D depthTexture, vec2 uv) {
ivec2 iuv = ivec2(uv * vec2(textureSize(depthTexture, 0)));
float depth = texelFetch(depthTexture, iuv, 0).r;
return depth;
}`),e.code.add(r`float linearDepthFromTexture(sampler2D depthTexture, vec2 uv) {
return linearizeDepth(depthFromTexture(depthTexture, uv));
}`)}function p(e){let t=e.projectionMatrix;return a(c,t[14],t[10])}var c=o();export{l as a};
