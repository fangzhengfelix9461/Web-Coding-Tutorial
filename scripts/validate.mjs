import fs from "node:fs";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
process.chdir(fileURLToPath(new URL("../", import.meta.url)));
const events=JSON.parse(fs.readFileSync("events.json","utf8"));
assert(Array.isArray(events));
const ids=new Set();
for(const e of events){
  assert(typeof e.id==="string" && !ids.has(e.id)); ids.add(e.id);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(e.date));
  const d=new Date(e.date+"T00:00:00Z");
  assert(!isNaN(d)&&d.toISOString().slice(0,10)===e.date);
  assert(typeof e.title==="string" && e.title.length>0);
  assert(["course-a","course-b","tutorial","workshop","personal","study","deadline"].includes(e.category));
  for(const time of [e.start,e.end]) assert(time==="" || /^([01]\d|2[0-3]):[0-5]\d$/.test(time));
  assert((e.start===""&&e.end==="")||(e.start!==""&&e.end>e.start));
  assert(typeof e.details==="string");
}
for(const file of ["app.js","config.js"])execFileSync(process.execPath,["--check",file]);
const files=["index.html","app.js","config.js","styles.css","events.json","manifest.webmanifest","README.md"];
// Pattern scan supplements manual review; it cannot prove absence of all personal data.
for(const file of files){
 const text=fs.readFileSync(file,"utf8");
 assert(!/gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]+|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY/.test(text),file+": possible credential");
 assert(!/[A-Z]:\\Users\\|wxid_[a-z0-9_]+|xwechat_files/i.test(text),file+": possible personal source data");
}
console.log("PASS: event schema, unique IDs, valid times, JS syntax, known private-data and credential patterns");

