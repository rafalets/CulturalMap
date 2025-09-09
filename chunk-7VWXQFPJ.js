import{a as _,c as P}from"./chunk-OTUHXNWB.js";import{a as R,b as L}from"./chunk-NBT2WTKD.js";import{a as N}from"./chunk-L7NOU4T2.js";import{a as V}from"./chunk-4LDVFWME.js";import{a as E,h as v,p as O}from"./chunk-3AS27HNO.js";import{a as A}from"./chunk-GV3ZFCVD.js";import{a as y}from"./chunk-T7PUQGWM.js";import{a as U}from"./chunk-MVDZB4AK.js";import{a as r,b as n}from"./chunk-47NSYSFY.js";import{a as g}from"./chunk-QXNVQZT7.js";import{a as x}from"./chunk-RWCIDBNQ.js";import{d as c}from"./chunk-ONYJLWAD.js";import{K as C,m}from"./chunk-D2LVMNOU.js";var u;function I(e,t){switch(t.textureCoordinateType){case u.Default:return e.attributes.add(x.UV0,"vec2"),e.varyings.add("vuv0","vec2"),void e.vertex.code.add(r`void forwardTextureCoordinates() {
vuv0 = uv0;
}`);case u.Compressed:return e.attributes.add(x.UV0,"vec2"),e.varyings.add("vuv0","vec2"),void e.vertex.code.add(r`vec2 getUV0() {
return uv0 / 16384.0;
}
void forwardTextureCoordinates() {
vuv0 = getUV0();
}`);case u.Atlas:return e.attributes.add(x.UV0,"vec2"),e.varyings.add("vuv0","vec2"),e.attributes.add(x.UVREGION,"vec4"),e.varyings.add("vuvRegion","vec4"),void e.vertex.code.add(r`void forwardTextureCoordinates() {
vuv0 = uv0;
vuvRegion = uvRegion;
}`);default:t.textureCoordinateType;case u.None:return void e.vertex.code.add(r`void forwardTextureCoordinates() {}`);case u.COUNT:return}}(function(e){e[e.None=0]="None",e[e.Default=1]="Default",e[e.Atlas=2]="Atlas",e[e.Compressed=3]="Compressed",e[e.COUNT=4]="COUNT"})(u||(u={}));function D(e){e.fragment.code.add(r`vec4 textureAtlasLookup(sampler2D tex, vec2 textureCoordinates, vec4 atlasRegion) {
vec2 atlasScale = atlasRegion.zw - atlasRegion.xy;
vec2 uvAtlas = fract(textureCoordinates) * atlasScale + atlasRegion.xy;
float maxdUV = 0.125;
vec2 dUVdx = clamp(dFdx(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
vec2 dUVdy = clamp(dFdy(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
return textureGrad(tex, uvAtlas, dUVdx, dUVdy);
}`)}function w(e,t){let{textureCoordinateType:s}=t;if(s===u.None||s===u.COUNT)return;e.include(I,t);let i=s===u.Atlas;i&&e.include(D),e.fragment.code.add(r`
    vec4 textureLookup(sampler2D tex, vec2 uv) {
      return ${i?"textureAtlasLookup(tex, uv, vuvRegion)":"texture(tex, uv)"};
    }
  `)}var p=class{constructor(t){this._material=t.material,this._techniques=t.techniques,this._output=t.output}dispose(){}get _stippleTextures(){return this._techniques.context.stippleTextures}get _markerTextures(){return this._techniques.context.markerTextures}getTechnique(t,s){return this._techniques.get(t,this._material.getConfiguration(this._output,s))}ensureResources(t){return c.LOADED}};var b=class extends p{constructor(t){super(t),this._numLoading=0,this._disposed=!1,this._textures=t.textures,this.updateTexture(t.textureId),this._acquire(t.normalTextureId,s=>this._textureNormal=s),this._acquire(t.emissiveTextureId,s=>this._textureEmissive=s),this._acquire(t.occlusionTextureId,s=>this._textureOcclusion=s),this._acquire(t.metallicRoughnessTextureId,s=>this._textureMetallicRoughness=s)}dispose(){super.dispose(),this._texture=m(this._texture),this._textureNormal=m(this._textureNormal),this._textureEmissive=m(this._textureEmissive),this._textureOcclusion=m(this._textureOcclusion),this._textureMetallicRoughness=m(this._textureMetallicRoughness),this._disposed=!0}ensureResources(t){return this._numLoading===0?c.LOADED:c.LOADING}get textureBindParameters(){return new T(this._texture!=null?this._texture.glTexture:null,this._textureNormal!=null?this._textureNormal.glTexture:null,this._textureEmissive!=null?this._textureEmissive.glTexture:null,this._textureOcclusion!=null?this._textureOcclusion.glTexture:null,this._textureMetallicRoughness!=null?this._textureMetallicRoughness.glTexture:null)}updateTexture(t){this._texture!=null&&t===this._texture.id||(this._texture=m(this._texture),this._textureId=t,this._acquire(this._textureId,s=>this._texture=s))}_acquire(t,s){if(t==null)return void s(null);let i=this._textures.acquire(t);if(C(i))return++this._numLoading,void i.then(a=>{if(this._disposed)return m(a),void s(null);s(a)}).finally(()=>--this._numLoading);s(i)}},h=class extends N{constructor(t=null){super(),this.textureEmissive=t}},T=class extends h{constructor(t=null,s=null,i=null,a=null,l=null,d,o){super(i),this.texture=t,this.textureNormal=s,this.textureOcclusion=a,this.textureMetallicRoughness=l,this.scale=d,this.normalTextureTransformMatrix=o}};var f;(function(e){e[e.None=0]="None",e[e.Value=1]="Value",e[e.Texture=2]="Texture",e[e.COUNT=3]="COUNT"})(f||(f={}));function q(e,t){if(!v(t.output))return;let{emissionSource:s,hasEmissiveTextureTransform:i,bindType:a}=t,l=s===f.Texture;l&&(e.include(w,t),e.fragment.uniforms.add(a===g.Pass?new V("texEmission",o=>o.textureEmissive):new U("texEmission",o=>o.textureEmissive)));let d=s===f.Value||l;d&&e.fragment.uniforms.add(a===g.Pass?new y("emissionFactor",o=>o.emissiveFactor):new A("emissionFactor",o=>o.emissiveFactor)),e.fragment.code.add(r`
    vec4 getEmissions() {
      vec4 emissions = ${d?"vec4(emissionFactor, 1.0)":"vec4(0.0)"};
      ${n(l,`emissions *= textureLookup(texEmission, ${i?"emissiveUV":"vuv0"});
         emissions.w = emissions.rgb == vec3(0.0) ? 0.0: emissions.w;`)}
      return emissions;
    }
  `)}function _e(e,t){e.include(R,t),e.include(q,t),e.fragment.include(P);let s=t.output===E.ObjectAndLayerIdColor,i=O(t.output),a=v(t.output)&&t.oitPass===_.ColorAlpha,l=v(t.output)&&t.oitPass!==_.ColorAlpha,d=t.discardInvisibleFragments,o=0;(l||i||a)&&e.outputs.add("fragColor","vec4",o++),i&&e.outputs.add("fragEmission","vec4",o++),a&&e.outputs.add("fragAlpha","float",o++),e.fragment.code.add(r`
    void outputColorHighlightOID(vec4 finalColor, const in vec3 vWorldPosition) {
      ${n(s,"finalColor.a = 1.0;")}

      ${n(d,`if (finalColor.a < ${r.float(L)}) { discard; }`)}

      finalColor = applySlice(finalColor, vWorldPosition);
      ${n(a,r`fragColor = premultiplyAlpha(finalColor);
             fragAlpha = finalColor.a;`)}
      ${n(l,"fragColor = finalColor;")}
      ${n(i,"fragEmission = finalColor.a * getEmissions();")}
      calculateOcclusionAndOutputHighlight();
      ${n(s,"outputObjectAndLayerIdColor();")}
    }
  `)}export{u as a,I as b,w as c,p as d,b as e,T as f,f as g,_e as h};
