import{a as Z,d as Y,h as ee}from"./chunk-LYVHPFC2.js";import{d as X}from"./chunk-4MYROXQR.js";import{b as l}from"./chunk-L5JJXC3A.js";import{a as G}from"./chunk-6L543SC5.js";import{a as V,g as N,h as Q}from"./chunk-7VWXQFPJ.js";import{a as k}from"./chunk-WDRWH4L7.js";import{b as q,c as K}from"./chunk-OTUHXNWB.js";import{b as D}from"./chunk-NBT2WTKD.js";import{a as M}from"./chunk-JLLOI4DS.js";import{a as B,b as $,d as x}from"./chunk-4MZNR6MW.js";import{a as h}from"./chunk-GVSOJUIP.js";import{a as H}from"./chunk-2PJRHNJW.js";import{a as S}from"./chunk-B2RVSTL3.js";import{a as U}from"./chunk-F6TN7E7K.js";import{a as c}from"./chunk-HUUJBVXR.js";import{a as I}from"./chunk-4LDVFWME.js";import{a as J}from"./chunk-DHLVTH5U.js";import{a as j}from"./chunk-WVKBXQWE.js";import{a as W}from"./chunk-3AS27HNO.js";import{a as _}from"./chunk-SOEEM7Z7.js";import{a as e,b as E}from"./chunk-47NSYSFY.js";import{a as u}from"./chunk-RWCIDBNQ.js";import{a as O,f as z}from"./chunk-PTZYZULI.js";import{b as A}from"./chunk-KZKWOEFD.js";import{a as s}from"./chunk-QGVBCWUY.js";function te(t){return t.pattern.map(o=>Math.round(o*t.pixelRatio))}function ie(t){if(t==null)return 1;let o=te(t);return Math.floor(o.reduce((d,p)=>d+p))}function oe(t){return te(t).reduce((o,d)=>Math.max(o,d))}function re(t){return t==null?z:t.length===4?t:A(me,t[0],t[1],t[2],1)}var me=O();function ne(t,o){if(!o.stippleEnabled)return void t.fragment.code.add(e`float getStippleAlpha() { return 1.0; }
void discardByStippleAlpha(float stippleAlpha, float threshold) {}
vec4 blendStipple(vec4 color, float stippleAlpha) { return color; }`);let d=!(o.draped&&o.stipplePreferContinuous),{vertex:p,fragment:i}=t;i.include(j),o.draped||(B(p,o),p.uniforms.add(new S("worldToScreenPerDistanceRatio",({camera:r})=>1/r.perScreenPixelRatio)).code.add(e`float computeWorldToScreenRatio(vec3 segmentCenter) {
float segmentDistanceToCamera = length(segmentCenter - cameraPosition);
return worldToScreenPerDistanceRatio / segmentDistanceToCamera;
}`)),t.varyings.add("vStippleDistance","float"),t.varyings.add("vStippleDistanceLimits","vec2"),t.varyings.add("vStipplePatternStretch","float"),p.code.add(e`
    float discretizeWorldToScreenRatio(float worldToScreenRatio) {
      float step = ${e.float(ve)};

      float discreteWorldToScreenRatio = log(worldToScreenRatio);
      discreteWorldToScreenRatio = ceil(discreteWorldToScreenRatio / step) * step;
      discreteWorldToScreenRatio = exp(discreteWorldToScreenRatio);
      return discreteWorldToScreenRatio;
    }
  `),p.code.add(e`vec2 computeStippleDistanceLimits(float startPseudoScreen, float segmentLengthPseudoScreen, float segmentLengthScreen, float patternLength) {`),p.code.add(e`
    if (segmentLengthPseudoScreen >= ${d?"patternLength":"1e4"}) {
  `),x(p),p.code.add(e`float repetitions = segmentLengthScreen / (patternLength * pixelRatio);
float flooredRepetitions = max(1.0, floor(repetitions + 0.5));
float segmentLengthScreenRounded = flooredRepetitions * patternLength;
float stretch = repetitions / flooredRepetitions;
vStipplePatternStretch = max(0.75, stretch);
return vec2(0.0, segmentLengthScreenRounded);
}
return vec2(startPseudoScreen, startPseudoScreen + segmentLengthPseudoScreen);
}`),i.uniforms.add(new I("stipplePatternTexture",r=>r.stippleTexture),new c("stipplePatternSDFNormalizer",r=>fe(r.stipplePattern)),new c("stipplePatternPixelSizeInv",r=>1/L(r))),o.stippleOffColorEnabled&&i.uniforms.add(new h("stippleOffColor",r=>re(r.stippleOffColor))),i.code.add(e`float getStippleSDF(out bool isClamped) {
float stippleDistanceClamped = clamp(vStippleDistance, vStippleDistanceLimits.x, vStippleDistanceLimits.y);
vec2 aaCorrectedLimits = vStippleDistanceLimits + vec2(1.0, -1.0) / gl_FragCoord.w;
isClamped = vStippleDistance < aaCorrectedLimits.x || vStippleDistance > aaCorrectedLimits.y;
float u = stippleDistanceClamped * gl_FragCoord.w * stipplePatternPixelSizeInv * vLineSizeInv;
u = fract(u);
float encodedSDF = rgbaTofloat(texture(stipplePatternTexture, vec2(u, 0.5)));
float sdf = (encodedSDF * 2.0 - 1.0) * stipplePatternSDFNormalizer;
return (sdf - 0.5) * vStipplePatternStretch + 0.5;
}
float getStippleSDF() {
bool ignored;
return getStippleSDF(ignored);
}
float getStippleAlpha() {
bool isClamped;
float stippleSDF = getStippleSDF(isClamped);
float antiAliasedResult = clamp(stippleSDF * vLineWidth + 0.5, 0.0, 1.0);
return isClamped ? floor(antiAliasedResult + 0.5) : antiAliasedResult;
}`),i.code.add(e`
    void discardByStippleAlpha(float stippleAlpha, float threshold) {
     ${E(!o.stippleOffColorEnabled,"if (stippleAlpha < threshold) { discard; }")}
    }

    vec4 blendStipple(vec4 color, float stippleAlpha) {
      return ${o.stippleOffColorEnabled?"mix(color, stippleOffColor, stippleAlpha)":"vec4(color.rgb, color.a * stippleAlpha)"};
    }
  `)}function fe(t){return t?(Math.floor(.5*(oe(t)-1))+.5)/t.pixelRatio:1}function L(t){let o=t.stipplePattern;return o?ie(t.stipplePattern)/o.pixelRatio:1}var ve=.4;var f;(function(t){t[t.BUTT=0]="BUTT",t[t.SQUARE=1]="SQUARE",t[t.ROUND=2]="ROUND",t[t.COUNT=3]="COUNT"})(f||(f={}));var a=class extends X{constructor(){super(...arguments),this.capType=f.BUTT,this.hasPolygonOffset=!1,this.writeDepth=!1,this.draped=!1,this.stippleEnabled=!1,this.stippleOffColorEnabled=!1,this.stipplePreferContinuous=!0,this.roundJoins=!1,this.applyMarkerOffset=!1,this.vvSize=!1,this.vvColor=!1,this.vvOpacity=!1,this.falloffEnabled=!1,this.innerColorEnabled=!1,this.hasOccludees=!1,this.occluder=!1,this.terrainDepthTest=!1,this.cullAboveTerrain=!1,this.wireframe=!1,this.discardInvisibleFragments=!1,this.objectAndLayerIdColorInstanced=!1,this.textureCoordinateType=V.None,this.emissionSource=N.None,this.occlusionPass=!1,this.hasVvInstancing=!0,this.hasSliceTranslatedView=!0}};s([l({count:f.COUNT})],a.prototype,"capType",void 0),s([l()],a.prototype,"hasPolygonOffset",void 0),s([l()],a.prototype,"writeDepth",void 0),s([l()],a.prototype,"draped",void 0),s([l()],a.prototype,"stippleEnabled",void 0),s([l()],a.prototype,"stippleOffColorEnabled",void 0),s([l()],a.prototype,"stipplePreferContinuous",void 0),s([l()],a.prototype,"roundJoins",void 0),s([l()],a.prototype,"applyMarkerOffset",void 0),s([l()],a.prototype,"vvSize",void 0),s([l()],a.prototype,"vvColor",void 0),s([l()],a.prototype,"vvOpacity",void 0),s([l()],a.prototype,"falloffEnabled",void 0),s([l()],a.prototype,"innerColorEnabled",void 0),s([l()],a.prototype,"hasOccludees",void 0),s([l()],a.prototype,"occluder",void 0),s([l()],a.prototype,"terrainDepthTest",void 0),s([l()],a.prototype,"cullAboveTerrain",void 0),s([l()],a.prototype,"wireframe",void 0),s([l()],a.prototype,"discardInvisibleFragments",void 0),s([l()],a.prototype,"objectAndLayerIdColorInstanced",void 0);var y=1;function ue(t){let o=new J,{attributes:d,varyings:p,vertex:i,fragment:r}=o,{applyMarkerOffset:ae,draped:g,output:se,capType:C,stippleEnabled:m,falloffEnabled:P,roundJoins:le,wireframe:T,innerColorEnabled:pe}=t;o.include(G),o.include(Y,t),o.include(ne,t),o.include(k,t),o.include(q,t);let b=ae&&!g;b&&(i.uniforms.add(new c("markerScale",n=>n.markerScale)),o.include(ee,{space:Z.World})),$(i,t),i.uniforms.add(new _("inverseProjectionMatrix",n=>n.camera.inverseProjectionMatrix),new U("nearFar",n=>n.camera.nearFar),new c("miterLimit",n=>n.join!=="miter"?0:n.miterLimit),new H("viewport",n=>n.camera.fullViewport)),i.constants.add("LARGE_HALF_FLOAT","float",65500),d.add(u.POSITION,"vec3"),d.add(u.PREVPOSITION,"vec3"),d.add(u.NEXTPOSITION,"vec3"),d.add(u.SUBDIVISIONFACTOR,"float"),d.add(u.UV0,"vec2"),p.add("vColor","vec4"),p.add("vpos","vec3"),p.add("vLineDistance","float"),p.add("vLineWidth","float");let R=m;R&&p.add("vLineSizeInv","float");let v=C===f.ROUND,w=m&&v,F=P||w;F&&p.add("vLineDistanceNorm","float"),v&&(p.add("vSegmentSDF","float"),p.add("vReverseSegmentSDF","float")),i.code.add(e`vec2 perpendicular(vec2 v) {
return vec2(v.y, -v.x);
}
float interp(float ncp, vec4 a, vec4 b) {
return (-ncp - a.z) / (b.z - a.z);
}
vec2 rotate(vec2 v, float a) {
float s = sin(a);
float c = cos(a);
mat2 m = mat2(c, -s, s, c);
return m * v;
}`),i.code.add(e`vec4 projectAndScale(vec4 pos) {
vec4 posNdc = proj * pos;
posNdc.xy *= viewport.zw / posNdc.w;
return posNdc;
}`),i.code.add(e`void clipAndTransform(inout vec4 pos, inout vec4 prev, inout vec4 next, in bool isStartVertex) {
float vnp = nearFar[0] * 0.99;
if(pos.z > -nearFar[0]) {
if (!isStartVertex) {
if(prev.z < -nearFar[0]) {
pos = mix(prev, pos, interp(vnp, prev, pos));
next = pos;
} else {
pos = vec4(0.0, 0.0, 0.0, 1.0);
}
} else {
if(next.z < -nearFar[0]) {
pos = mix(pos, next, interp(vnp, pos, next));
prev = pos;
} else {
pos = vec4(0.0, 0.0, 0.0, 1.0);
}
}
} else {
if (prev.z > -nearFar[0]) {
prev = mix(pos, prev, interp(vnp, pos, prev));
}
if (next.z > -nearFar[0]) {
next = mix(next, pos, interp(vnp, next, pos));
}
}
forwardViewPosDepth(pos.xyz);
pos = projectAndScale(pos);
next = projectAndScale(next);
prev = projectAndScale(prev);
}`),x(i),i.constants.add("aaWidth","float",m?0:1).main.add(e`
    // unpack values from uv0.y
    bool isStartVertex = abs(abs(uv0.y)-3.0) == 1.0;

    float coverage = 1.0;

    // Check for special value of uv0.y which is used by the Renderer when graphics
    // are removed before the VBO is recompacted. If this is the case, then we just
    // project outside of clip space.
    if (uv0.y == 0.0) {
      // Project out of clip space
      gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
    }
    else {
      bool isJoin = abs(uv0.y) < 3.0;
      float lineSize = getSize();

      if (lineSize < 1.0) {
        coverage = lineSize; // convert sub-pixel coverage to alpha
        lineSize = 1.0;
      }
      lineSize += aaWidth;

      float lineWidth = lineSize * pixelRatio;
      vLineWidth = lineWidth;
      ${R?e`vLineSizeInv = 1.0 / lineSize;`:""}

      vec4 pos  = view * vec4(position, 1.0);
      vec4 prev = view * vec4(prevPosition, 1.0);
      vec4 next = view * vec4(nextPosition, 1.0);
  `),b&&i.main.add(e`vec4 other = isStartVertex ? next : prev;
bool markersHidden = areWorldMarkersHidden(pos, other);
if(!isJoin && !markersHidden) {
pos.xyz += normalize(other.xyz - pos.xyz) * getWorldMarkerSize(pos) * 0.5;
}`),i.main.add(e`clipAndTransform(pos, prev, next, isStartVertex);
vec2 left = (pos.xy - prev.xy);
vec2 right = (next.xy - pos.xy);
float leftLen = length(left);
float rightLen = length(right);`),(m||v)&&i.main.add(e`
      float isEndVertex = float(!isStartVertex);
      vec2 segmentOrigin = mix(pos.xy, prev.xy, isEndVertex);
      vec2 segment = mix(right, left, isEndVertex);
      ${v?e`vec2 segmentEnd = mix(next.xy, pos.xy, isEndVertex);`:""}
    `),i.main.add(e`left = (leftLen > 0.001) ? left/leftLen : vec2(0.0, 0.0);
right = (rightLen > 0.001) ? right/rightLen : vec2(0.0, 0.0);
vec2 capDisplacementDir = vec2(0, 0);
vec2 joinDisplacementDir = vec2(0, 0);
float displacementLen = lineWidth;
if (isJoin) {
bool isOutside = (left.x * right.y - left.y * right.x) * uv0.y > 0.0;
joinDisplacementDir = normalize(left + right);
joinDisplacementDir = perpendicular(joinDisplacementDir);
if (leftLen > 0.001 && rightLen > 0.001) {
float nDotSeg = dot(joinDisplacementDir, left);
displacementLen /= length(nDotSeg * left - joinDisplacementDir);
if (!isOutside) {
displacementLen = min(displacementLen, min(leftLen, rightLen)/abs(nDotSeg));
}
}
if (isOutside && (displacementLen > miterLimit * lineWidth)) {`),le?i.main.add(e`
        vec2 startDir = leftLen < 0.001 ? right : left;
        startDir = perpendicular(startDir);

        vec2 endDir = rightLen < 0.001 ? left : right;
        endDir = perpendicular(endDir);

        float factor = ${m?e`min(1.0, subdivisionFactor * ${e.float((y+2)/(y+1))})`:e`subdivisionFactor`};

        float rotationAngle = acos(clamp(dot(startDir, endDir), -1.0, 1.0));
        joinDisplacementDir = rotate(startDir, -sign(uv0.y) * factor * rotationAngle);
      `):i.main.add(e`if (leftLen < 0.001) {
joinDisplacementDir = right;
}
else if (rightLen < 0.001) {
joinDisplacementDir = left;
}
else {
joinDisplacementDir = (isStartVertex || subdivisionFactor > 0.0) ? right : left;
}
joinDisplacementDir = perpendicular(joinDisplacementDir);`);let de=C!==f.BUTT;return i.main.add(e`
        displacementLen = lineWidth;
      }
    } else {
      // CAP handling ---------------------------------------------------
      joinDisplacementDir = isStartVertex ? right : left;
      joinDisplacementDir = perpendicular(joinDisplacementDir);

      ${de?e`capDisplacementDir = isStartVertex ? -right : left;`:""}
    }
  `),i.main.add(e`
    // Displacement (in pixels) caused by join/or cap
    vec2 dpos = joinDisplacementDir * sign(uv0.y) * displacementLen + capDisplacementDir * displacementLen;
    float lineDistNorm = sign(uv0.y) * pos.w;

    vLineDistance =  lineWidth * lineDistNorm;
    ${F?e`vLineDistanceNorm = lineDistNorm;`:""}

    pos.xy += dpos;
  `),v&&i.main.add(e`vec2 segmentDir = normalize(segment);
vSegmentSDF = (isJoin && isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentOrigin, segmentDir) * pos.w) ;
vReverseSegmentSDF = (isJoin && !isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentEnd, -segmentDir) * pos.w);`),m&&(g?i.uniforms.add(new S("worldToScreenRatio",n=>1/n.screenToPCSRatio)):i.main.add(e`vec3 segmentCenter = mix((nextPosition + position) * 0.5, (position + prevPosition) * 0.5, isEndVertex);
float worldToScreenRatio = computeWorldToScreenRatio(segmentCenter);`),i.main.add(e`float segmentLengthScreenDouble = length(segment);
float segmentLengthScreen = segmentLengthScreenDouble * 0.5;
float discreteWorldToScreenRatio = discretizeWorldToScreenRatio(worldToScreenRatio);
float segmentLengthRender = length(mix(nextPosition - position, position - prevPosition, isEndVertex));
vStipplePatternStretch = worldToScreenRatio / discreteWorldToScreenRatio;`),g?i.main.add(e`float segmentLengthPseudoScreen = segmentLengthScreen / pixelRatio * discreteWorldToScreenRatio / worldToScreenRatio;
float startPseudoScreen = uv0.x * discreteWorldToScreenRatio - mix(0.0, segmentLengthPseudoScreen, isEndVertex);`):i.main.add(e`float startPseudoScreen = mix(uv0.x, uv0.x - segmentLengthRender, isEndVertex) * discreteWorldToScreenRatio;
float segmentLengthPseudoScreen = segmentLengthRender * discreteWorldToScreenRatio;`),i.uniforms.add(new c("stipplePatternPixelSize",n=>L(n))),i.main.add(e`float patternLength = lineSize * stipplePatternPixelSize;
vStippleDistanceLimits = computeStippleDistanceLimits(startPseudoScreen, segmentLengthPseudoScreen, segmentLengthScreen, patternLength);
vStippleDistance = mix(vStippleDistanceLimits.x, vStippleDistanceLimits.y, isEndVertex);
if (segmentLengthScreenDouble >= 0.001) {
vec2 stippleDisplacement = pos.xy - segmentOrigin;
float stippleDisplacementFactor = dot(segment, stippleDisplacement) / (segmentLengthScreenDouble * segmentLengthScreenDouble);
vStippleDistance += (stippleDisplacementFactor - isEndVertex) * (vStippleDistanceLimits.y - vStippleDistanceLimits.x);
}
vStippleDistanceLimits *= pos.w;
vStippleDistance *= pos.w;
vStippleDistanceLimits = isJoin ?
vStippleDistanceLimits :
isStartVertex ?
vec2(-1e34, vStippleDistanceLimits.y) :
vec2(vStippleDistanceLimits.x, 1e34);`)),i.main.add(e`
      // Convert back into NDC
      pos.xy = (pos.xy / viewport.zw) * pos.w;

      vColor = getColor();
      vColor.a *= coverage;

      ${T&&!g?"pos.z -= 0.001 * pos.w;":""}

      // transform final position to camera space for slicing
      vpos = (inverseProjectionMatrix * pos).xyz;
      gl_Position = pos;
      forwardObjectAndLayerIdColor();
    }`),o.fragment.include(M,t),o.include(Q,t),r.include(K),r.main.add(e`discardBySlice(vpos);
discardByTerrainDepth();`),T?r.main.add(e`vec4 finalColor = vec4(1.0, 0.0, 1.0, 1.0);`):(v&&r.main.add(e`
        float sdf = min(vSegmentSDF, vReverseSegmentSDF);
        vec2 fragmentPosition = vec2(
          min(sdf, 0.0),
          vLineDistance
        ) * gl_FragCoord.w;

        float fragmentRadius = length(fragmentPosition);
        float fragmentCapSDF = (fragmentRadius - vLineWidth) * 0.5; // Divide by 2 to transform from double pixel scale
        float capCoverage = clamp(0.5 - fragmentCapSDF, 0.0, 1.0);

        if (capCoverage < ${e.float(D)}) {
          discard;
        }
      `),w?r.main.add(e`
      vec2 stipplePosition = vec2(
        min(getStippleSDF() * 2.0 - 1.0, 0.0),
        vLineDistanceNorm * gl_FragCoord.w
      );
      float stippleRadius = length(stipplePosition * vLineWidth);
      float stippleCapSDF = (stippleRadius - vLineWidth) * 0.5; // Divide by 2 to transform from double pixel scale
      float stippleCoverage = clamp(0.5 - stippleCapSDF, 0.0, 1.0);
      float stippleAlpha = step(${e.float(D)}, stippleCoverage);
      `):r.main.add(e`float stippleAlpha = getStippleAlpha();`),se!==W.ObjectAndLayerIdColor&&r.main.add(e`discardByStippleAlpha(stippleAlpha, ${e.float(D)});`),r.uniforms.add(new h("intrinsicColor",n=>n.color)),r.main.add(e`vec4 color = intrinsicColor * vColor;`),pe&&(r.uniforms.add(new h("innerColor",n=>n.innerColor??n.color),new c("innerWidth",(n,ce)=>n.innerWidth*ce.camera.pixelRatio)),r.main.add(e`float distToInner = abs(vLineDistance * gl_FragCoord.w) - innerWidth;
float innerAA = clamp(0.5 - distToInner, 0.0, 1.0);
float innerAlpha = innerColor.a + color.a * (1.0 - innerColor.a);
color = mix(color, vec4(innerColor.rgb, innerAlpha), innerAA);`)),r.main.add(e`vec4 finalColor = blendStipple(color, stippleAlpha);`),P&&(r.uniforms.add(new c("falloff",n=>n.falloff)),r.main.add(e`finalColor.a *= pow(max(0.0, 1.0 - abs(vLineDistanceNorm * gl_FragCoord.w)), falloff);`)),m||r.main.add(e`float featherStartDistance = max(vLineWidth - 2.0, 0.0);
float value = abs(vLineDistance) * gl_FragCoord.w;
float feather = (value - featherStartDistance) / (vLineWidth - featherStartDistance);
finalColor.a *= 1.0 - clamp(feather, 0.0, 1.0);`)),r.main.add(e`outputColorHighlightOID(finalColor, vpos);`),o}var xt=Object.freeze(Object.defineProperty({__proto__:null,build:ue,ribbonlineNumRoundJoinSubdivisions:y},Symbol.toStringTag,{value:"Module"}));export{f as a,a as b,y as c,ue as d,xt as e};
