let MASTER=null;

function openVault(){ auth.hidden=true; vault.hidden=false; load(); }
function lock(){ vault.hidden=true; auth.hidden=false; MASTER=null; }

async function unlockWithPassword(){
  MASTER=pw.value;
  try{ await load(); openVault(); }
  catch{ msg.textContent="Wrong password"; }
}

async function save(){
  const f=file.files[0]; if(!f) return;
  const bytes=new Uint8Array(await f.arrayBuffer());
  const encPkg=await encryptBytes(bytes, MASTER);
  put({name:f.name,pkg:encPkg});
  load();
}

async function download(name, bytes){
  const blob = new Blob([bytes]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}

async function exportOne(name){
  getAll(async arr=>{
    const f = arr.find(x=>x.name===name);
    const b = await decryptBytes(f.pkg, MASTER);
    download(name, b);
  });
}

async function exportAll(){
  getAll(async arr=>{
    const zip = new JSZip();
    for(const o of arr){
      const b = await decryptBytes(o.pkg, MASTER);
      zip.file(o.name, b);
    }
    const blob = await zip.generateAsync({type:"blob"});
    download("vault.zip", await blob.arrayBuffer());
  });
}

async function load(){
  return new Promise((res,rej)=>{
    getAll(async arr=>{
      list.innerHTML="";
      for(const o of arr){
        const b=await decryptBytes(o.pkg, MASTER).catch(()=>null);
        if(!b) return rej();
        const li=document.createElement("li");
        li.innerHTML = `${o.name}
          <button onclick="exportOne('${o.name}')">⬇</button>`;
        list.appendChild(li);
      }
      res();
    });
  });
}
