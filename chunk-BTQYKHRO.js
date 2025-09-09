import{a as O,c as j}from"./chunk-M7JJUQ72.js";import{a as p}from"./chunk-MH7FV4OG.js";import{b as M,d as W}from"./chunk-BHGFQO2D.js";import{e as D,g as z,h as I}from"./chunk-VOJIMLDZ.js";import{e as y,f as N}from"./chunk-WPMNZVYJ.js";import{h as U}from"./chunk-7VWXQFPJ.js";import{a as C}from"./chunk-WDRWH4L7.js";import{b as L,c as A}from"./chunk-OTUHXNWB.js";import{a as E,b as n}from"./chunk-NBT2WTKD.js";import{a as l}from"./chunk-JLLOI4DS.js";import{a as b,b as S}from"./chunk-4MZNR6MW.js";import{a as v}from"./chunk-GVSOJUIP.js";import{a as T}from"./chunk-WOZSH7YY.js";import{a as f}from"./chunk-HUUJBVXR.js";import{a as u}from"./chunk-4LDVFWME.js";import{a as F}from"./chunk-DHLVTH5U.js";import{a as s,h as c}from"./chunk-3AS27HNO.js";import{a}from"./chunk-47NSYSFY.js";import{a as d}from"./chunk-RWCIDBNQ.js";import{a as h}from"./chunk-2FO7ARYZ.js";import{b as P}from"./chunk-QXXXCEV5.js";import{a as x}from"./chunk-PTZYZULI.js";import{b as _}from"./chunk-KZKWOEFD.js";function g(o){o.fragment.uniforms.add(new u("texWaveNormal",e=>e.waveNormal),new u("texWavePerturbation",e=>e.wavePerturbation),new v("waveParams",e=>_(R,e.waveStrength,e.waveTextureRepeat,e.flowStrength,e.flowOffset)),new T("waveDirection",e=>P(H,e.waveDirection[0]*e.waveVelocity,e.waveDirection[1]*e.waveVelocity))),o.include(O),o.fragment.code.add(a`const vec2  FLOW_JUMP = vec2(6.0/25.0, 5.0/24.0);
vec2 textureDenormalized2D(sampler2D _tex, vec2 _uv) {
return 2.0 * texture(_tex, _uv).rg - 1.0;
}
float sampleNoiseTexture(vec2 _uv) {
return texture(texWavePerturbation, _uv).b;
}
vec3 textureDenormalized3D(sampler2D _tex, vec2 _uv) {
return 2.0 * texture(_tex, _uv).rgb - 1.0;
}
float computeProgress(vec2 uv, float time) {
return fract(time);
}
float computeWeight(vec2 uv, float time) {
float progress = computeProgress(uv, time);
return 1.0 - abs(1.0 - 2.0 * progress);
}
vec3 computeUVPerturbedWeigth(sampler2D texFlow, vec2 uv, float time, float phaseOffset) {
float flowStrength = waveParams[2];
float flowOffset = waveParams[3];
vec2 flowVector = textureDenormalized2D(texFlow, uv) * flowStrength;
float progress = computeProgress(uv, time + phaseOffset);
float weight = computeWeight(uv, time + phaseOffset);
vec2 result = uv;
result -= flowVector * (progress + flowOffset);
result += phaseOffset;
result += (time - progress) * FLOW_JUMP;
return vec3(result, weight);
}
const float TIME_NOISE_TEXTURE_REPEAT = 0.3737;
const float TIME_NOISE_STRENGTH = 7.77;
vec3 getWaveLayer(sampler2D _texNormal, sampler2D _dudv, vec2 _uv, vec2 _waveDir, float time) {
float waveStrength = waveParams[0];
vec2 waveMovement = time * -_waveDir;
float timeNoise = sampleNoiseTexture(_uv * TIME_NOISE_TEXTURE_REPEAT) * TIME_NOISE_STRENGTH;
vec3 uv_A = computeUVPerturbedWeigth(_dudv, _uv + waveMovement, time + timeNoise, 0.0);
vec3 uv_B = computeUVPerturbedWeigth(_dudv, _uv + waveMovement, time + timeNoise, 0.5);
vec3 normal_A = textureDenormalized3D(_texNormal, uv_A.xy) * uv_A.z;
vec3 normal_B = textureDenormalized3D(_texNormal, uv_B.xy) * uv_B.z;
vec3 mixNormal = normalize(normal_A + normal_B);
mixNormal.xy *= waveStrength;
mixNormal.z = sqrt(1.0 - dot(mixNormal.xy, mixNormal.xy));
return mixNormal;
}
vec4 getSurfaceNormalAndFoam(vec2 _uv, float _time) {
float waveTextureRepeat = waveParams[1];
vec3 normal = getWaveLayer(texWaveNormal, texWavePerturbation, _uv * waveTextureRepeat, waveDirection, _time);
float foam  = normals2FoamIntensity(normal, waveParams[0]);
return vec4(normal, foam);
}`)}var R=x(),H=h();function $(o){let e=new F,{vertex:r,fragment:t}=e,{output:w,draped:B,receiveShadows:V}=o;S(r,o),e.include(N,o),e.attributes.add(d.POSITION,"vec3"),e.attributes.add(d.UV0,"vec2");let i=new v("waterColor",m=>m.color);if(c(w)&&B)return e.varyings.add("vpos","vec3"),r.uniforms.add(i),r.main.add(a`
      if (waterColor.a < ${a.float(n)}) {
        // Discard this vertex
        gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
        return;
      }

      vpos = position;
      gl_Position = transformPosition(proj, view, vpos);`),t.uniforms.add(i),t.main.add(a`fragColor = waterColor;`),e;switch(c(w)&&(e.include(p,o),e.include(y,o),e.varyings.add("vuv","vec2"),e.varyings.add("vpos","vec3"),e.varyings.add("vnormal","vec3"),e.varyings.add("vtbnMatrix","mat3"),r.uniforms.add(i),r.main.add(a`
      if (waterColor.a < ${a.float(n)}) {
        // Discard this vertex
        gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
        return;
      }

      vuv = uv0;
      vpos = position;

      vnormal = getLocalUp(vpos, localOrigin);
      vtbnMatrix = getTBNMatrix(vnormal);
      forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);

      gl_Position = transformPosition(proj, view, vpos);
      forwardLinearDepth();`)),e.include(L,o),o.output){case s.Color:case s.ColorEmission:e.include(M,{pbrMode:D.Disabled,lightingSphericalHarmonicsOrder:2}),e.include(g),e.include(W,o),e.include(j,o),e.fragment.include(l,o),e.include(U,o),t.include(A),b(t,o),z(t),I(t),t.uniforms.add(i,new f("timeElapsed",({timeElapsed:m})=>m),r.uniforms.get("view"),r.uniforms.get("localOrigin")).main.add(a`
        discardBySlice(vpos);
        discardByTerrainDepth();
        vec3 localUp = vnormal;
        // the created normal is in tangent space
        vec4 tangentNormalFoam = getSurfaceNormalAndFoam(vuv, timeElapsed);

        // we rotate the normal according to the tangent-bitangent-normal-Matrix
        vec3 n = normalize(vtbnMatrix * tangentNormalFoam.xyz);
        vec3 v = -normalize(vpos - cameraPosition);
        float shadow = ${V?a`1.0 - readShadowMap(vpos, linearDepth)`:"1.0"};
        vec4 vPosView = view * vec4(vpos, 1.0);
        vec4 final = vec4(getSeaColor(n, v, mainLightDirection, waterColor.rgb, mainLightIntensity, localUp, shadow, tangentNormalFoam.w, vPosView.xyz, vpos + localOrigin), waterColor.w);

        // gamma correction
        fragColor = delinearizeGamma(final);
        outputColorHighlightOID(fragColor, vpos);`);break;case s.Normal:e.include(p,o),e.include(g,o),e.fragment.include(l,o),e.varyings.add("vpos","vec3"),e.varyings.add("vuv","vec2"),r.uniforms.add(i),r.main.add(a`
        if (waterColor.a < ${a.float(n)}) {
          // Discard this vertex
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          return;
        }

        vuv = uv0;
        vpos = position;

        gl_Position = transformPosition(proj, view, vpos);`),t.uniforms.add(new f("timeElapsed",({timeElapsed:m})=>m)).main.add(a`discardBySlice(vpos);
vec4 tangentNormalFoam = getSurfaceNormalAndFoam(vuv, timeElapsed);
tangentNormalFoam.xyz = normalize(tangentNormalFoam.xyz);
fragColor = vec4((tangentNormalFoam.xyz + vec3(1.0)) * 0.5, tangentNormalFoam.w);`);break;case s.Highlight:e.include(E,o),e.varyings.add("vpos","vec3"),r.uniforms.add(i),r.main.add(a`
        if (waterColor.a < ${a.float(n)}) {
          // Discard this vertex
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          return;
        }

        vpos = position;
        gl_Position = transformPosition(proj, view, vpos);`),e.fragment.include(l,o),t.main.add(a`discardBySlice(vpos);
calculateOcclusionAndOutputHighlight();`);break;case s.ObjectAndLayerIdColor:e.include(C,o),e.varyings.add("vpos","vec3"),r.uniforms.add(i),r.main.add(a`
        if (waterColor.a < ${a.float(n)}) {
          // Discard this vertex
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          return;
        }

        vpos = position;
        gl_Position = transformPosition(proj, view, vpos);
        forwardObjectAndLayerIdColor();`),e.fragment.include(l,o),t.main.add(a`discardBySlice(vpos);
outputObjectAndLayerIdColor();`)}return e}var Se=Object.freeze(Object.defineProperty({__proto__:null,build:$},Symbol.toStringTag,{value:"Module"}));export{$ as a,Se as b};
