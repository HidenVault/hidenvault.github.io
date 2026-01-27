let db;
const req = indexedDB.open("vault",1);
req.onupgradeneeded=e=>{
  db=e.target.result;
  db.createObjectStore("files",{keyPath:"name"});
};
req.onsuccess=e=>db=e.target.result;

function put(obj){
  const tx=db.transaction("files","readwrite");
  tx.objectStore("files").put(obj);
}
function getAll(cb){
  const tx=db.transaction("files");
  tx.objectStore("files").getAll().onsuccess=e=>cb(e.target.result||[]);
}
