import{d as S,e as $,f as N,g as z,h as j,i as Z}from"./chunk-KRE5JNQN.js";import{b as k,c as q,d as J,e as K}from"./chunk-WKFWO47P.js";import{c as Q,d as X}from"./chunk-BHGFQO2D.js";import{e as f,f as L,g as U,h as W,j as H}from"./chunk-VOJIMLDZ.js";import{a as I}from"./chunk-CUV3BSEW.js";import{a as A,e as M,f as E}from"./chunk-WPMNZVYJ.js";import{b as P,h as _}from"./chunk-7VWXQFPJ.js";import{d as B}from"./chunk-XXQKBDTN.js";import{a as R}from"./chunk-6DKBN3BZ.js";import{b as Y}from"./chunk-OTUHXNWB.js";import{b as T}from"./chunk-NBT2WTKD.js";import{a as D}from"./chunk-JLLOI4DS.js";import{a as p,b as F}from"./chunk-4MZNR6MW.js";import{a as V}from"./chunk-GVSOJUIP.js";import{a as v}from"./chunk-HUUJBVXR.js";import{a as O}from"./chunk-4LDVFWME.js";import{a as G}from"./chunk-DHLVTH5U.js";import{e as y}from"./chunk-MEGSPQVO.js";import{h as c}from"./chunk-3AS27HNO.js";import{a as m}from"./chunk-T7PUQGWM.js";import{a as i,b as t}from"./chunk-47NSYSFY.js";import{a as w}from"./chunk-RWCIDBNQ.js";function io(o){let a=new G,{vertex:l,fragment:e,varyings:s}=a,{output:u,offsetBackfaces:g,instancedColor:h,pbrMode:x,snowCover:d,spherical:b}=o,C=x===f.Normal||x===f.Schematic;if(F(l,o),a.include(A),s.add("vpos","vec3"),a.include(R,o),a.include($,o),a.include(B,o),a.include(Y,o),c(u)&&(p(a.vertex,o),a.include(y,o),a.include(E,o),g&&a.include(S),h&&a.attributes.add(w.INSTANCECOLOR,"vec4"),s.add("vNormalWorld","vec3"),s.add("localvpos","vec3"),a.include(P,o),a.include(M,o),a.include(N,o),a.include(I,o),l.uniforms.add(new V("externalColor",n=>n.externalColor)),s.add("vcolorExt","vec4"),l.main.add(i`
      forwardNormalizedVertexColor();
      vcolorExt = externalColor;
      ${t(h,"vcolorExt *= instanceColor * 0.003921568627451;")}
      vcolorExt *= vvColor();
      vcolorExt *= getSymbolColor();
      forwardColorMixMode();

      bool alphaCut = vcolorExt.a < ${i.float(T)};
      vpos = getVertexInLocalOriginSpace();
      localvpos = vpos - view[3].xyz;
      vpos = subtractOrigin(vpos);
      vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
      vpos = addVerticalOffset(vpos, localOrigin);
      vec4 basePosition = transformPosition(proj, view, vpos);

      forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
      forwardLinearDepth();
      forwardTextureCoordinates();

      gl_Position = alphaCut ? vec4(1e38, 1e38, 1e38, 1.0) :
      ${t(g,"offsetBackfacingClipPosition(basePosition, vpos, vNormalWorld, cameraPosition);","basePosition;")}
    `)),c(u)){let{hasColorTexture:n,hasColorTextureTransform:oo,receiveShadows:ao}=o;a.include(K,o),a.include(k,o),a.include(z,o),a.include(o.instancedDoublePrecision?Q:X,o),a.fragment.include(D,o),a.include(_,o),p(a.fragment,o),U(e),q(e),J(e),e.uniforms.add(l.uniforms.get("localOrigin"),l.uniforms.get("view"),new m("ambient",r=>r.ambient),new m("diffuse",r=>r.diffuse),new v("opacity",r=>r.opacity),new v("layerOpacity",r=>r.layerOpacity)),n&&e.uniforms.add(new O("tex",r=>r.texture)),a.include(L,o),a.include(H,o),e.include(Z),W(e),e.main.add(i`
      discardBySlice(vpos);
      discardByTerrainDepth();
      vec4 texColor = ${n?`texture(tex, ${oo?"colorUV":"vuv0"})`:" vec4(1.0)"};
      ${t(n,`${t(o.textureAlphaPremultiplied,"texColor.rgb /= texColor.a;")}
        discardOrAdjustAlpha(texColor);`)}
      vec3 viewDirection = normalize(vpos - cameraPosition);
      applyPBRFactors();
      float ssao = evaluateAmbientOcclusionInverse();
      ssao *= getBakedOcclusion();

      float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
      vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
      float shadow = ${ao?"max(lightingGlobalFactor * (1.0 - additionalAmbientScale), readShadowMap(vpos, linearDepth))":b?"lightingGlobalFactor * (1.0 - additionalAmbientScale)":"0.0"};
      vec3 matColor = max(ambient, diffuse);
      ${o.hasVertexColors?i`vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
             float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:i`vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
             float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
      ${t(d,"albedo = mix(albedo, vec3(1), 0.9);")}
      ${i`vec3 shadingNormal = normalize(vNormalWorld);
             albedo *= 1.2;
             vec3 viewForward = vec3(view[0][2], view[1][2], view[2][2]);
             float alignmentLightView = clamp(dot(viewForward, -mainLightDirection), 0.0, 1.0);
             float transmittance = 1.0 - clamp(dot(viewForward, shadingNormal), 0.0, 1.0);
             float treeRadialFalloff = vColor.r;
             float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
             additionalLight += backLightFactor * mainLightIntensity;`}
      ${t(C,`vec3 normalGround = ${b?"normalize(vpos + localOrigin)":"vec3(0.0, 0.0, 1.0)"};`)}
      ${C?i`float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
                 ${t(d,i`mrr = vec3(0.0, 1.0, 0.04);`)}
            vec4 emission = ${d?"vec4(0.0)":"getEmissions()"};
            vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:i`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
      vec4 finalColor = vec4(shadedColor, opacity_);
      outputColorHighlightOID(finalColor, vpos);`)}return a.include(j,o),a}var Ro=Object.freeze(Object.defineProperty({__proto__:null,build:io},Symbol.toStringTag,{value:"Module"}));export{io as a,Ro as b};
