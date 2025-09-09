import{a as d,b as O,d as T,e as m,f as $,g as L,h as W}from"./chunk-LYVHPFC2.js";import{h as M}from"./chunk-7VWXQFPJ.js";import{b as j,c as C}from"./chunk-OTUHXNWB.js";import{a as b}from"./chunk-NBT2WTKD.js";import{a as g}from"./chunk-JLLOI4DS.js";import{b as y,c as P,d as z}from"./chunk-4MZNR6MW.js";import{a as w}from"./chunk-GVSOJUIP.js";import{a as D}from"./chunk-2PJRHNJW.js";import{a as x}from"./chunk-B2RVSTL3.js";import{a as S}from"./chunk-F6TN7E7K.js";import{a as u}from"./chunk-4LDVFWME.js";import{a as k}from"./chunk-DHLVTH5U.js";import{a as f}from"./chunk-WVKBXQWE.js";import{a as h}from"./chunk-SOEEM7Z7.js";import{a as r,b as n}from"./chunk-47NSYSFY.js";import{a as p}from"./chunk-RWCIDBNQ.js";function F(i){let e=new k,{space:v,anchor:N,hasTip:l}=i,s=v===d.World;e.include(T,i),e.include(W,i),e.include(j,i);let{vertex:o,fragment:c}=e;c.include(f),y(o,i),e.attributes.add(p.POSITION,"vec3"),e.attributes.add(p.PREVPOSITION,"vec3"),e.attributes.add(p.UV0,"vec2"),e.varyings.add("vColor","vec4"),e.varyings.add("vpos","vec3"),e.varyings.add("vUV","vec2"),e.varyings.add("vSize","float"),l&&e.varyings.add("vLineWidth","float"),o.uniforms.add(new S("nearFar",({camera:a})=>a.nearFar),new D("viewport",({camera:a})=>a.fullViewport)),o.code.add(r`vec4 projectAndScale(vec4 pos) {
vec4 posNdc = proj * pos;
posNdc.xy *= viewport.zw / posNdc.w;
return posNdc;
}`),o.code.add(r`void clip(vec4 pos, inout vec4 prev) {
float vnp = nearFar[0] * 0.99;
if (prev.z > -nearFar[0]) {
float interpolation = (-vnp - pos.z) / (prev.z - pos.z);
prev = mix(pos, prev, interpolation);
}
}`),s?(e.attributes.add(p.NORMAL,"vec3"),P(o),o.constants.add("tiltThreshold","float",.7),o.code.add(r`vec3 perpendicular(vec3 v) {
vec3 n = (viewNormal * vec4(normal.xyz, 1.0)).xyz;
vec3 n2 = cross(v, n);
vec3 forward = vec3(0.0, 0.0, 1.0);
float tiltDot = dot(forward, n);
return abs(tiltDot) < tiltThreshold ? n : n2;
}`)):o.code.add(r`vec2 perpendicular(vec2 v) {
return vec2(v.y, -v.x);
}`);let t=s?"vec3":"vec2";return o.code.add(r`
      ${t} normalizedSegment(${t} pos, ${t} prev) {
        ${t} segment = pos - prev;
        float segmentLen = length(segment);

        // normalize or zero if too short
        return (segmentLen > 0.001) ? segment / segmentLen : ${s?"vec3(0.0, 0.0, 0.0)":"vec2(0.0, 0.0)"};
      }

      ${t} displace(${t} pos, ${t} prev, float displacementLen) {
        ${t} segment = normalizedSegment(pos, prev);

        ${t} displacementDirU = perpendicular(segment);
        ${t} displacementDirV = segment;

        ${N===O.Tip?"pos -= 0.5 * displacementLen * displacementDirV;":""}

        return pos + displacementLen * (uv0.x * displacementDirU + uv0.y * displacementDirV);
      }
    `),v===d.Screen&&(o.uniforms.add(new h("inverseProjectionMatrix",({camera:a})=>a.inverseProjectionMatrix)),o.code.add(r`vec3 inverseProject(vec4 posScreen) {
posScreen.xy = (posScreen.xy / viewport.zw) * posScreen.w;
return (inverseProjectionMatrix * posScreen).xyz;
}`),o.code.add(r`bool rayIntersectPlane(vec3 rayDir, vec3 planeOrigin, vec3 planeNormal, out vec3 intersection) {
float cos = dot(rayDir, planeNormal);
float t = dot(planeOrigin, planeNormal) / cos;
intersection = t * rayDir;
return abs(cos) > 0.001 && t > 0.0;
}`),o.uniforms.add(new x("perScreenPixelRatio",({camera:a})=>a.perScreenPixelRatio)),o.code.add(r`
      vec4 toFront(vec4 displacedPosScreen, vec3 posLeft, vec3 posRight, vec3 prev, float lineWidth) {
        // Project displaced position back to camera space
        vec3 displacedPos = inverseProject(displacedPosScreen);

        // Calculate the plane that we want the marker to lie in. Note that this will always be an approximation since ribbon lines are generally
        // not planar and we do not know the actual position of the displaced prev vertices (they are offset in screen space, too).
        vec3 planeNormal = normalize(cross(posLeft - posRight, posLeft - prev));
        vec3 planeOrigin = posLeft;

        ${n(i.hasCap,`if(prev.z > posLeft.z) {
                vec2 diff = posLeft.xy - posRight.xy;
                planeOrigin.xy += perpendicular(diff) / 2.0;
             }`)};

        // Move the plane towards the camera by a margin dependent on the line width (approximated in world space). This tolerance corrects for the
        // non-planarity in most cases, but sharp joins can place the prev vertices at arbitrary positions so markers can still clip.
        float offset = lineWidth * perScreenPixelRatio;
        planeOrigin *= (1.0 - offset);

        // Intersect camera ray with the plane and make sure it is within clip space
        vec3 rayDir = normalize(displacedPos);
        vec3 intersection;
        if (rayIntersectPlane(rayDir, planeOrigin, planeNormal, intersection) && intersection.z < -nearFar[0] && intersection.z > -nearFar[1]) {
          return vec4(intersection.xyz, 1.0);
        }

        // Fallback: use depth of pos or prev, whichever is closer to the camera
        float minDepth = planeOrigin.z > prev.z ? length(planeOrigin) : length(prev);
        displacedPos *= minDepth / length(displacedPos);
        return vec4(displacedPos.xyz, 1.0);
      }
  `)),z(o),o.main.add(r`
    // Check for special value of uv0.y which is used by the Renderer when graphics
    // are removed before the VBO is recompacted. If this is the case, then we just
    // project outside of clip space.
    if (uv0.y == 0.0) {
      // Project out of clip space
      gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
    }
    else {
      float lineWidth = getLineWidth();
      float screenMarkerSize = getScreenMarkerSize();

      vec4 pos  = view * vec4(position, 1.0);
      vec4 prev = view * vec4(prevPosition, 1.0);
      clip(pos, prev);

      ${s?r`${n(i.hideOnShortSegments,r`
                if (areWorldMarkersHidden(pos, prev)) {
                  // Project out of clip space
                  gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
                  return;
                }`)}
            pos.xyz = displace(pos.xyz, prev.xyz, getWorldMarkerSize(pos));
            vec4 displacedPosScreen = projectAndScale(pos);`:r`
            vec4 posScreen = projectAndScale(pos);
            vec4 prevScreen = projectAndScale(prev);
            vec4 displacedPosScreen = posScreen;

            displacedPosScreen.xy = displace(posScreen.xy, prevScreen.xy, screenMarkerSize);
            ${n(v===d.Screen,r`
                vec2 displacementDirU = perpendicular(normalizedSegment(posScreen.xy, prevScreen.xy));

                // We need three points of the ribbon line in camera space to calculate the plane it lies in
                // Note that we approximate the third point, since we have no information about the join around prev
                vec3 lineRight = inverseProject(posScreen + lineWidth * vec4(displacementDirU.xy, 0.0, 0.0));
                vec3 lineLeft = pos.xyz + (pos.xyz - lineRight);

                pos = toFront(displacedPosScreen, lineLeft, lineRight, prev.xyz, lineWidth);
                displacedPosScreen = projectAndScale(pos);`)}`}
      forwardViewPosDepth(pos.xyz);
      // Convert back into NDC
      displacedPosScreen.xy = (displacedPosScreen.xy / viewport.zw) * displacedPosScreen.w;

      // Convert texture coordinate into [0,1]
      vUV = (uv0 + 1.0) / 2.0;
      ${n(!s,"vUV *= displacedPosScreen.w;")}
      ${n(l,"vLineWidth = lineWidth;")}

      vSize = screenMarkerSize;
      vColor = getColor();

      // Use camera space for slicing
      vpos = pos.xyz;

      gl_Position = displacedPosScreen;
    }`),e.fragment.include(g,i),e.include(M,i),c.uniforms.add(new w("intrinsicColor",a=>a.color),new u("tex",a=>a.markerTexture)),c.include(C),c.constants.add("texelSize","float",1/m),c.code.add(r`float markerAlpha(vec2 samplePos) {
samplePos += vec2(0.5, -0.5) * texelSize;
float sdf = rgbaTofloat(texture(tex, samplePos)) - 0.5;
float distance = sdf * vSize;
distance -= 0.5;
return clamp(0.5 - distance, 0.0, 1.0);
}`),l&&c.constants.add("relativeMarkerSize","float",$/m).constants.add("relativeTipLineWidth","float",L).code.add(r`
    float tipAlpha(vec2 samplePos) {
      // Convert coordinates s.t. they are in pixels and relative to the tip of an arrow marker
      samplePos -= vec2(0.5, 0.5 + 0.5 * relativeMarkerSize);
      samplePos *= vSize;

      float halfMarkerSize = 0.5 * relativeMarkerSize * vSize;
      float halfTipLineWidth = 0.5 * max(1.0, relativeTipLineWidth * vLineWidth);

      ${n(s,"halfTipLineWidth *= fwidth(samplePos.y);")}

      float distance = max(abs(samplePos.x) - halfMarkerSize, abs(samplePos.y) - halfTipLineWidth);
      return clamp(0.5 - distance, 0.0, 1.0);
    }
  `),e.include(b,i),c.main.add(r`
    discardBySlice(vpos);
    discardByTerrainDepth();

    vec4 finalColor = intrinsicColor * vColor;

    // Cancel out perspective correct interpolation if in screen space or draped
    vec2 samplePos = vUV ${n(!s,"* gl_FragCoord.w")};
    finalColor.a *= ${l?"max(markerAlpha(samplePos), tipAlpha(samplePos))":"markerAlpha(samplePos)"};
    outputColorHighlightOID(finalColor, vpos);`),e}var ae=Object.freeze(Object.defineProperty({__proto__:null,build:F},Symbol.toStringTag,{value:"Module"}));export{F as a,ae as b};
