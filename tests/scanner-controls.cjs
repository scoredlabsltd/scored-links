// Real pinned scanner controls; all credentials are generated synthetic/non-issued.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const scanner=process.argv[2];assert(scanner);const temp=fs.mkdtempSync(path.join(os.tmpdir(),'scored-links-scan-'));
try{
 const fixture=path.join(temp,'fixture');fs.mkdirSync(fixture);const output=path.join(temp,'result.json');
 const alpha='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';const sample=Array.from({length:36},(_,i)=>alpha[(i*17+3)%62]).join('');
 fs.writeFileSync(path.join(fixture,'public-code.js'),'github_token = "'+('gh'+'p_')+sample+'"\napi_key = "'+sample+'"\n');
 let r=cp.spawnSync(scanner,['dir',fixture,'--redact=100','--report-format=json','--report-path',output],{stdio:'ignore'});assert.equal(r.status,1);const rules=new Set(JSON.parse(fs.readFileSync(output,'utf8')).map(x=>x.RuleID));assert(rules.has('github-pat')&&rules.has('generic-api-key'));
 fs.writeFileSync(path.join(fixture,'public-code.js'),'Public nonsecret routing control.\n');r=cp.spawnSync(scanner,['dir',fixture,'--redact=100','--report-format=json','--report-path',output],{stdio:'ignore'});assert.equal(r.status,0);assert.equal(JSON.parse(fs.readFileSync(output,'utf8')).length,0);
 console.log('PASS real scanner synthetic credential and benign controls; no raw values printed');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
