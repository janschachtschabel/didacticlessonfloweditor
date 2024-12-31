import{R as p}from"./vendor-react-C8dg5fqf.js";import{u as y}from"./use-sync-external-store-B_at4Jwv.js";const v={BASE_URL:"/",DEV:!1,MODE:"production",PROD:!0,SSR:!1},l=t=>{let e;const s=new Set,n=(o,a)=>{const i=typeof o=="function"?o(e):o;if(!Object.is(i,e)){const m=e;e=a??(typeof i!="object"||i===null)?i:Object.assign({},e,i),s.forEach(b=>b(e,m))}},r=()=>e,c={setState:n,getState:r,getInitialState:()=>h,subscribe:o=>(s.add(o),()=>s.delete(o)),destroy:()=>{(v?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),s.clear()}},h=e=t(n,r,c);return c},E=t=>t?l(t):l,g={BASE_URL:"/",DEV:!1,MODE:"production",PROD:!0,SSR:!1},{useDebugValue:_}=p,{useSyncExternalStoreWithSelector:D}=y;let f=!1;const O=t=>t;function R(t,e=O,s){(g?"production":void 0)!=="production"&&s&&!f&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),f=!0);const n=D(t.subscribe,t.getState,t.getServerState||t.getInitialState,e,s);return _(n),n}const d=t=>{(g?"production":void 0)!=="production"&&typeof t!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const e=typeof t=="function"?E(t):t,s=(n,r)=>R(e,n,r);return Object.assign(s,e),s},k=t=>t?d(t):d,{useDebugValue:W}=p,{useSyncExternalStoreWithSelector:w}=y,I=t=>t;function x(t,e=I,s){const n=w(t.subscribe,t.getState,t.getServerState||t.getInitialState,e,s);return W(n),n}const S=(t,e)=>{const s=E(t),n=(r,u=e)=>x(s,r,u);return Object.assign(n,s),n},T=(t,e)=>t?S(t,e):S;function V(t,e){if(Object.is(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;if(t instanceof Map&&e instanceof Map){if(t.size!==e.size)return!1;for(const[n,r]of t)if(!Object.is(r,e.get(n)))return!1;return!0}if(t instanceof Set&&e instanceof Set){if(t.size!==e.size)return!1;for(const n of t)if(!e.has(n))return!1;return!0}const s=Object.keys(t);if(s.length!==Object.keys(e).length)return!1;for(const n of s)if(!Object.prototype.hasOwnProperty.call(e,n)||!Object.is(t[n],e[n]))return!1;return!0}export{k as a,T as c,V as s,x as u};