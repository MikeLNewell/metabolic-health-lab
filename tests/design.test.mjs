import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/app.css',import.meta.url),'utf8');
const tokens=readFileSync(new URL('../assets/tokens.css',import.meta.url),'utf8');
const js=readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
test('shared design tokens are loaded before components',()=>{
 assert.ok(html.indexOf('assets/tokens.css')<html.indexOf('assets/app.css'));
 for(const k of ['--canvas','--surface','--ink','--accent','--derived','--exercise','--recovery','--font-data','--radius-control','--duration-normal'])assert.ok(tokens.includes(k),`Missing ${k}`);
});
test('an accessible sampling rail and navigation landmarks are present',()=>{
 assert.match(html,/id="session-rail"/);
 assert.match(html,/href="#main"/);
 assert.match(html,/aria-controls="sidebar"/);
 assert.match(js,/data-action="jumpPhase"/);
 assert.match(js,/function windowStates\(/);
});
test('students can distinguish measured, calculated and optional information',()=>{
 for(const label of ['Measured · VO₂, VCO₂','Calculated · RER, expenditure','OPTIONAL CHALLENGES'])assert.ok(js.includes(label));
 assert.match(css,/\.derived-metric/);
 assert.match(js,/function refreshLiveReadouts\(/);
});
test('mobile and reduced-motion rules are included',()=>{
 assert.match(css,/@media\(max-width:520px\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/\.rail-windows\{overflow-x:auto/);
});