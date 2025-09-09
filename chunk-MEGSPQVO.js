import{a as r}from"./chunk-47NSYSFY.js";import{a as c}from"./chunk-RWCIDBNQ.js";import{b as s}from"./chunk-VOFKUGRY.js";function f(o,a){switch(a.normalType){case t.Compressed:o.attributes.add(c.NORMALCOMPRESSED,"vec2"),o.vertex.code.add(r`vec3 decompressNormal(vec2 normal) {
float z = 1.0 - abs(normal.x) - abs(normal.y);
return vec3(normal + sign(normal) * min(z, 0.0), z);
}
vec3 normalModel() {
return decompressNormal(normalCompressed);
}`);break;case t.Attribute:o.attributes.add(c.NORMAL,"vec3"),o.vertex.code.add(r`vec3 normalModel() {
return normal;
}`);break;case t.ScreenDerivative:o.fragment.code.add(r`vec3 screenDerivativeNormal(vec3 positionView) {
return normalize(cross(dFdx(positionView), dFdy(positionView)));
}`);break;default:a.normalType;case t.COUNT:}}var t;(function(o){o[o.Attribute=0]="Attribute",o[o.Compressed=1]="Compressed",o[o.ScreenDerivative=2]="ScreenDerivative",o[o.COUNT=3]="COUNT"})(t||(t={}));var e;function h(o){switch(o){case"multiply":default:return e.Multiply;case"ignore":return e.Ignore;case"replace":return e.Replace;case"tint":return e.Tint}}function A(o,a,l){if(o==null||a===e.Ignore)return l[0]=255,l[1]=255,l[2]=255,void(l[3]=255);let m=s(Math.round(o[3]*i),0,i),p=m===0||a===e.Tint?0:a===e.Replace?d:u;l[0]=s(Math.round(o[0]*n),0,n),l[1]=s(Math.round(o[1]*n),0,n),l[2]=s(Math.round(o[2]*n),0,n),l[3]=m+p}(function(o){o[o.Multiply=1]="Multiply",o[o.Ignore=2]="Ignore",o[o.Replace=3]="Replace",o[o.Tint=4]="Tint"})(e||(e={}));var n=255,i=85,d=i,u=2*i;function N(o){o.vertex.code.add(r`
    vec4 decodeSymbolColor(vec4 symbolColor, out int colorMixMode) {
      float symbolAlpha = 0.0;

      const float maxTint = 85.0;
      const float maxReplace = 170.0;
      const float scaleAlpha = 3.0;

      if (symbolColor.a > maxReplace) {
        colorMixMode = ${r.int(e.Multiply)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxReplace);
      } else if (symbolColor.a > maxTint) {
        colorMixMode = ${r.int(e.Replace)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxTint);
      } else if (symbolColor.a > 0.0) {
        colorMixMode = ${r.int(e.Tint)};
        symbolAlpha = scaleAlpha * symbolColor.a;
      } else {
        colorMixMode = ${r.int(e.Multiply)};
        symbolAlpha = 0.0;
      }

      return vec4(symbolColor.r, symbolColor.g, symbolColor.b, symbolAlpha);
    }
  `)}export{e as a,h as b,A as c,N as d,f as e,t as f};
