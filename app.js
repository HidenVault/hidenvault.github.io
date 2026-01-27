let MASTER=null;

function openVault(){ auth.hidden=true; vault.hidden=false; load(); }
function lock(){ vault.hidden=true; auth.hidden=false; MASTER=null; }

async function unlockWithPassword(){
  MASTER=pw.value;
  try{ await load(); openVault(); }catch{ msg.textContent="Wrong password"; }
}

async function save(){
  const f=file.files[0]; if(!f) return;
  const bytes=new Uint8Array(await f.arrayBuffer());
  const encPkg=await encryptBytes(bytes, MASTER);
  put({name:f.name,pkg:encPkg});
  load();
}

async function load(){
  return new Promise((res,rej)=>{
    getAll(async arr=>{
      list.innerHTML="";
      for(const o of arr){
        const b=await decryptBytes(o.pkg, MASTER).catch(()=>null);
        if(!b) return rej();
        const li=document.createElement("li");
        li.textContent=o.name; list.appendChild(li);
      }
      res();
    });
  });
}
