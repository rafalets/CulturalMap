import{m as n,n as s,w as a}from"./chunk-3D4Y6BLC.js";import{q as l}from"./chunk-3AS27HNO.js";import{a as t}from"./chunk-T7PUQGWM.js";import{a as v}from"./chunk-47NSYSFY.js";import{a as i}from"./chunk-RWCIDBNQ.js";function p(u,r){let{vertex:e,attributes:c}=u;r.hasVvInstancing&&(r.vvSize||r.vvColor)&&c.add(i.INSTANCEFEATUREATTRIBUTE,"vec4"),r.vvSize?(e.uniforms.add(new t("vvSizeMinSize",o=>o.vvSize.minSize)),e.uniforms.add(new t("vvSizeMaxSize",o=>o.vvSize.maxSize)),e.uniforms.add(new t("vvSizeOffset",o=>o.vvSize.offset)),e.uniforms.add(new t("vvSizeFactor",o=>o.vvSize.factor)),e.uniforms.add(new l("vvSymbolRotationMatrix",o=>o.vvSymbolRotationMatrix)),e.uniforms.add(new t("vvSymbolAnchor",o=>o.vvSymbolAnchor)),e.code.add(v`vec3 vvScale(vec4 _featureAttribute) {
return clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize);
}
vec4 vvTransformPosition(vec3 position, vec4 _featureAttribute) {
return vec4(vvSymbolRotationMatrix * ( vvScale(_featureAttribute) * (position + vvSymbolAnchor)), 1.0);
}`),e.code.add(v`
      const float eps = 1.192092896e-07;
      vec4 vvTransformNormal(vec3 _normal, vec4 _featureAttribute) {
        vec3 vvScale = clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize + eps, vvSizeMaxSize);
        return vec4(vvSymbolRotationMatrix * _normal / vvScale, 1.0);
      }

      ${r.hasVvInstancing?v`
      vec4 vvLocalNormal(vec3 _normal) {
        return vvTransformNormal(_normal, instanceFeatureAttribute);
      }

      vec4 localPosition() {
        return vvTransformPosition(position, instanceFeatureAttribute);
      }`:""}
    `)):e.code.add(v`vec4 localPosition() { return vec4(position, 1.0); }
vec4 vvLocalNormal(vec3 _normal) { return vec4(_normal, 1.0); }`),r.vvColor?(e.constants.add("vvColorNumber","int",a),e.uniforms.add(new s("vvColorValues",o=>o.vvColor.values,a),new n("vvColorColors",o=>o.vvColor.colors,a)),e.code.add(v`
      vec4 interpolateVVColor(float value) {
        if (value <= vvColorValues[0]) {
          return vvColorColors[0];
        }

        for (int i = 1; i < vvColorNumber; ++i) {
          if (vvColorValues[i] >= value) {
            float f = (value - vvColorValues[i-1]) / (vvColorValues[i] - vvColorValues[i-1]);
            return mix(vvColorColors[i-1], vvColorColors[i], f);
          }
        }
        return vvColorColors[vvColorNumber - 1];
      }

      vec4 vvGetColor(vec4 featureAttribute) {
        return interpolateVVColor(featureAttribute.y);
      }

      ${r.hasVvInstancing?v`
            vec4 vvColor() {
              return vvGetColor(instanceFeatureAttribute);
            }`:"vec4 vvColor() { return vec4(1.0); }"}
    `)):e.code.add(v`vec4 vvColor() { return vec4(1.0); }`)}export{p as a};
