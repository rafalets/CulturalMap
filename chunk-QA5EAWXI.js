import{b as Q,c as g,e as W}from"./chunk-K2IZFVKY.js";import{a as _,b as L,c as I}from"./chunk-XXQKBDTN.js";import{a as Z}from"./chunk-6DKBN3BZ.js";import{a as q}from"./chunk-WDRWH4L7.js";import{a as m,b as J,c as K}from"./chunk-OTUHXNWB.js";import{a as k,b as u}from"./chunk-NBT2WTKD.js";import{b as H}from"./chunk-JLLOI4DS.js";import{d as V}from"./chunk-4MZNR6MW.js";import{a as v}from"./chunk-GVSOJUIP.js";import{a as M}from"./chunk-ELCBU4NP.js";import{a as O}from"./chunk-WOZSH7YY.js";import{a as N}from"./chunk-2PJRHNJW.js";import{a as R}from"./chunk-B2RVSTL3.js";import{a as w}from"./chunk-HUUJBVXR.js";import{a as U}from"./chunk-4LDVFWME.js";import{a as G}from"./chunk-DHLVTH5U.js";import{a as E}from"./chunk-ESSDCWGF.js";import{a as B}from"./chunk-WVKBXQWE.js";import{a as l}from"./chunk-3AS27HNO.js";import{a as e,b as t}from"./chunk-47NSYSFY.js";import{a as p}from"./chunk-RWCIDBNQ.js";import{a as F}from"./chunk-2FO7ARYZ.js";import{a as T,b as j}from"./chunk-QXXXCEV5.js";import{c as D,f as $}from"./chunk-PTZYZULI.js";import{a as y}from"./chunk-ARRCN5K3.js";function X(o,r){let{vertex:s,fragment:C}=o;o.include(J,r),s.include(g),s.main.add(e`vec4 posProjCenter;
if (dot(position, position) > 0.0) {
ProjectHUDAux projectAux;
vec4 posProj = projectPositionHUD(projectAux);
posProjCenter = alignToPixelCenter(posProj, viewport.zw);
forwardViewPosDepth(projectAux.posView);
vec3 vpos = projectAux.posModel;
if (rejectBySlice(vpos)) {
posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
}
} else {
posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
}
gl_Position = posProjCenter;
gl_PointSize = 1.0;`),C.main.add(e`fragColor = vec4(1);
if(discardByTerrainDepth()) {
fragColor.g = 0.5;
}`)}function ie(o){let r=new G,s=o.signedDistanceFieldEnabled;r.include(Q,o),r.vertex.include(H,o);let{occlusionPass:C,output:c,oitPass:P}=o;if(C)return r.include(X,o),r;let{vertex:a,fragment:n}=r;r.include(_),r.include(Z,o),r.include(q,o),r.include(W),n.include(B),n.include(K),r.varyings.add("vcolor","vec4"),r.varyings.add("vtc","vec2"),r.varyings.add("vsize","vec2");let d=c===l.Highlight,b=d&&o.occlusionTestEnabled;b&&r.varyings.add("voccluded","float"),a.uniforms.add(new N("viewport",i=>i.camera.fullViewport),new O("screenOffset",(i,f)=>j(x,2*i.screenOffset[0]*f.camera.pixelRatio,2*i.screenOffset[1]*f.camera.pixelRatio)),new O("anchorPosition",i=>ee(i)),new v("materialColor",i=>i.color),new w("materialRotation",i=>i.rotation)),V(a),s&&(a.uniforms.add(new v("outlineColor",i=>i.outlineColor)),n.uniforms.add(new v("outlineColor",i=>Y(i)?i.outlineColor:$),new w("outlineSize",i=>Y(i)?i.outlineSize:0))),o.horizonCullingEnabled&&a.uniforms.add(new E("pointDistanceSphere",(i,f)=>{let z=f.camera.eye,A=i.origin;return D(A[0]-z[0],A[1]-z[1],A[2]-z[2],y.radius)})),o.pixelSnappingEnabled&&a.include(g),o.hasScreenSizePerspective&&(L(a),I(a)),o.debugDrawLabelBorder&&r.varyings.add("debugBorderCoords","vec4"),r.attributes.add(p.UV0,"vec2"),r.attributes.add(p.COLOR,"vec4"),r.attributes.add(p.SIZE,"vec2"),r.attributes.add(p.ROTATION,"float"),r.attributes.add(p.FEATUREATTRIBUTE,"vec4"),a.code.add(o.horizonCullingEnabled?e`bool behindHorizon(vec3 posModel) {
vec3 camToEarthCenter = pointDistanceSphere.xyz - localOrigin;
vec3 camToPos = pointDistanceSphere.xyz + posModel;
float earthRadius = pointDistanceSphere.w;
float a = dot(camToPos, camToPos);
float b = dot(camToPos, camToEarthCenter);
float c = dot(camToEarthCenter, camToEarthCenter) - earthRadius * earthRadius;
return  b > 0.0 && b < a && b * b  > a * c;
}`:e`bool behindHorizon(vec3 posModel) { return false; }`),a.main.add(e`
      ProjectHUDAux projectAux;
      vec4 posProj = projectPositionHUD(projectAux);
      forwardObjectAndLayerIdColor();

      if (rejectBySlice(projectAux.posModel)) {
        // Project outside of clip plane
        gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
        return;
      }

      if (behindHorizon(projectAux.posModel)) {
        // Project outside of clip plane
        gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
        return;
      }

      vec2 inputSize;
      ${t(o.hasScreenSizePerspective,e`
          inputSize = screenSizePerspectiveScaleVec2(size, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspective);
          vec2 screenOffsetScaled = screenSizePerspectiveScaleVec2(screenOffset, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspectiveAlignment);`,e`
          inputSize = size;
          vec2 screenOffsetScaled = screenOffset;`)}
      ${t(o.vvSize,e`inputSize *= vvScale(featureAttribute).xx;`)}

      vec2 combinedSize = inputSize * pixelRatio;
      vec4 quadOffset = vec4(0.0);

      ${t(o.occlusionTestEnabled,e`
      bool visible = testHUDVisibility(posProj);
      if (!visible) {
        vtc = vec2(0.0);
        ${t(o.debugDrawLabelBorder,"debugBorderCoords = vec4(0.5, 0.5, 1.5 / combinedSize);")}
        return;
      }`)}
      ${t(b,e`voccluded = visible ? 0.0 : 1.0;`)}
    `);let oe=e`
      vec2 uv01 = floor(uv0);
      vec2 uv = uv0 - uv01;
      quadOffset.xy = (uv01 - anchorPosition) * 2.0 * combinedSize;

      ${t(o.hasRotation,e`
          float angle = radians(materialRotation + rotation);
          float cosAngle = cos(angle);
          float sinAngle = sin(angle);
          mat2 rotate = mat2(cosAngle, -sinAngle, sinAngle,  cosAngle);

          quadOffset.xy = rotate * quadOffset.xy;
        `)}

      quadOffset.xy = (quadOffset.xy + screenOffsetScaled) / viewport.zw * posProj.w;
  `,re=o.pixelSnappingEnabled?s?e`posProj = alignToPixelOrigin(posProj, viewport.zw) + quadOffset;`:e`posProj += quadOffset;
if (inputSize.x == size.x) {
posProj = alignToPixelOrigin(posProj, viewport.zw);
}`:e`posProj += quadOffset;`;a.main.add(e`
    ${oe}
    ${o.vvColor?"vcolor = interpolateVVColor(featureAttribute.y) * materialColor;":"vcolor = color / 255.0 * materialColor;"}

    ${t(c===l.ObjectAndLayerIdColor,e`vcolor.a = 1.0;`)}

    bool alphaDiscard = vcolor.a < ${e.float(u)};
    ${t(s,`alphaDiscard = alphaDiscard && outlineColor.a < ${e.float(u)};`)}
    if (alphaDiscard) {
      // "early discard" if both symbol color (= fill) and outline color (if applicable) are transparent
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
      return;
    } else {
      ${re}
      gl_Position = posProj;
    }

    vtc = uv;

    ${t(o.debugDrawLabelBorder,e`debugBorderCoords = vec4(uv01, 1.5 / combinedSize);`)}
    vsize = inputSize;
  `),n.uniforms.add(new U("tex",i=>i.texture)),o.occludedFragmentFade&&(n.uniforms.add(new M("depthMap",i=>i.mainDepth)),n.uniforms.add(new R("occludedOpacity",i=>i.hudOccludedFragmentOpacity)));let h=o.debugDrawLabelBorder?e`(isBorder > 0.0 ? 0.0 : ${e.float(u)})`:e.float(u),S=e`
    ${t(o.debugDrawLabelBorder,e`float isBorder = float(any(lessThan(debugBorderCoords.xy, debugBorderCoords.zw)) || any(greaterThan(debugBorderCoords.xy, 1.0 - debugBorderCoords.zw)));`)}

    ${t(o.sampleSignedDistanceFieldTexelCenter,e`
      float txSize = float(textureSize(tex, 0).x);
      float texelSize = 1.0 / txSize;

      // Calculate how much we have to add/subtract to/from each texel to reach the size of an onscreen pixel
      vec2 scaleFactor = (vsize - txSize) * texelSize;
      vec2 samplePos = vtc + (vec2(1.0, -1.0) * texelSize) * scaleFactor;`,e`vec2 samplePos = vtc;`)}

    ${s?e`
      vec4 fillPixelColor = vcolor;

      // Get distance and map it into [-0.5, 0.5]
      float d = rgbaTofloat(texture(tex, samplePos)) - 0.5;

      // Distance in output units (i.e. pixels)
      float dist = d * vsize.x;

      // Create smooth transition from the icon into its outline
      float fillAlphaFactor = clamp(0.5 - dist, 0.0, 1.0);
      fillPixelColor.a *= fillAlphaFactor;

      if (outlineSize > 0.25) {
        vec4 outlinePixelColor = outlineColor;
        float clampedOutlineSize = min(outlineSize, 0.5*vsize.x);

        // Create smooth transition around outline
        float outlineAlphaFactor = clamp(0.5 - (abs(dist) - 0.5*clampedOutlineSize), 0.0, 1.0);
        outlinePixelColor.a *= outlineAlphaFactor;

        if (
          outlineAlphaFactor + fillAlphaFactor < ${h} ||
          fillPixelColor.a + outlinePixelColor.a < ${e.float(u)}
        ) {
          discard;
        }

        // perform un-premultiplied over operator (see https://en.wikipedia.org/wiki/Alpha_compositing#Description)
        float compositeAlpha = outlinePixelColor.a + fillPixelColor.a * (1.0 - outlinePixelColor.a);
        vec3 compositeColor = vec3(outlinePixelColor) * outlinePixelColor.a +
          vec3(fillPixelColor) * fillPixelColor.a * (1.0 - outlinePixelColor.a);

        ${t(!d,e`fragColor = vec4(compositeColor, compositeAlpha);`)}
      } else {
        if (fillAlphaFactor < ${h}) {
          discard;
        }

        ${t(!d,e`fragColor = premultiplyAlpha(fillPixelColor);`)}
      }

      // visualize SDF:
      // fragColor = vec4(clamp(-dist/vsize.x*2.0, 0.0, 1.0), clamp(dist/vsize.x*2.0, 0.0, 1.0), 0.0, 1.0);
      `:e`
          vec4 texColor = texture(tex, vtc, -0.5);
          if (texColor.a < ${h}) {
            discard;
          }
          ${t(!d,e`fragColor = texColor * premultiplyAlpha(vcolor);`)}
          `}

    ${t(o.occludedFragmentFade&&!d,e`
        float zSample = texelFetch(depthMap, ivec2(gl_FragCoord.xy), 0).x;
        if (zSample < gl_FragCoord.z) {
          fragColor *= occludedOpacity;
        }
        `)}

    ${t(!d&&o.debugDrawLabelBorder,e`fragColor = mix(fragColor, vec4(1.0, 0.0, 1.0, 1.0), isBorder * 0.5);`)}
  `;switch(c){case l.Color:case l.ColorEmission:r.outputs.add("fragColor","vec4",0),c===l.ColorEmission&&r.outputs.add("fragEmission","vec4",1),P===m.ColorAlpha&&r.outputs.add("fragAlpha","float",c===l.ColorEmission?2:1),n.main.add(e`
        ${S}
        ${t(P===m.FrontFace,e`fragColor.rgb /= fragColor.a;`)}
        ${t(c===l.ColorEmission,e`fragEmission = vec4(0.0);`)}
        ${t(P===m.ColorAlpha,e`fragAlpha = fragColor.a;`)}`);break;case l.ObjectAndLayerIdColor:n.main.add(e`
        ${S}
        outputObjectAndLayerIdColor();`);break;case l.Highlight:r.include(k,o),n.main.add(e`
        ${S}
        outputHighlight(${t(b,e`voccluded == 1.0`,e`false`)});`)}return r}function Y(o){return o.outlineColor[3]>0&&o.outlineSize>0}function ee(o){return o.textureIsSignedDistanceField?te(o.anchorPosition,o.distanceFieldBoundingBox,x):T(x,o.anchorPosition),x}function te(o,r,s){j(s,o[0]*(r[2]-r[0])+r[0],o[1]*(r[3]-r[1])+r[1])}var x=F(),_e=Object.freeze(Object.defineProperty({__proto__:null,build:ie,calculateAnchorPosition:ee},Symbol.toStringTag,{value:"Module"}));export{ie as a,ee as b,_e as c};
