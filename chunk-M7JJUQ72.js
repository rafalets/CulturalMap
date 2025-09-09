import{g as oe,h as re,k as ae}from"./chunk-VOJIMLDZ.js";import{a as T}from"./chunk-O2J7LFYY.js";import{a as z}from"./chunk-GWSX6PRO.js";import{a as M}from"./chunk-ELCBU4NP.js";import{a as c}from"./chunk-B2RVSTL3.js";import{a as te}from"./chunk-A5S42OSQ.js";import{a as ee}from"./chunk-F6TN7E7K.js";import{a as u}from"./chunk-SOEEM7Z7.js";import{a as X}from"./chunk-44A27HB7.js";import{a as i}from"./chunk-47NSYSFY.js";import{a as K}from"./chunk-QXNVQZT7.js";import{a as J,c as k}from"./chunk-HE4N5PN6.js";import{a as Y,d as A}from"./chunk-ALWV3RJ2.js";import{a as V,b as h,e as W,m as q,q as Q,t as $}from"./chunk-5WKDXHVH.js";import{j as E}from"./chunk-7B2UKJ5N.js";import{a as m}from"./chunk-WNSGKHQ6.js";import{f as N}from"./chunk-RJWOVI3M.js";import{a as R,c as _}from"./chunk-NHSDW26F.js";import{a as F}from"./chunk-WKJJQIBC.js";import{b as G}from"./chunk-VOFKUGRY.js";import{a as y}from"./chunk-ARRCN5K3.js";import{f as p}from"./chunk-7EG726PT.js";import{d}from"./chunk-C7INQGWT.js";import{H as l}from"./chunk-WMHJC7XF.js";import{a as n}from"./chunk-QGVBCWUY.js";function be(e){e.fragment.code.add(i`float normals2FoamIntensity(vec3 n, float waveStrength){
float normalizationFactor =  max(0.015, waveStrength);
return max((n.x + n.y)*0.3303545/normalizationFactor + 0.3303545, 0.0);
}`)}function ie(e){e.fragment.code.add(i`vec3 foamIntensity2FoamColor(float foamIntensityExternal, float foamPixelIntensity, vec3 skyZenitColor, float dayMod){
return foamIntensityExternal * (0.075 * skyZenitColor * pow(foamPixelIntensity, 4.) +  50.* pow(foamPixelIntensity, 23.0)) * dayMod;
}`)}function ne(e){e.fragment.code.add(i`
    const float GAMMA = ${i.float(N)};
    const float INV_GAMMA = ${i.float(1/N)};

    vec4 delinearizeGamma(vec4 color) {
      return vec4(pow(color.rgb, vec3(INV_GAMMA)), color.a);
    }

    vec3 linearizeGamma(vec3 color) {
      return pow(color, vec3(GAMMA));
    }
  `)}function se(e,o){if(!o.screenSpaceReflections)return;let t=e.fragment;t.include(te),t.uniforms.add(new ee("nearFar",a=>a.camera.nearFar),new M("depthMap",a=>a.depth?.attachment),new u("proj",a=>a.camera.projectionMatrix),new c("invResolutionHeight",a=>1/a.camera.height),new u("reprojectionMatrix",a=>a.ssr.reprojectionMatrix)).code.add(i`
  vec2 reprojectionCoordinate(vec3 projectionCoordinate)
  {
    vec4 zw = proj * vec4(0.0, 0.0, -projectionCoordinate.z, 1.0);
    vec4 reprojectedCoord = reprojectionMatrix * vec4(zw.w * (projectionCoordinate.xy * 2.0 - 1.0), zw.z, zw.w);
    reprojectedCoord.xy /= reprojectedCoord.w;
    return reprojectedCoord.xy * 0.5 + 0.5;
  }

  const int maxSteps = ${o.highStepCount?"150":"75"};

  vec4 applyProjectionMat(mat4 projectionMat, vec3 x)
  {
    vec4 projectedCoord =  projectionMat * vec4(x, 1.0);
    projectedCoord.xy /= projectedCoord.w;
    projectedCoord.xy = projectedCoord.xy*0.5 + 0.5;
    return projectedCoord;
  }

  vec3 screenSpaceIntersection(vec3 dir, vec3 startPosition, vec3 viewDir, vec3 normal)
  {
    vec3 viewPos = startPosition;
    vec3 viewPosEnd = startPosition;

    // Project the start position to the screen
    vec4 projectedCoordStart = applyProjectionMat(proj, viewPos);
    vec3  Q0 = viewPos / projectedCoordStart.w; // homogeneous camera space
    float k0 = 1.0/ projectedCoordStart.w;

    // advance the position in the direction of the reflection
    viewPos += dir;

    vec4 projectedCoordVanishingPoint = applyProjectionMat(proj, dir);

    // Project the advanced position to the screen
    vec4 projectedCoordEnd = applyProjectionMat(proj, viewPos);
    vec3  Q1 = viewPos / projectedCoordEnd.w; // homogeneous camera space
    float k1 = 1.0/ projectedCoordEnd.w;

    // calculate the reflection direction in the screen space
    vec2 projectedCoordDir = (projectedCoordEnd.xy - projectedCoordStart.xy);
    vec2 projectedCoordDistVanishingPoint = (projectedCoordVanishingPoint.xy - projectedCoordStart.xy);

    float yMod = min(abs(projectedCoordDistVanishingPoint.y), 1.0);

    float projectedCoordDirLength = length(projectedCoordDir);
    float maxSt = float(maxSteps);

    // normalize the projection direction depending on maximum steps
    // this determines how blocky the reflection looks
    vec2 dP = yMod * (projectedCoordDir)/(maxSt * projectedCoordDirLength);

    // Normalize the homogeneous camera space coordinates
    vec3  dQ = yMod * (Q1 - Q0)/(maxSt * projectedCoordDirLength);
    float dk = yMod * (k1 - k0)/(maxSt * projectedCoordDirLength);

    // initialize the variables for ray marching
    vec2 P = projectedCoordStart.xy;
    vec3 Q = Q0;
    float k = k0;
    float rayStartZ = -startPosition.z; // estimated ray start depth value
    float rayEndZ = -startPosition.z;   // estimated ray end depth value
    float prevEstimateZ = -startPosition.z;
    float rayDiffZ = 0.0;
    float dDepth;
    float depth;
    float rayDiffZOld = 0.0;

    // early outs
    if (dot(normal, dir) < 0.0 || dot(-viewDir, normal) < 0.0)
      return vec3(P, 0.0);
    float dDepthBefore = 0.0;

    for(int i = 0; i < maxSteps-1; i++)
    {
      depth = -linearDepthFromTexture(depthMap, P); // get linear depth from the depth buffer

      // estimate depth of the marching ray
      rayStartZ = prevEstimateZ;
      dDepth = -rayStartZ - depth;
      rayEndZ = (dQ.z * 0.5 + Q.z)/ ((dk * 0.5 + k));
      rayDiffZ = rayEndZ- rayStartZ;
      prevEstimateZ = rayEndZ;

      if(-rayEndZ > nearFar[1] || -rayEndZ < nearFar[0] || P.y < 0.0  || P.y > 1.0 )
      {
        return vec3(P, 0.);
      }

      // If we detect a hit - return the intersection point, two conditions:
      //  - dDepth > 0.0 - sampled point depth is in front of estimated depth
      //  - if difference between dDepth and rayDiffZOld is not too large
      //  - if difference between dDepth and 0.025/abs(k) is not too large
      //  - if the sampled depth is not behind far plane or in front of near plane

      if((dDepth) < 0.025/abs(k) + abs(rayDiffZ) && dDepth > 0.0 && depth > nearFar[0] && depth < nearFar[1] && abs(P.y - projectedCoordStart.y) > invResolutionHeight)
      {
        float weight = dDepth / (dDepth - dDepthBefore);
        vec2 Pf = mix(P - dP, P, 1.0 - weight);
        if (abs(Pf.y - projectedCoordStart.y) > invResolutionHeight) {
          return vec3(Pf, depth);
        }
        else {
          return vec3(P, depth);
        }
      }

      // continue with ray marching
      P = clamp(P + dP, vec2(0.0), vec2(0.999));
      Q.z += dQ.z;
      k += dk;
      rayDiffZOld = rayDiffZ;
      dDepthBefore = dDepth;
    }
    return vec3(P, 0.0);
  }
  `)}var f,C;function de(e){return e!=null&&!e.running}(function(e){e[e.Idle=0]="Idle",e[e.Rendering=1]="Rendering",e[e.Ready=2]="Ready",e[e.Fading=3]="Fading"})(f||(f={})),function(e){e[e.RG=0]="RG",e[e.BA=1]="BA",e[e.COUNT=2]="COUNT"}(C||(C={}));var H,S=H=class extends p{constructor(e){super(e),this.type="cloudy",this.cloudCover=.5}clone(){return new H({cloudCover:this.cloudCover})}};n([m({cloudy:"cloudy"}),d({json:{write:{isRequired:!0}}})],S.prototype,"type",void 0),n([d({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],S.prototype,"cloudCover",void 0),S=H=n([l("esri.views.3d.environment.CloudyWeather")],S);var ce=S;var L,P=L=class extends p{constructor(e){super(e),this.type="foggy",this.fogStrength=.5}clone(){return new L({fogStrength:this.fogStrength})}};n([m({foggy:"foggy"}),d({json:{write:{isRequired:!0}}})],P.prototype,"type",void 0),n([d({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],P.prototype,"fogStrength",void 0),P=L=n([l("esri.views.3d.environment.FoggyWeather")],P);var le=P;var O,w=O=class extends p{constructor(e){super(e),this.type="rainy",this.cloudCover=.5,this.precipitation=.5}clone(){return new O({cloudCover:this.cloudCover,precipitation:this.precipitation})}};n([m({rainy:"rainy"}),d({json:{write:{isRequired:!0}}})],w.prototype,"type",void 0),n([d({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],w.prototype,"cloudCover",void 0),n([d({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],w.prototype,"precipitation",void 0),w=O=n([l("esri.views.3d.environment.RainyWeather")],w);var pe=w;var U,v=U=class extends p{constructor(e){super(e),this.type="snowy",this.cloudCover=.5,this.precipitation=.5,this.snowCover="disabled"}clone(){return new U({cloudCover:this.cloudCover,precipitation:this.precipitation,snowCover:this.snowCover})}};n([m({snowy:"snowy"}),d({json:{write:{isRequired:!0}}})],v.prototype,"type",void 0),n([d({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],v.prototype,"cloudCover",void 0),n([d({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],v.prototype,"precipitation",void 0),n([d({type:["enabled","disabled"],nonNullable:!0,json:{write:!0}})],v.prototype,"snowCover",void 0),v=U=n([l("esri.views.3d.environment.SnowyWeather")],v);var me=v;var B,D=B=class extends p{constructor(e){super(e),this.type="sunny",this.cloudCover=.5}clone(){return new B({cloudCover:this.cloudCover})}};n([m({sunny:"sunny"}),d({json:{write:{isRequired:!0}}})],D.prototype,"type",void 0),n([d({type:Number,nonNullable:!0,range:{min:0,max:1},json:{write:!0}})],D.prototype,"cloudCover",void 0),D=B=n([l("esri.views.3d.environment.SunnyWeather")],D);var Z=D;var we={key:"type",base:Z,typeMap:{sunny:Z,cloudy:ce,rainy:pe,snowy:me,foggy:le}},Gt=Object.keys(we.typeMap);var j=1e4,fe=1e5;var he=class{constructor(){this.startTime=0,this._data=F(null),this._readChannels=C.RG,this.parallax=new b,this.parallaxNew=new b,this._anchorPoint=R(),this._fadeState=F(r.HIDE),this._fadeFactor=F(1)}get data(){return this._data.value}set data(o){this._data.value=o}get readChannels(){return this._readChannels}get fadeState(){return this._fadeState.value}get fadeFactor(){return this._fadeFactor.value}get opacity(){switch(this.fadeState){case r.HIDE:return 0;case r.FADE_OUT:return 1-this.fadeFactor;case r.FADE_IN:return this.fadeFactor;case r.SHOW:case r.CROSS_FADE:return 1}}fade(o,t,a){this.isFading&&this.fadeFactor<1&&(this._fadeFactor.value=a?G((t-this.startTime)/(xe*a),0,1):1,this.fadeFactor===1&&this._endFade()),this._evaluateState(o,t),this._updateParallax(o)}_evaluateState(o,t){let a=o.relativeElevation,x=this._updateAnchorPoint(o);(a>1.7*j||a<-1e4||x>ve)&&this.opacity>0?this._startFade(r.HIDE,t):this.isFading||(a>j||a<-.35*j||x>Se*ve?this.opacity>0&&this._startFade(r.FADE_OUT,t):de(this.data)&&(this.opacity===0?this._startFade(r.FADE_IN,t):this.data.state===f.Ready&&(this.fadeState===r.SHOW?this._startFade(r.CROSS_FADE,t):this._startFade(r.SHOW,t))))}_updateParallax(o){let t=Q(o.eye);this.parallax.radiusCurvatureCorrection=.84*Math.sqrt(Math.max(t-y.radius*y.radius,0))/Math.sqrt(t),k(ue,this.parallax.anchorPoint,g),E(this.parallax.transform,A,g[3],g),k(ue,this.parallaxNew.anchorPoint,g),E(this.parallaxNew.transform,A,g[3],g)}_updateAnchorPoint(o){return $(this._anchorPoint,o.eye),q(this._anchorPoint,this._anchorPoint,y.radius),this.fadeState===r.HIDE&&this.data?.state===f.Ready?(h(this.parallax.anchorPoint,this._anchorPoint),0):V(W(ge,this.parallax.anchorPoint,this._anchorPoint))}requestFade(){this._fadeFactor.value=0}_startFade(o,t){switch(this._fadeState.value=o,this.startTime=t,o){case r.CROSS_FADE:this.requestFade(),this._switchReadChannels(),h(this.parallaxNew.anchorPoint,this._anchorPoint);break;case r.FADE_IN:this.requestFade(),this._switchReadChannels(),h(this.parallax.anchorPoint,this._anchorPoint),h(this.parallaxNew.anchorPoint,this._anchorPoint);break;case r.FADE_OUT:this.requestFade();break;case r.SHOW:this._switchReadChannels(),h(this.parallax.anchorPoint,this._anchorPoint),h(this.parallaxNew.anchorPoint,this._anchorPoint),this._endFade();break;case r.HIDE:this._endFade()}}_endFade(){switch(this._fadeFactor.value=1,this.data&&this.data.state!==f.Ready&&(this.data.state=f.Idle),this.fadeState){case r.CROSS_FADE:h(this.parallax.anchorPoint,this.parallaxNew.anchorPoint),this._fadeState.value=r.SHOW;break;case r.FADE_IN:this._fadeState.value=r.SHOW;break;case r.FADE_OUT:this._fadeState.value=r.HIDE;break;case r.SHOW:case r.HIDE:break;default:this.fadeState}}_switchReadChannels(){this.data?.state===f.Ready&&(this._readChannels=1-this._readChannels,this.data.state=f.Fading)}get isFading(){return this.fadeState===r.FADE_OUT||this.fadeState===r.FADE_IN||this.fadeState===r.CROSS_FADE}},r;(function(e){e[e.HIDE=0]="HIDE",e[e.FADE_IN=1]="FADE_IN",e[e.SHOW=2]="SHOW",e[e.CROSS_FADE=3]="CROSS_FADE",e[e.FADE_OUT=4]="FADE_OUT"})(r||(r={}));var b=class{constructor(){this.anchorPoint=R(),this.radiusCurvatureCorrection=0,this.transform=Y()}},ue=_(0,0,1),g=J(),ge=R(),xe=1.25,Se=.5,ve=2e5;var I=class extends X{constructor(o,t){super(o,"samplerCube",K.Bind,(a,x)=>a.bindTexture(o,t(x)))}};function ye(e){let o=e.fragment;o.constants.add("radiusCloudsSquared","float",Pe).code.add(i`vec3 intersectWithCloudLayer(vec3 dir, vec3 cameraPosition, vec3 spherePos) {
float B = 2.0 * dot(cameraPosition, dir);
float C = dot(cameraPosition, cameraPosition) - radiusCloudsSquared;
float det = B * B - 4.0 * C;
float pointIntDist = max(0.0, 0.5 *(-B + sqrt(det)));
return (cameraPosition + dir * pointIntDist) - spherePos;
}`),o.uniforms.add(new c("radiusCurvatureCorrection",({clouds:s})=>s.parallax.radiusCurvatureCorrection)).code.add(i`vec3 correctForPlanetCurvature(vec3 dir) {
dir.z = dir.z * (1.0 - radiusCurvatureCorrection) + radiusCurvatureCorrection;
return dir;
}`),o.code.add(i`vec3 rotateDirectionToAnchorPoint(mat4 rotMat, vec3 inVec) {
return (rotMat * vec4(inVec, 0.0)).xyz;
}`),oe(o),re(o);let t=_(.28,.175,.035);o.constants.add("RIM_COLOR","vec3",t),o.code.add(i`
    vec3 calculateCloudColor(vec3 cameraPosition, vec3 worldSpaceRay, vec4 clouds) {
      float upDotLight = dot(cameraPosition, mainLightDirection);
      float dirDotLight = max(dot(worldSpaceRay, mainLightDirection), 0.0);
      float sunsetTransition = clamp(pow(max(upDotLight, 0.0), ${i.float(.3)}), 0.0, 1.0);

      // Base color of the clouds that depends on lighting of the sun and sky
      vec3 ambientLight = calculateAmbientIrradiance(cameraPosition,  0.0);
      vec3 combinedLight = clamp((mainLightIntensity + ambientLight )/PI, vec3(0.0), vec3(1.0));
      vec3 baseCloudColor = pow(combinedLight * pow(clouds.xyz, vec3(GAMMA)), vec3(INV_GAMMA));

      // Rim light around the edge of the clouds simulating scattering of the direct lun light
      float scatteringMod = max(clouds.a < 0.5 ? clouds.a / 0.5 : - clouds.a / 0.5 + 2.0, 0.0);
      float rimLightIntensity = 0.5 + 0.5 * pow(max(upDotLight, 0.0), 0.35);
      vec3 directSunScattering = RIM_COLOR * rimLightIntensity * (pow(dirDotLight, ${i.float(140)})) * scatteringMod;

      // Brighten the clouds around the sun at the sunsets
      float additionalLight = ${i.float(.2)} * pow(dirDotLight, ${i.float(10)}) * (1. - pow(sunsetTransition, ${i.float(.3)})) ;

      return vec3(baseCloudColor * (1.0 + additionalLight) + directSunScattering);
    }
  `),o.uniforms.add(new T("readChannelsRG",s=>s.clouds.readChannels===C.RG),new I("cubeMap",s=>s.clouds.data?.cubeMap?.colorTexture??null)).code.add(i`vec4 sampleCloud(vec3 rayDir, bool readOtherChannel) {
vec4 s = texture(cubeMap, rayDir);
bool readRG = readChannelsRG ^^ readOtherChannel;
s = readRG ? vec4(vec3(s.r), s.g) : vec4(vec3(s.b), s.a);
return length(s) == 0.0 ? vec4(s.rgb, 1.0) : s;
}`),o.uniforms.add(new z("anchorPoint",s=>s.clouds.parallax.anchorPoint),new z("anchorPointNew",s=>s.clouds.parallaxNew.anchorPoint),new u("rotationClouds",s=>s.clouds.parallax.transform),new u("rotationCloudsNew",s=>s.clouds.parallaxNew.transform),new c("cloudsOpacity",s=>s.clouds.opacity),new c("fadeFactor",s=>s.clouds.fadeFactor),new T("crossFade",s=>s.clouds.fadeState===r.CROSS_FADE)).code.add(i`vec4 renderClouds(vec3 worldRay, vec3 cameraPosition) {
vec3 intersectionPoint = intersectWithCloudLayer(worldRay, cameraPosition, anchorPoint);
vec3 worldRayRotated = rotateDirectionToAnchorPoint(rotationClouds, normalize(intersectionPoint));
vec3 worldRayRotatedCorrected = correctForPlanetCurvature(worldRayRotated);
vec4 cloudData = sampleCloud(worldRayRotatedCorrected, crossFade);
vec3 cameraPositionN = normalize(cameraPosition);
vec4 cloudColor = vec4(calculateCloudColor(cameraPositionN, worldRay, cloudData), cloudData.a);
if(crossFade) {
intersectionPoint = intersectWithCloudLayer(worldRay, cameraPosition, anchorPointNew);
worldRayRotated = rotateDirectionToAnchorPoint(rotationCloudsNew, normalize(intersectionPoint));
worldRayRotatedCorrected = correctForPlanetCurvature(worldRayRotated);
cloudData = sampleCloud(worldRayRotatedCorrected, false);
vec4 cloudColorNew = vec4(calculateCloudColor(cameraPositionN, worldRay, cloudData), cloudData.a);
cloudColor = mix(cloudColor, cloudColorNew, fadeFactor);
}
float totalTransmittance = length(cloudColor.rgb) == 0.0 ?
1.0 :
clamp(cloudColor.a * cloudsOpacity + (1.0 - cloudsOpacity), 0.0 , 1.0);
return vec4(cloudColor.rgb, totalTransmittance);
}`)}var Pe=(y.radius+fe)**2;function Ce(e){e.code.add(i`vec3 tonemapACES(vec3 x) {
return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}`)}function zo(e,o){e.include(ae,o),e.include(ne),e.include(ie),o.cloudReflections&&e.include(ye),e.include(se,o);let t=e.fragment;t.include(Ce),t.constants.add("fresnelSky","vec3",[.02,1,15]),t.constants.add("fresnelMaterial","vec2",[.02,.1]),t.constants.add("roughness","float",.015),t.constants.add("foamIntensityExternal","float",1.7),t.constants.add("ssrIntensity","float",.65),t.constants.add("ssrHeightFadeStart","float",3e5),t.constants.add("ssrHeightFadeEnd","float",5e5),t.constants.add("waterDiffusion","float",.92),t.constants.add("waterSeaColorMod","float",.8),t.constants.add("correctionViewingPowerFactor","float",.4),t.constants.add("skyZenitColor","vec3",[.52,.68,.9]),t.constants.add("skyColor","vec3",[.67,.79,.9]),t.constants.add("cloudFresnelModifier","vec2",[1.2,.01]),t.code.add(i`PBRShadingWater shadingInfo;
vec3 getSkyGradientColor(in float cosTheta, in vec3 horizon, in vec3 zenit) {
float exponent = pow((1.0 - cosTheta), fresnelSky[2]);
return mix(zenit, horizon, exponent);
}`),t.uniforms.add(new c("lightingSpecularStrength",a=>a.lighting.mainLight.specularStrength),new c("lightingEnvironmentStrength",a=>a.lighting.mainLight.environmentStrength)),t.code.add(i`vec3 getSeaColor(in vec3 n, in vec3 v, in vec3 l, vec3 color, in vec3 lightIntensity, in vec3 localUp, in float shadow, float foamIntensity, vec3 viewPosition, vec3 position) {
float reflectionHit = 0.0;
float reflectionHitDiffused = 0.0;
vec3 seaWaterColor = linearizeGamma(color);
vec3 h = normalize(l + v);
shadingInfo.NdotV = clamp(dot(n, v), 0.001, 1.0);
shadingInfo.VdotN = clamp(dot(v, n), 0.001, 1.0);
shadingInfo.NdotH = clamp(dot(n, h), 0.0, 1.0);
shadingInfo.VdotH = clamp(dot(v, h), 0.0, 1.0);
shadingInfo.LdotH = clamp(dot(l, h), 0.0, 1.0);
float upDotV = max(dot(localUp,v), 0.0);
vec3 skyHorizon = linearizeGamma(skyColor);
vec3 skyZenit = linearizeGamma(skyZenitColor);
vec3 skyColor = getSkyGradientColor(upDotV, skyHorizon, skyZenit );
float upDotL = max(dot(localUp,l),0.0);
float daytimeMod = 0.1 + upDotL * 0.9;
skyColor *= daytimeMod;
float shadowModifier = clamp(shadow, 0.8, 1.0);
vec3 fresnelModifier = fresnelReflection(shadingInfo.VdotN, vec3(fresnelSky[0]), fresnelSky[1]);
vec3 reflSky = lightingEnvironmentStrength * fresnelModifier * skyColor * shadowModifier;
vec3 reflSea = seaWaterColor * mix(skyColor, upDotL * lightIntensity * LIGHT_NORMALIZATION, 2.0 / 3.0) * shadowModifier;
vec3 specular = vec3(0.0);
if(upDotV > 0.0 && upDotL > 0.0) {
vec3 specularSun = brdfSpecularWater(shadingInfo, roughness, vec3(fresnelMaterial[0]), fresnelMaterial[1]);
vec3 incidentLight = lightIntensity * LIGHT_NORMALIZATION * shadow;
float NdotL = clamp(dot(n, l), 0.0, 1.0);
specular = lightingSpecularStrength * NdotL * incidentLight * specularSun;
}
vec3 foam = vec3(0.0);
if(upDotV > 0.0) {
foam = foamIntensity2FoamColor(foamIntensityExternal, foamIntensity, skyZenitColor, daytimeMod);
}
float correctionViewingFactor = pow(max(dot(v, localUp), 0.0), correctionViewingPowerFactor);
vec3 normalCorrectedClouds = mix(localUp, n, correctionViewingFactor);
vec3 reflectedWorld = normalize(reflect(-v, normalCorrectedClouds));`),o.cloudReflections&&t.uniforms.add(new c("cloudsOpacity",a=>a.clouds.opacity)).code.add(i`vec4 cloudsColor = renderClouds(reflectedWorld, position);
cloudsColor.a = 1.0 - cloudsColor.a;
cloudsColor = pow(cloudsColor, vec4(GAMMA));
cloudsColor *= clamp(fresnelModifier.y * cloudFresnelModifier[0] - cloudFresnelModifier[1], 0.0, 1.0) * cloudsOpacity;`),o.screenSpaceReflections?t.uniforms.add(new u("view",a=>a.camera.viewMatrix),new M("lastFrameColorTexture",a=>a.ssr.lastFrameColor?.getTexture()),new c("fadeFactorSSR",a=>a.ssr.fadeFactor)).code.add(i`vec3 viewDir = normalize(viewPosition);
vec4 viewNormalVectorCoordinate = view * vec4(n, 0.0);
vec3 viewNormal = normalize(viewNormalVectorCoordinate.xyz);
vec4 viewUp = view * vec4(localUp, 0.0);
vec3 viewNormalCorrectedSSR = mix(viewUp.xyz, viewNormal, correctionViewingFactor);
vec3 reflected = normalize(reflect(viewDir, viewNormalCorrectedSSR));
vec3 hitCoordinate = screenSpaceIntersection(reflected, viewPosition, viewDir, viewUp.xyz);
vec3 reflectedColor = vec3(0.0);
if (hitCoordinate.z > 0.0)
{
vec2 reprojectedCoordinate = reprojectionCoordinate(hitCoordinate);
vec2 dCoords = smoothstep(0.3, 0.6, abs(vec2(0.5, 0.5) - hitCoordinate.xy));
float heightMod = smoothstep(ssrHeightFadeEnd, ssrHeightFadeStart, -viewPosition.z);
reflectionHit = clamp(1.0 - (1.3 * dCoords.y), 0.0, 1.0) * heightMod * fadeFactorSSR;
reflectionHitDiffused = waterDiffusion * reflectionHit;
reflectedColor = linearizeGamma(texture(lastFrameColorTexture, reprojectedCoordinate).xyz) *
reflectionHitDiffused * fresnelModifier.y * ssrIntensity;
}
float seaColorMod =  mix(waterSeaColorMod, waterSeaColorMod * 0.5, reflectionHitDiffused);
vec3 waterRenderedColor = tonemapACES((1.0 - reflectionHitDiffused) * reflSky + reflectedColor +
reflSea * seaColorMod + specular + foam);`):t.code.add(i`vec3 waterRenderedColor = tonemapACES(reflSky + reflSea * waterSeaColorMod + specular + foam);`),o.cloudReflections?o.screenSpaceReflections?t.code.add(i`return waterRenderedColor * (1.0 - (1.0 - reflectionHit) * cloudsColor.a) + (1.0 - reflectionHit) * cloudsColor.xyz;
}`):t.code.add(i`return waterRenderedColor * (1.0 - cloudsColor.a) + cloudsColor.xyz;
}`):t.code.add(i`return waterRenderedColor;
}`)}export{be as a,he as b,zo as c};
