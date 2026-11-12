import test from 'node:test';
import assert from 'node:assert/strict';

test('all six page views generate their primary content with a simulated DOM',async()=>{
 const elements=new Map();const navs=[];const events=new Map();
 function mock(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',style:{},classList:{add(){},remove(){},toggle(){}},dataset:{},value:id==='#intensity'?'55':'',addEventListener(event,fn){this[event]=fn},matches(){return false}});return elements.get(id)}
 const menuNames=['mission','protocol','laboratory','analysis','challenges','debrief'];
 for(const name of menuNames){const o=mock('.nav-item:'+name);o.dataset.page=name;navs.push(o)}
 globalThis.document={querySelector:mock,querySelectorAll:(s)=>s==='.nav-item'?navs:[],addEventListener:(type,fn)=>events.set(type,fn),createElement:()=>({}),body:{append(){}}};
 globalThis.window={scrollTo(){},print(){}};globalThis.localStorage={getItem:()=>null,setItem(){}};
 const previous=setInterval;globalThis.setInterval=()=>0;
 try{await import('../assets/app.js');
  const expected=['Fuel the effort','The experimental protocol','The live laboratory','Metabolic analysis studio','Metabolic challenges','Results & scientific debrief'];
  for(let i=0;i<menuNames.length;i++){
   if(i){navs[i].click?.()}
   const html=mock('#main').innerHTML;
   assert.ok(html.includes(expected[i]),`Expected ${expected[i]} in ${menuNames[i]}`);
   assert.ok(html.length>1000);
  }
 }finally{globalThis.setInterval=previous}
});
