import{a as f}from"./chunk-CUV3BSEW.js";import{f as p}from"./chunk-WPMNZVYJ.js";import{h as O}from"./chunk-7VWXQFPJ.js";import{a as c}from"./chunk-6DKBN3BZ.js";import{a as C}from"./chunk-WDRWH4L7.js";import{b as g,c as w}from"./chunk-OTUHXNWB.js";import{a as m}from"./chunk-JLLOI4DS.js";import{b as u}from"./chunk-4MZNR6MW.js";import{a as v}from"./chunk-GVSOJUIP.js";import{a as b}from"./chunk-DHLVTH5U.js";import{a}from"./chunk-47NSYSFY.js";import{a as t}from"./chunk-RWCIDBNQ.js";function V(o){let r=new b,{vertex:e,fragment:i,attributes:l,varyings:s}=r,{vvColor:d,hasVertexColors:n}=o;return u(e,o),r.include(p,o),r.include(f,o),r.include(c,o),r.include(C,o),i.include(m,o),r.include(O,o),r.include(g,o),l.add(t.POSITION,"vec3"),d&&l.add(t.COLORFEATUREATTRIBUTE,"float"),n||s.add("vColor","vec4"),s.add("vpos","vec3"),e.uniforms.add(new v("uColor",h=>h.color)),e.main.add(a`
      vpos = position;
      forwardNormalizedVertexColor();
      forwardObjectAndLayerIdColor();

      ${n?"vColor *= uColor;":d?"vColor = uColor * interpolateVVColor(colorFeatureAttribute);":"vColor = uColor;"}
      forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
      gl_Position = transformPosition(proj, view, vpos);`),i.include(w),i.main.add(a`discardBySlice(vpos);
discardByTerrainDepth();
outputColorHighlightOID(vColor, vpos);`),r}var E=Object.freeze(Object.defineProperty({__proto__:null,build:V},Symbol.toStringTag,{value:"Module"}));export{V as a,E as b};
