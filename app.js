let PASSWORD = "1234";

function unlock(){
  const pin = document.getElementById("pin").value;
  if(pin===PASSWORD){
    lock.hidden=true;
    vault.hidden=false;
    load();
  } else alert("Wrong");
}

function save(){
  const f = file.files[0];
  const r = new FileReader();
  r.onload = ()=> saveFile({name:f.name,data:r.result});
  r.readAsDataURL(f);
}

function load(){
  const tx = db.transaction("files");
  tx.objectStore("files").getAll().onsuccess = e=>{
    list.innerHTML="";
    e.target.result.forEach(f=>{
      const li=document.createElement("li");
      li.textContent=f.name;
      list.appendChild(li);
    });
  }
}
