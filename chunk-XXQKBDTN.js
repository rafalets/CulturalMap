import{a as n}from"./chunk-4MZNR6MW.js";import{a as f}from"./chunk-GVSOJUIP.js";import{a as c}from"./chunk-T7PUQGWM.js";import{a as r}from"./chunk-47NSYSFY.js";import{c as l}from"./chunk-5WKDXHVH.js";import{a as i}from"./chunk-PTZYZULI.js";import{b as o}from"./chunk-KZKWOEFD.js";import{a as s}from"./chunk-NHSDW26F.js";function d(e){e.vertex.code.add(r`float screenSizePerspectiveViewAngleDependentFactor(float absCosAngle) {
return absCosAngle * absCosAngle * absCosAngle;
}`),e.vertex.code.add(r`vec3 screenSizePerspectiveScaleFactor(float absCosAngle, float distanceToCamera, vec3 params) {
return vec3(
min(params.x / (distanceToCamera - params.y), 1.0),
screenSizePerspectiveViewAngleDependentFactor(absCosAngle),
params.z
);
}`),e.vertex.code.add(r`float applyScreenSizePerspectiveScaleFactorFloat(float size, vec3 factor) {
return mix(size * clamp(factor.x, factor.z, 1.0), size, factor.y);
}`),e.vertex.code.add(r`float screenSizePerspectiveScaleFloat(float size, float absCosAngle, float distanceToCamera, vec3 params) {
return applyScreenSizePerspectiveScaleFactorFloat(
size,
screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params)
);
}`),e.vertex.code.add(r`vec2 applyScreenSizePerspectiveScaleFactorVec2(vec2 size, vec3 factor) {
return mix(size * clamp(factor.x, factor.z, 1.0), size, factor.y);
}`),e.vertex.code.add(r`vec2 screenSizePerspectiveScaleVec2(vec2 size, float absCosAngle, float distanceToCamera, vec3 params) {
return applyScreenSizePerspectiveScaleFactorVec2(size, screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params));
}`)}function V(e){e.uniforms.add(new c("screenSizePerspective",a=>m(a.screenSizePerspective)))}function v(e){e.uniforms.add(new c("screenSizePerspectiveAlignment",a=>m(a.screenSizePerspectiveAlignment||a.screenSizePerspective)))}function m(e){return l(w,e.parameters.divisor,e.parameters.offset,e.minScaleFactor)}var w=s();function L(e,a){let t=e.vertex;a.hasVerticalOffset?(O(t),a.hasScreenSizePerspective&&(e.include(d),v(t),n(e.vertex,a)),t.code.add(r`
      vec3 calculateVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        float viewDistance = length((view * vec4(worldPos, 1.0)).xyz);
        ${a.spherical?r`vec3 worldNormal = normalize(worldPos + localOrigin);`:r`vec3 worldNormal = vec3(0.0, 0.0, 1.0);`}
        ${a.hasScreenSizePerspective?r`
            float cosAngle = dot(worldNormal, normalize(worldPos - cameraPosition));
            float verticalOffsetScreenHeight = screenSizePerspectiveScaleFloat(verticalOffset.x, abs(cosAngle), viewDistance, screenSizePerspectiveAlignment);`:r`
            float verticalOffsetScreenHeight = verticalOffset.x;`}
        // Screen sized offset in world space, used for example for line callouts
        float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * viewDistance, verticalOffset.z, verticalOffset.w);
        return worldNormal * worldOffset;
      }

      vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        return worldPos + calculateVerticalOffset(worldPos, localOrigin);
      }
    `)):t.code.add(r`vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) { return worldPos; }`)}var u=i();function O(e){e.uniforms.add(new f("verticalOffset",(a,t)=>{let{minWorldLength:p,maxWorldLength:S,screenLength:z}=a.verticalOffset,P=Math.tan(.5*t.camera.fovY)/(.5*t.camera.fullViewport[3]),g=t.camera.pixelRatio||1;return o(u,z*g,P,p,S)}))}export{d as a,V as b,v as c,L as d,O as e};
