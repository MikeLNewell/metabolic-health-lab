/** Core physiology calculations and CSV utilities; no browser dependencies. */
export const PHASES = [
  {id:'baseline',name:'Baseline RMR',short:'Baseline',start:0,end:15,kind:'rest'},
  {id:'exerciseEarly',name:'Exercise 5–10 min',short:'Exercise 5–10',start:25,end:30,kind:'exercise'},
  {id:'exerciseLate',name:'Exercise 15–20 min',short:'Exercise 15–20',start:35,end:40,kind:'exercise'},
  {id:'recoveryEarly',name:'Immediate recovery',short:'Recovery 1',start:45,end:60,kind:'recovery'},
  {id:'recoveryLate',name:'Later recovery',short:'Recovery 2',start:60,end:75,kind:'recovery'}
];
export const n = value => value === '' || value === null || value === undefined ? null : Number.isFinite(Number(value)) ? Number(value) : null;
export const round = (value, digits=2) => Number.isFinite(value) ? Math.round(value*10**digits)/10**digits : null;
export function hrZone(age, resting, kind='low', bounds=null){
  const a=n(age), r=n(resting);if(a===null||r===null||a<10||a>100||r<=0||r>=220-a)return null;
  const [lower,upper]=bounds|| (kind==='vigorous'?[.6,.8]:[.2,.4]); const max=220-a, reserve=max-r;
  return {max, reserve, lower:round(r+lower*reserve,0),upper:round(r+upper*reserve,0)};
}
export function metabolic(vo2,vco2, unit='L/min'){
  let o=n(vo2),c=n(vco2); if(o===null||c===null)return null;
  if(unit==='mL/min'){o/=1000;c/=1000}
  if(!(o>0&&c>0) || o>9 || c>13)return {error:'Gas exchange values must be positive and use the selected units.'};
  const rer=c/o,cho=4.55*c-3.21*o,fat=1.67*(o-c),energy=3.941*o+1.106*c;
  const warnings=[];
  if(rer>1.0)warnings.push('RER > 1.00: non-oxidative CO₂ and/or non-steady-state effects may invalidate substrate estimates.');
  if(rer<.70)warnings.push('RER < 0.70: check calibration, units and steady state before interpreting substrate use.');
  if(cho<0 || fat<0)warnings.push('Negative substrate estimate: the algebraic result is retained, but is not a physiological rate.');
  return {vo2:o,vco2:c,rer,cho,fat,energy,warnings,validSubstrates:!warnings.length};
}
export function phaseResults(record){if(!record)return null;const m=metabolic(record.vo2,record.vco2,record.unit||'L/min');return m&& !m.error?{...m,hr:n(record.hr),power:n(record.power),rpe:n(record.rpe)}:null}
export function parseCSV(input){
  const text=input.replace(/^\uFEFF/,'');const rows=[];let line=[],cell='',quote=false;
  for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){if(quote&&text[i+1]==='"'){cell+='"';i++}else quote=!quote}else if(ch===','&&!quote){line.push(cell.trim());cell=''}else if((ch==='\n'||ch==='\r')&&!quote){if(ch==='\r'&&text[i+1]==='\n')i++;line.push(cell.trim());if(line.some(x=>x!==''))rows.push(line);line=[];cell=''}else cell+=ch}
  line.push(cell.trim());if(line.some(x=>x!==''))rows.push(line);
  if(rows.length<2)return {headers:rows[0]||[],rows:[]};return {headers:rows[0],rows:rows.slice(1).map(r=>Object.fromEntries(rows[0].map((k,i)=>[k,r[i]??''])))};
}
export function detectColumn(headers, aliases){const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');return headers.find(k=>aliases.some(a=>norm(k)===norm(a)))||''}
export function csvEscape(v){const s=v===null||v===undefined?'':String(v);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
export function toCSV(headers,rows){return [headers.map(csvEscape).join(','),...rows.map(row=>headers.map(h=>csvEscape(row[h])).join(','))].join('\r\n')}
export function stats(values){const x=values.filter(v=>Number.isFinite(v));if(!x.length)return null;const mean=x.reduce((a,b)=>a+b,0)/x.length;const sd=x.length>1?Math.sqrt(x.reduce((a,b)=>a+(b-mean)**2,0)/(x.length-1)):0;return {mean,sd,cv:mean!==0?sd/mean*100:null,n:x.length}}
export function windowSummary(rows,mapping,start,end,unit='L/min'){
  const sampled=rows.filter(row=>{const t=n(row[mapping.time]);return t!==null&&t>=start&&t<end});
  const gas=sampled.map(row=>({vo2:n(row[mapping.vo2]),vco2:n(row[mapping.vco2]),hr:n(row[mapping.hr]),power:n(row[mapping.power]),rpe:n(row[mapping.rpe])})).filter(r=>r.vo2!==null&&r.vco2!==null);
  if(!gas.length)return null;
  const average=k=>stats(gas.map(r=>r[k]))?.mean??null;
  const o=stats(gas.map(r=>r.vo2)); const c=stats(gas.map(r=>r.vco2));
  return {count:gas.length,record:{vo2:round(average('vo2'),4),vco2:round(average('vco2'),4),hr:round(average('hr'),0),power:round(average('power'),0),rpe:round(average('rpe'),1),unit},cvVO2:round(o?.cv,1),cvVCO2:round(c?.cv,1),variable:o?.cv>10||c?.cv>10};
}
export function demoSession(){
  const records={baseline:{vo2:.27,vco2:.22,hr:66,power:null,rpe:null,unit:'L/min'},exerciseEarly:{vo2:1.27,vco2:1.11,hr:115,power:90,rpe:10,unit:'L/min'},exerciseLate:{vo2:1.39,vco2:1.22,hr:121,power:92,rpe:11,unit:'L/min'},recoveryEarly:{vo2:.45,vco2:.41,hr:92,power:null,rpe:null,unit:'L/min'},recoveryLate:{vo2:.32,vco2:.29,hr:74,power:null,rpe:null,unit:'L/min'}};
  return {version:1,id:'DEMO-LOW',demonstration:true,participant:{group:'DEMO-LOW',age:24,height:172,mass:70,restingHr:64,condition:'low'},records,answers:{},notes:{},checks:{}};
}
export function demoVigorous(){return {version:1,id:'DEMO-VIG',demonstration:true,participant:{group:'DEMO-VIG',age:23,height:178,mass:75,restingHr:63,condition:'vigorous'},records:{baseline:{vo2:.29,vco2:.23,hr:63,unit:'L/min'},exerciseEarly:{vo2:2.55,vco2:2.48,hr:171,power:210,rpe:16,unit:'L/min'},exerciseLate:{vo2:2.72,vco2:2.75,hr:179,power:220,rpe:17,unit:'L/min'},recoveryEarly:{vo2:.68,vco2:.64,hr:109,unit:'L/min'},recoveryLate:{vo2:.38,vco2:.35,hr:85,unit:'L/min'}},answers:{},notes:{},checks:{}}}
