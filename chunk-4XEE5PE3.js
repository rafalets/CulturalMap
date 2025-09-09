import{a as i}from"./chunk-47NSYSFY.js";import{a}from"./chunk-RWCIDBNQ.js";function s(t,e=!0){t.attributes.add(a.POSITION,"vec2"),e&&t.varyings.add("uv","vec2"),t.vertex.main.add(i`
      gl_Position = vec4(position, 0.0, 1.0);
      ${e?i`uv = position * 0.5 + vec2(0.5);`:""}
  `)}export{s as a};
