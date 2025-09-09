import{f as v}from"./chunk-WPMNZVYJ.js";import{h as I}from"./chunk-7VWXQFPJ.js";import{a as g}from"./chunk-WDRWH4L7.js";import{b as x,c as C}from"./chunk-OTUHXNWB.js";import{a as u}from"./chunk-JLLOI4DS.js";import{b as c}from"./chunk-4MZNR6MW.js";import{a as f}from"./chunk-L7NOU4T2.js";import{a as P}from"./chunk-HUUJBVXR.js";import{a as l}from"./chunk-4LDVFWME.js";import{a as b}from"./chunk-DHLVTH5U.js";import{a as p}from"./chunk-3AS27HNO.js";import{a,b as i}from"./chunk-47NSYSFY.js";import{a as e}from"./chunk-RWCIDBNQ.js";var s=class extends f{};function w(r){let o=new b,{vertex:n,fragment:d}=o,{output:y,perspectiveInterpolation:m}=r;return c(n,r),o.include(v,r),o.include(x,r),o.fragment.include(u,r),o.include(g,r),o.include(I,r),o.attributes.add(e.POSITION,"vec3"),o.attributes.add(e.UV0,"vec2"),m&&o.attributes.add(e.PERSPECTIVEDIVIDE,"float"),n.main.add(a`
    vpos = position;
    forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
    vTexCoord = uv0;
    gl_Position = transformPosition(proj, view, vpos);
    ${i(m,"gl_Position *= perspectiveDivide;")}`),o.varyings.add("vpos","vec3"),o.varyings.add("vTexCoord","vec2"),d.include(C),d.uniforms.add(new P("opacity",t=>t.opacity),new l("tex",t=>t.texture)).main.add(a`
    discardBySlice(vpos);
    discardByTerrainDepth();
    ${i(y===p.ObjectAndLayerIdColor,"fragColor = vec4(0, 0, 0, 1); return;")}
    vec4 finalColor = texture(tex, vTexCoord) * opacity;
    outputColorHighlightOID(finalColor, vpos);`),o}var H=Object.freeze(Object.defineProperty({__proto__:null,ImageMaterialPassParameters:s,build:w},Symbol.toStringTag,{value:"Module"}));export{s as a,w as b,H as c};
