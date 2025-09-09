import{a as h}from"./chunk-CUV3BSEW.js";import{f as w}from"./chunk-WPMNZVYJ.js";import{h as V}from"./chunk-7VWXQFPJ.js";import{a as T}from"./chunk-6DKBN3BZ.js";import{a as y}from"./chunk-WDRWH4L7.js";import{b as R,c as D}from"./chunk-OTUHXNWB.js";import{a as g}from"./chunk-JLLOI4DS.js";import{a as C,b as S}from"./chunk-4MZNR6MW.js";import{a as x}from"./chunk-GVSOJUIP.js";import{a as d}from"./chunk-B2RVSTL3.js";import{a as P}from"./chunk-DHLVTH5U.js";import{a as u}from"./chunk-3AS27HNO.js";import{a as o}from"./chunk-47NSYSFY.js";import{a as l}from"./chunk-RWCIDBNQ.js";var r;(function(e){e[e.Horizontal=0]="Horizontal",e[e.Vertical=1]="Vertical",e[e.Cross=2]="Cross",e[e.ForwardDiagonal=3]="ForwardDiagonal",e[e.BackwardDiagonal=4]="BackwardDiagonal",e[e.DiagonalCross=5]="DiagonalCross",e[e.COUNT=6]="COUNT"})(r||(r={}));var v=.70710678118,b=v,O=.08715574274,m=10,A=1;function $(e){let a=new P,{vertex:t,fragment:n,attributes:c,varyings:s}=a,f=e.output===u.Highlight;S(t,e),a.include(w,e),a.include(h,e),a.include(T,e),a.include(y,e),a.fragment.include(g,e),a.include(V,e),a.include(R,e),e.draped?t.uniforms.add(new d("worldToScreenRatio",i=>1/i.screenToPCSRatio)):c.add(l.BOUNDINGRECT,"mat3"),c.add(l.POSITION,"vec3"),c.add(l.UVMAPSPACE,"vec4"),e.vvColor&&c.add(l.COLORFEATUREATTRIBUTE,"float"),e.hasVertexColors||s.add("vColor","vec4"),s.add("vpos","vec3"),s.add("vuv","vec2"),t.uniforms.add(new x("uColor",i=>i.color));let p=e.style===r.ForwardDiagonal||e.style===r.BackwardDiagonal||e.style===r.DiagonalCross;return p&&t.code.add(o`
      const mat2 rotate45 = mat2(${o.float(v)}, ${o.float(-.70710678118)},
                                 ${o.float(b)}, ${o.float(v)});
    `),e.draped||(C(t,e),t.uniforms.add(new d("worldToScreenPerDistanceRatio",i=>1/i.camera.perScreenPixelRatio)),t.code.add(o`vec3 projectPointToLineSegment(vec3 center, vec3 halfVector, vec3 point) {
float projectedLength = dot(halfVector, point - center) / dot(halfVector, halfVector);
return center + halfVector * clamp(projectedLength, -1.0, 1.0);
}`),t.code.add(o`vec3 intersectRayPlane(vec3 rayDir, vec3 rayOrigin, vec3 planeNormal, vec3 planePoint) {
float d = dot(planeNormal, planePoint);
float t = (d - dot(planeNormal, rayOrigin)) / dot(planeNormal, rayDir);
return rayOrigin + t * rayDir;
}`),t.code.add(o`
      float boundingRectDistanceToCamera() {
        vec3 center = vec3(boundingRect[0][0], boundingRect[0][1], boundingRect[0][2]);
        vec3 halfU = vec3(boundingRect[1][0], boundingRect[1][1], boundingRect[1][2]);
        vec3 halfV = vec3(boundingRect[2][0], boundingRect[2][1], boundingRect[2][2]);
        vec3 n = normalize(cross(halfU, halfV));

        vec3 viewDir = - vec3(view[0][2], view[1][2], view[2][2]);

        float viewAngle = dot(viewDir, n);
        float minViewAngle = ${o.float(O)};

        if (abs(viewAngle) < minViewAngle) {
          // view direction is (almost) parallel to plane -> clamp it to min angle
          float normalComponent = sign(viewAngle) * minViewAngle - viewAngle;
          viewDir = normalize(viewDir + normalComponent * n);
        }

        // intersect view direction with infinite plane that contains bounding rect
        vec3 planeProjected = intersectRayPlane(viewDir, cameraPosition, n, center);

        // clip to bounds by projecting to u and v line segments individually
        vec3 uProjected = projectPointToLineSegment(center, halfU, planeProjected);
        vec3 vProjected = projectPointToLineSegment(center, halfV, planeProjected);

        // use to calculate the closest point to camera on bounding rect
        vec3 closestPoint = uProjected + vProjected - center;

        return length(closestPoint - cameraPosition);
      }
    `)),t.code.add(o`
    vec2 scaledUV() {
      vec2 uv = uvMapSpace.xy ${p?" * rotate45":""};
      vec2 uvCellOrigin = uvMapSpace.zw ${p?" * rotate45":""};

      ${e.draped?"":o`
            float distanceToCamera = boundingRectDistanceToCamera();
            float worldToScreenRatio = worldToScreenPerDistanceRatio / distanceToCamera;
          `}

      // Logarithmically discretize ratio to avoid jittering
      float step = 0.1;
      float discreteWorldToScreenRatio = log(worldToScreenRatio);
      discreteWorldToScreenRatio = ceil(discreteWorldToScreenRatio / step) * step;
      discreteWorldToScreenRatio = exp(discreteWorldToScreenRatio);

      vec2 uvOffset = mod(uvCellOrigin * discreteWorldToScreenRatio, ${o.float(m)});
      return uvOffset + (uv * discreteWorldToScreenRatio);
    }
  `),t.main.add(o`
    vuv = scaledUV();
    vpos = position;
    forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
    forwardNormalizedVertexColor();
    forwardObjectAndLayerIdColor();
    ${e.hasVertexColors?"vColor *= uColor;":e.vvColor?"vColor = uColor * interpolateVVColor(colorFeatureAttribute);":"vColor = uColor;"}
    gl_Position = transformPosition(proj, view, vpos);
  `),n.include(D),e.draped&&n.uniforms.add(new d("texelSize",i=>1/i.camera.pixelRatio)),f||(n.code.add(o`
      const float lineWidth = ${o.float(A)};
      const float spacing = ${o.float(m)};
      const float spacingINV = ${o.float(1/m)};

      float coverage(float p, float txlSize) {
        p = mod(p, spacing);

        float halfTxlSize = txlSize / 2.0;

        float start = p - halfTxlSize;
        float end = p + halfTxlSize;

        float coverage = (ceil(end * spacingINV) - floor(start * spacingINV)) * lineWidth;
        coverage -= min(lineWidth, mod(start, spacing));
        coverage -= max(lineWidth - mod(end, spacing), 0.0);

        return coverage / txlSize;
      }
    `),e.draped||n.code.add(o`const int maxSamples = 5;
float sampleAA(float p) {
vec2 dxdy = abs(vec2(dFdx(p), dFdy(p)));
float fwidth = dxdy.x + dxdy.y;
ivec2 samples = 1 + ivec2(clamp(dxdy, 0.0, float(maxSamples - 1)));
vec2 invSamples = 1.0 / vec2(samples);
float accumulator = 0.0;
for (int j = 0; j < maxSamples; j++) {
if(j >= samples.y) {
break;
}
for (int i = 0; i < maxSamples; i++) {
if(i >= samples.x) {
break;
}
vec2 step = vec2(i,j) * invSamples - 0.5;
accumulator += coverage(p + step.x * dxdy.x + step.y * dxdy.y, fwidth);
}
}
accumulator /= float(samples.x * samples.y);
return accumulator;
}`)),n.main.add(o`
    discardBySlice(vpos);
    discardByTerrainDepth();
    vec4 color = vColor;
    ${f?"":o`color.a *= ${z(e)};`}
    outputColorHighlightOID(color, vpos);
  `),a}function z(e){function a(t){return e.draped?o`coverage(vuv.${t}, texelSize)`:o`sampleAA(vuv.${t})`}switch(e.style){case r.ForwardDiagonal:case r.Horizontal:return a("y");case r.BackwardDiagonal:case r.Vertical:return a("x");case r.DiagonalCross:case r.Cross:return o`1.0 - (1.0 - ${a("x")}) * (1.0 - ${a("y")})`;default:return"0.0"}}var Q=Object.freeze(Object.defineProperty({__proto__:null,build:$},Symbol.toStringTag,{value:"Module"}));export{r as a,$ as b,Q as c};
