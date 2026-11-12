import test from 'node:test';
import assert from 'node:assert/strict';
import {hrZone,metabolic,parseCSV,windowSummary,toCSV,detectColumn,demoSession,demoVigorous,phaseResults,PHASES} from '../assets/logic.mjs';

test('individual HRR zones reproduce protocol examples',()=>{
 assert.deepEqual(hrZone(30,60,'low'),{max:190,reserve:130,lower:86,upper:112});
 assert.deepEqual(hrZone(30,60,'vigorous'),{max:190,reserve:130,lower:138,upper:164});
 assert.equal(hrZone(30,200,'low'),null);
});
test('metabolic equations produce values from L/min',()=>{
 const r=metabolic(.3,.25); assert.ok(r);assert.equal(r.error,undefined);
 assert.ok(Math.abs(r.rer-5/6)<1e-10);
 assert.ok(Math.abs(r.cho-.1745)<1e-10);
 assert.ok(Math.abs(r.fat-.0835)<1e-10);
 assert.ok(Math.abs(r.energy-1.4588)<1e-10);
 assert.equal(r.validSubstrates,true);
});
test('unit conversions are equivalent',()=>{
 const a=metabolic(.3,.25),b=metabolic(300,250,'mL/min');
 assert.deepEqual(a,b);
});
test('do not hide impossible rates and warn at high RER',()=>{
 const r=metabolic(2.5,2.8);assert.ok(r.fat<0);assert.equal(r.validSubstrates,false);assert.ok(r.warnings.some(x=>x.includes('RER > 1.00')));
 assert.ok(metabolic(0,0).error); assert.equal(metabolic('',''),null);
});
test('quoted CSV parser and serialiser',()=>{
 const csv='time,vo2,comment\r\n5,0.3,"didn\'t, stop"\r\n6,0.4,"quoted ""comment"""';
 const {headers,rows}=parseCSV(csv);assert.equal(rows.length,2);assert.equal(rows[0].comment,"didn't, stop");assert.equal(rows[1].comment,'quoted "comment"');
 const out=toCSV(headers,rows);assert.equal(parseCSV(out).rows[1].comment,'quoted "comment"');
});
test('correct columns and five-minute windows',()=>{
 const {headers,rows}=parseCSV('Time (min),VO2 (L/min),VCO2 (L/min),Heart Rate\n5,1,0.8,110\n6,2,1.6,120\n10,4,3.2,130');
 const mapping={time:detectColumn(headers,['Time (min)','time']),vo2:headers[1],vco2:headers[2],hr:headers[3]};
 const result=windowSummary(rows,mapping,5,10);assert.equal(result.count,2);assert.equal(result.record.vo2,1.5);assert.equal(result.record.vco2,1.2);assert.equal(result.record.hr,115);
});
test('synthetic sessions are labelled and cover five stages',()=>{
 const a=demoSession(),b=demoVigorous();assert.equal(a.demonstration,true);assert.equal(b.demonstration,true);
 for(const p of PHASES){assert.ok(phaseResults(a.records[p.id]));assert.ok(phaseResults(b.records[p.id]));}
 assert.equal(phaseResults(b.records.exerciseLate).validSubstrates,false);
});
