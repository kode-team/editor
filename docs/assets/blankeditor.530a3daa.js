import{E as l,e as r,f as c,C as d,L as g,D as b,g as f,i as v,O as o,B as y,S as h,U as w}from"./index.2a4b63d0.js";class m{constructor(){}async getRoot(){return[]}async getChildren(e){return await e}async getParent(e){return await e.parent}async getTreeItem(e){return{label:e.label,icon:e.icon,element:e,collapased:e.collapsed,command:{title:"",command:"tree.select",args:[e]}}}async traverse(){return await[...await this.getRoot()]}}class i extends l{components(){return{TreeItem:i}}initState(){return{item:this.props.item}}template(){var e;return console.log(this.state.item),r("div",{class:"tree-item"},r("div",{class:"tree-item-label",ref:"$label"},r("span",{class:"tree-item-icon"},r("span",{class:"tree-item-icon-image"})),r("span",{class:"tree-item-label-text"},this.state.item.title)),r("div",{class:"tree-item-children"},(e=this.state.item.children||[])==null?void 0:e.map((t,a)=>c("TreeItem",{ref:`${this.id}-${a}`,item:t})).join("")))}[d("$label")](){console.log(this.state.item)}}class S extends l{components(){return{TreeItem:i}}initState(){return{provider:this.props.provider||new m}}template(){return r("div",{class:"tree-view"})}async[g("$el")+b](){return(await this.state.provider.traverse()).map((e,t)=>c("TreeItem",{ref:`${this.id}-${t}`,item:e}))}}function I(){return["app"].map(e=>f({container:document.getElementById(e),config:{"editor.theme":"light"},plugins:[function(t){t.registerUI("layertab.tab",{Sample:{title:"Sample",icon:v("add"),value:"sample"}}),t.context.config.set("layertab.selectedValue","sample"),t.registerUI("layertab.tab.sample",{TreeView:[S,{provider:new class extends m{async getRoot(){return[{title:"Root",value:"root",children:[{title:"Child",value:"child"}]}]}}}]}),t.registerUI("inspector.tab",{Sample:{title:"Sample",value:"sample"}}),t.context.config.set("inspector.selectedValue","sample"),t.registerUI("layertab.tab.sample",{SampleProperty:o.create({title:"Sample",visible:!0,inspector:()=>["SampleProperty"]})}),t.registerUI("inspector.tab.sample",{SampleProperty:o.create({visible:!0,title:"Sample",inspector:()=>["SampleProperty"]})}),t.registerUI("canvas.view",{Sample:class extends l{template(){return"<div class='text-3xl font-bold underline'>fdsajfkdlsajfkdlsadfjksl</div>"}[y("$el")](){const{translate:a,transformOrigin:s,scale:p}=this.$viewport,u=`translate(${a[0]}px, ${a[1]}px) scale(${p||1})`;return{style:{"transform-origin":`${s[0]}px ${s[1]}px`,transform:u}}}[h(w)](){this.bindData("$el")}}}),t.registerMenu("toolbar.center",[{type:"button",title:"Sample"}]),t.registerMenu("toolbar.right",[{type:"button",title:"Sample"}]),t.registerMenu("toolbar.left",[{type:"dropdown",icon:`<div class="logo-item"><label class='logo'></label></div>`,items:[{title:"menu.item.fullscreen.title",command:"toggle.fullscreen",shortcut:"ALT+/"}]},{type:"button",title:"test button",action:(a,s)=>{console.log("test button",s)},style:{}},{type:"dropdown",title:"file",items:[{title:"menu.item.fullscreen.title",command:"toggle.fullscreen",shortcut:"ALT+/"},"-","a",{type:"divider"},{title:"menu.item.fullscreen.title",action:()=>{window.alert("tool")},shortcut:"ALT+/"}]}])}]}))}window.elfEditor=I();
