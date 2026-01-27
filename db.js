let db;
const req = indexedDB.open("vault",1);
req.onupgradeneeded = e=>{
  db = e.target.result;
  db.createObjectStore("files",{keyPath:"name"});
};
req.onsuccess = e=> db = e.target.result;

function saveFile(obj){
  const tx = db.transaction("files","readwrite");
  tx.objectStore("files").put(obj);
}
