import{d as T}from"./chunk-4MYROXQR.js";import{b as o}from"./chunk-L5JJXC3A.js";import{a as m,g as u}from"./chunk-7VWXQFPJ.js";import{a as S}from"./chunk-6DKBN3BZ.js";import{n as l}from"./chunk-3D4Y6BLC.js";import{d as h}from"./chunk-4MZNR6MW.js";import{a as f}from"./chunk-B2RVSTL3.js";import{a as y}from"./chunk-HUUJBVXR.js";import{a as d}from"./chunk-T7PUQGWM.js";import{a as n}from"./chunk-47NSYSFY.js";import{a as p}from"./chunk-RWCIDBNQ.js";import{a}from"./chunk-QGVBCWUY.js";var s,v;(function(e){e[e.Draped=0]="Draped",e[e.Screen=1]="Screen",e[e.World=2]="World",e[e.COUNT=3]="COUNT"})(s||(s={})),function(e){e[e.Center=0]="Center",e[e.Tip=1]="Tip",e[e.COUNT=2]="COUNT"}(v||(v={}));var i=class extends T{constructor(){super(...arguments),this.space=s.Screen,this.anchor=v.Center,this.occluder=!1,this.writeDepth=!1,this.hideOnShortSegments=!1,this.hasCap=!1,this.hasTip=!1,this.vvSize=!1,this.vvColor=!1,this.vvOpacity=!1,this.hasOccludees=!1,this.terrainDepthTest=!1,this.cullAboveTerrain=!1,this.textureCoordinateType=m.None,this.emissionSource=u.None,this.discardInvisibleFragments=!0,this.occlusionPass=!1,this.hasVvInstancing=!0,this.hasSliceTranslatedView=!0,this.objectAndLayerIdColorInstanced=!1}get draped(){return this.space===s.Draped}};a([o({count:s.COUNT})],i.prototype,"space",void 0),a([o({count:v.COUNT})],i.prototype,"anchor",void 0),a([o()],i.prototype,"occluder",void 0),a([o()],i.prototype,"writeDepth",void 0),a([o()],i.prototype,"hideOnShortSegments",void 0),a([o()],i.prototype,"hasCap",void 0),a([o()],i.prototype,"hasTip",void 0),a([o()],i.prototype,"vvSize",void 0),a([o()],i.prototype,"vvColor",void 0),a([o()],i.prototype,"vvOpacity",void 0),a([o()],i.prototype,"hasOccludees",void 0),a([o()],i.prototype,"terrainDepthTest",void 0),a([o()],i.prototype,"cullAboveTerrain",void 0);var O=8;function E(e,c){let t=e.vertex;t.uniforms.add(new y("intrinsicWidth",r=>r.width)),c.vvSize?(e.attributes.add(p.SIZEFEATUREATTRIBUTE,"float"),t.uniforms.add(new d("vvSizeMinSize",r=>r.vvSize.minSize),new d("vvSizeMaxSize",r=>r.vvSize.maxSize),new d("vvSizeOffset",r=>r.vvSize.offset),new d("vvSizeFactor",r=>r.vvSize.factor)),t.code.add(n`float getSize() {
return intrinsicWidth * clamp(vvSizeOffset + sizeFeatureAttribute * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize).x;
}`)):(e.attributes.add(p.SIZE,"float"),t.code.add(n`float getSize(){
return intrinsicWidth * size;
}`)),c.vvOpacity?(e.attributes.add(p.OPACITYFEATUREATTRIBUTE,"float"),t.constants.add("vvOpacityNumber","int",8),t.uniforms.add(new l("vvOpacityValues",r=>r.vvOpacity.values,O),new l("vvOpacityOpacities",r=>r.vvOpacity.opacityValues,O)),t.code.add(n`float interpolateOpacity( float value ){
if (value <= vvOpacityValues[0]) {
return vvOpacityOpacities[0];
}
for (int i = 1; i < vvOpacityNumber; ++i) {
if (vvOpacityValues[i] >= value) {
float f = (value - vvOpacityValues[i-1]) / (vvOpacityValues[i] - vvOpacityValues[i-1]);
return mix(vvOpacityOpacities[i-1], vvOpacityOpacities[i], f);
}
}
return vvOpacityOpacities[vvOpacityNumber - 1];
}
vec4 applyOpacity( vec4 color ){
return vec4(color.xyz, interpolateOpacity(opacityFeatureAttribute));
}`)):t.code.add(n`vec4 applyOpacity( vec4 color ){
return color;
}`),c.vvColor?(e.include(S,c),e.attributes.add(p.COLORFEATUREATTRIBUTE,"float"),t.code.add(n`vec4 getColor(){
return applyOpacity(interpolateVVColor(colorFeatureAttribute));
}`)):(e.attributes.add(p.COLOR,"vec4"),t.code.add(n`vec4 getColor(){
return applyOpacity(color);
}`))}var z=64,g=z/2,C=g/5,x=z/C,Y=.25;function te(e,c){let t=e.vertex;h(t),t.uniforms.get("markerScale")==null&&t.constants.add("markerScale","float",1),t.constants.add("markerSizePerLineWidth","float",x).code.add(n`float getLineWidth() {
return max(getSize(), 1.0) * pixelRatio;
}
float getScreenMarkerSize() {
return markerSizePerLineWidth * markerScale * getLineWidth();
}`),c.space===s.World&&(t.constants.add("maxSegmentLengthFraction","float",.45),t.uniforms.add(new f("perRenderPixelRatio",r=>r.camera.perRenderPixelRatio)),t.code.add(n`bool areWorldMarkersHidden(vec4 pos, vec4 other) {
vec3 midPoint = mix(pos.xyz, other.xyz, 0.5);
float distanceToCamera = length(midPoint);
float screenToWorldRatio = perRenderPixelRatio * distanceToCamera * 0.5;
float worldMarkerSize = getScreenMarkerSize() * screenToWorldRatio;
float segmentLen = length(pos.xyz - other.xyz);
return worldMarkerSize > maxSegmentLengthFraction * segmentLen;
}
float getWorldMarkerSize(vec4 pos) {
float distanceToCamera = length(pos.xyz);
float screenToWorldRatio = perRenderPixelRatio * distanceToCamera * 0.5;
return getScreenMarkerSize() * screenToWorldRatio;
}`))}export{s as a,v as b,i as c,E as d,z as e,g as f,Y as g,te as h};
