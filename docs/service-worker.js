if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return c[e]||(r=new Promise(async r=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=r}else importScripts(e),r()})),r.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},r=(r,c)=>{Promise.all(r.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(r)};self.define=(r,i,s)=>{c[r]||(c[r]=Promise.resolve().then(()=>{let c={};const o={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return c;case"module":return o;default:return e(r)}})).then(e=>{const r=s(...e);return c.default||(c.default=r),c})}))}}define("./service-worker.js",["./workbox-d9851aed"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/./index.html",revision:"0c8e65f320e52045aa4b4ec8efdcad06"},{url:"/3a8ca398e6a5c3b83f4de7c60843a9a0.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"/editor.css?889058961de3acc5bb9f",revision:"c7ddead8c4e94aba9547fc7c14f00abb"},{url:"/editor.js?41e2c269eee6a3bc13c8",revision:"7adc36f2c56d0377a7be1c2578b7b723"},{url:"/icon.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"}],{})}));
