if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return c[e]||(r=new Promise(async r=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=r}else importScripts(e),r()})),r.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},r=(r,c)=>{Promise.all(r.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(r)};self.define=(r,i,a)=>{c[r]||(c[r]=Promise.resolve().then(()=>{let c={};const s={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return c;case"module":return s;default:return e(r)}})).then(e=>{const r=a(...e);return c.default||(c.default=r),c})}))}}define("./service-worker.js",["./workbox-24aa846e"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"./index.html",revision:"daa745f20a3933a534ef7a3a55edec3b"},{url:"3a8ca398e6a5c3b83f4de7c60843a9a0.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"icon.png",revision:"3a8ca398e6a5c3b83f4de7c60843a9a0"},{url:"main.css?ae1d9e9ea61c43b23e9d",revision:"d65cf9a58d914e6c6418793f1337cbd9"},{url:"main.js?526c0b32dcc853093275",revision:"48a29c9cb36ba4d4c8e43e234516ac0f"},{url:"vendors~main.js?d1e9460fdff256ebbdac",revision:"e0bc252f827bf0625dea96929cc31460"}],{})}));
