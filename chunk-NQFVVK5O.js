import{d as Q}from"./chunk-423EPWZ2.js";import{c as P}from"./chunk-RME3N3WY.js";import{a as b,b as M}from"./chunk-TTCWVZMG.js";import{i as g,k as x}from"./chunk-BUZBVNOM.js";import{a as y,b as f,k as l,l as d,n as A,p as w,r as v}from"./chunk-HM5RIVQC.js";import{j as h}from"./chunk-D2LVMNOU.js";var T=class{constructor(){this._result=!1}dispose(){this._program=h(this._program)}get result(){return this._program!=null&&(this._result=this._test(this._program),this.dispose()),this._result}};var X=class extends T{constructor(s){super(),this._rctx=s;let e=`
    precision highp float;

    attribute vec2 a_pos;
    varying vec2 v_uv;

    void main() {
      v_uv = a_pos;
      gl_Position = vec4(a_pos * 2.0 - 1.0, 0.0, 1.0);
    }
    `,r=`
    precision highp float;

    varying vec2 v_uv;

    uniform sampler2D u_texture;

    void main() {
      gl_FragColor = texture2D(u_texture, v_uv);
    }
    `;this._program=s.programCache.acquire(e,r,new Map([["a_pos",0]]))}dispose(){super.dispose()}_test(s){let e=this._rctx;if(!e.gl)return s.dispose(),!0;let r=new g(1);r.wrapMode=d.CLAMP_TO_EDGE,r.samplingMode=l.NEAREST;let o=new P(e,r),m=b.createVertex(e,v.STATIC_DRAW,new Uint16Array([0,0,1,0,0,1,1,1])),u=new M(e,new Map([["a_pos",0]]),Q,new Map([["geometry",m]])),n=new g;n.samplingMode=l.LINEAR,n.wrapMode=d.CLAMP_TO_EDGE;let E=new x(e,n,a);e.useProgram(s),e.bindTexture(E,0),s.setUniform1i("u_texture",0);let p=e.getBoundFramebufferObject(),{x:I,y:S,width:R,height:U}=e.getViewport();e.bindFramebuffer(o),e.setViewport(0,0,1,1),e.setClearColor(0,0,0,0),e.setBlendingEnabled(!1),e.clear(y.COLOR),e.bindVAO(u),e.drawArrays(f.TRIANGLE_STRIP,0,4);let c=new Uint8Array(4);return o.readPixels(0,0,1,1,A.RGBA,w.UNSIGNED_BYTE,c),u.dispose(),o.dispose(),E.dispose(),e.setViewport(I,S,R,U),e.bindFramebuffer(p),c[0]!==255}},a=new Image;a.src="data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='5' height='5' version='1.1' viewBox='0 0 5 5' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='5' height='5' fill='%23f00' fill-opacity='.5'/%3E%3C/svg%3E%0A",a.width=5,a.height=5,a.decode();var _=class{constructor(s,e,r,o,m,u,n,E,p){this.createQuery=s,this.deleteQuery=e,this.resultAvailable=r,this.getResult=o,this.disjoint=m,this.beginTimeElapsed=u,this.endTimeElapsed=n,this.createTimestamp=E,this.timestampBits=p}},i=!1;function q(t,s){if(s.disjointTimerQuery)return null;let e=t.getExtension("EXT_disjoint_timer_query_webgl2");return e?new _(()=>t.createQuery(),r=>{t.deleteQuery(r),i=!1},r=>t.getQueryParameter(r,t.QUERY_RESULT_AVAILABLE),r=>t.getQueryParameter(r,t.QUERY_RESULT),()=>t.getParameter(e.GPU_DISJOINT_EXT),r=>{i||(i=!0,t.beginQuery(e.TIME_ELAPSED_EXT,r))},()=>{t.endQuery(e.TIME_ELAPSED_EXT),i=!1},r=>e.queryCounterEXT(r,e.TIMESTAMP_EXT),()=>t.getQuery(e.TIMESTAMP_EXT,e.QUERY_COUNTER_BITS_EXT)):(e=t.getExtension("EXT_disjoint_timer_query"),e?new _(()=>e.createQueryEXT(),r=>{e.deleteQueryEXT(r),i=!1},r=>e.getQueryObjectEXT(r,e.QUERY_RESULT_AVAILABLE_EXT),r=>e.getQueryObjectEXT(r,e.QUERY_RESULT_EXT),()=>t.getParameter(e.GPU_DISJOINT_EXT),r=>{i||(i=!0,e.beginQueryEXT(e.TIME_ELAPSED_EXT,r))},()=>{e.endQueryEXT(e.TIME_ELAPSED_EXT),i=!1},r=>e.queryCounterEXT(r,e.TIMESTAMP_EXT),()=>e.getQueryEXT(e.TIMESTAMP_EXT,e.QUERY_COUNTER_BITS_EXT)):null)}export{q as a,T as b,X as c};
