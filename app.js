let MASTER=null;
let currentFolder="root";
let showTrashMode=false;
let folders=["root"];

function openVault(){ auth.hidden=true; vault.hidden=false; loadAll(); }
function lock(){ vault.hidden=true; auth.hidden=false; MASTER=null; }

async function unlockWithPassword(){
  MASTER=pw.value;
  try{ await loadAll(); openVault(); }
  catch{ msg.textContent="Wrong password"; }
}

async function save(){
  const f=file.files[0]; if(!f) return;
  const bytes=new Uint8Array(await f.arrayBuffer());
  const encPkg=await encryptBytes(bytes, MASTER);
  put({name:f.name, folder:currentFolder, trash:false, pkg:encPkg});
  loadAll();
}

function addFolder(){
  if(!newFolder.value) return;
  folders.push(newFolder.value);
  newFolder.value="";
  renderFoldersUI();
}
function renderFoldersUI(){
  folderList.innerHTML="";
  folders.forEach(f=>{
    const li=document.createElement("li");
    li.textContent=f;
    li.onclick=()=>{currentFolder=f;showTrashMode=false;loadAll();}
    folderList.appendChild(li);
  });
}

function render(arr){
  list.innerHTML="";
  const q=search.value.toLowerCase();
  arr.filter(o=>{
    if(showTrashMode && !o.trash) return false;
    if(!showTrashMode && o.trash) return false;
    if(o.folder!==currentFolder) return false;
    if(!o.name.toLowerCase().includes(q)) return false;
    return true;
  }).forEach(o=>{
    const li=document.createElement("li");
    li.innerHTML=`📄<br>${o.name}<br>
      <button onclick="exportOne('${o.name}')">⬇</button>
      <button onclick="moveToTrash('${o.name}')">🗑</button>`;
    list.appendChild(li);
  });
}

function showTrash(){ showTrashMode=!showTrashMode; loadAll(); }
function moveToTrash(name){
  getAll(arr=>{
    const f=arr.find(x=>x.name===name);
    f.trash=true;
    put(f); loadAll();
  });
}

function loadAll(){
  getAll(arr=>{
    folders=[...new Set(arr.map(a=>a.folder).concat(["root"]))];
    renderFoldersUI();
    render(arr);
  });
}

async function exportOne(name){
  getAll(async arr=>{
    const f=arr.find(x=>x.name===name);
    const b = await decryptBytes(f.pkg, MASTER);
    download(name,b);
  });
}

async function exportAll(){
  getAll(async arr=>{
    const zip=new JSZip();
    for(const o of arr.filter(x=>!x.trash)){
      const b=await decryptBytes(o.pkg, MASTER);
      zip.file(o.folder+"/"+o.name,b);
    }
    const blob=await zip.generateAsync({type:"blob"});
    download("vault.zip", await blob.arrayBuffer());
  });
}

function download(name, bytes){
  const blob=new Blob([bytes]);
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=name;
  a.click();
}
