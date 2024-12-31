import{i as w}from"./state-local-BBNhjlcY.js";function O(n,e,r){return e in n?Object.defineProperty(n,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[e]=r,n}function d(n,e){var r=Object.keys(n);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(n);e&&(t=t.filter(function(o){return Object.getOwnPropertyDescriptor(n,o).enumerable})),r.push.apply(r,t)}return r}function m(n){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?d(Object(r),!0).forEach(function(t){O(n,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(r,t))})}return n}function I(n,e){if(n==null)return{};var r={},t=Object.keys(n),o,i;for(i=0;i<t.length;i++)o=t[i],!(e.indexOf(o)>=0)&&(r[o]=n[o]);return r}function S(n,e){if(n==null)return{};var r=I(n,e),t,o;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);for(o=0;o<i.length;o++)t=i[o],!(e.indexOf(t)>=0)&&Object.prototype.propertyIsEnumerable.call(n,t)&&(r[t]=n[t])}return r}function P(n,e){return A(n)||E(n,e)||T(n,e)||C()}function A(n){if(Array.isArray(n))return n}function E(n,e){if(!(typeof Symbol>"u"||!(Symbol.iterator in Object(n)))){var r=[],t=!0,o=!1,i=void 0;try{for(var a=n[Symbol.iterator](),u;!(t=(u=a.next()).done)&&(r.push(u.value),!(e&&r.length===e));t=!0);}catch(c){o=!0,i=c}finally{try{!t&&a.return!=null&&a.return()}finally{if(o)throw i}}return r}}function T(n,e){if(n){if(typeof n=="string")return v(n,e);var r=Object.prototype.toString.call(n).slice(8,-1);if(r==="Object"&&n.constructor&&(r=n.constructor.name),r==="Map"||r==="Set")return Array.from(n);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return v(n,e)}}function v(n,e){(e==null||e>n.length)&&(e=n.length);for(var r=0,t=new Array(e);r<e;r++)t[r]=n[r];return t}function C(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var z={paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"}};function D(n){return function e(){for(var r=this,t=arguments.length,o=new Array(t),i=0;i<t;i++)o[i]=arguments[i];return o.length>=n.length?n.apply(this,o):function(){for(var a=arguments.length,u=new Array(a),c=0;c<a;c++)u[c]=arguments[c];return e.apply(r,[].concat(o,u))}}}function M(n){return{}.toString.call(n).includes("Object")}function q(n){return n||g("configIsRequired"),M(n)||g("configType"),n.urls?(L(),{paths:{vs:n.urls.monacoBase}}):n}function L(){console.warn(b.deprecation)}function $(n,e){throw new Error(n[e]||n.default)}var b={configIsRequired:"the configuration object is required",configType:"the configuration object should be an object",default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:`Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `},g=D($)(b),R={config:q},_=function(){for(var e=arguments.length,r=new Array(e),t=0;t<e;t++)r[t]=arguments[t];return function(o){return r.reduceRight(function(i,a){return a(i)},o)}};function h(n,e){return Object.keys(e).forEach(function(r){e[r]instanceof Object&&n[r]&&Object.assign(e[r],h(n[r],e[r]))}),m(m({},n),e)}var x={type:"cancelation",msg:"operation is manually canceled"};function s(n){var e=!1,r=new Promise(function(t,o){n.then(function(i){return e?o(x):t(i)}),n.catch(o)});return r.cancel=function(){return e=!0},r}var W=w.create({config:z,isInitialized:!1,resolve:null,reject:null,monaco:null}),y=P(W,2),f=y[0],l=y[1];function B(n){var e=R.config(n),r=e.monaco,t=S(e,["monaco"]);l(function(o){return{config:h(o.config,t),monaco:r}})}function H(){var n=f(function(e){var r=e.monaco,t=e.isInitialized,o=e.resolve;return{monaco:r,isInitialized:t,resolve:o}});if(!n.isInitialized){if(l({isInitialized:!0}),n.monaco)return n.resolve(n.monaco),s(p);if(window.monaco&&window.monaco.editor)return j(window.monaco),n.resolve(window.monaco),s(p);_(N,G)(K)}return s(p)}function N(n){return document.body.appendChild(n)}function F(n){var e=document.createElement("script");return n&&(e.src=n),e}function G(n){var e=f(function(t){var o=t.config,i=t.reject;return{config:o,reject:i}}),r=F("".concat(e.config.paths.vs,"/loader.js"));return r.onload=function(){return n()},r.onerror=e.reject,r}function K(){var n=f(function(r){var t=r.config,o=r.resolve,i=r.reject;return{config:t,resolve:o,reject:i}}),e=window.require;e.config(n.config),e(["vs/editor/editor.main"],function(r){j(r),n.resolve(r)},function(r){n.reject(r)})}function j(n){f().monaco||l({monaco:n})}function U(){return f(function(n){var e=n.monaco;return e})}var p=new Promise(function(n,e){return l({resolve:n,reject:e})}),J={config:B,init:H,__getMonacoInstance:U};export{J as l};