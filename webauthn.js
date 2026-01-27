function b64(u){return btoa(String.fromCharCode(...new Uint8Array(u))).replace(/=/g,"")}
function ub64(s){return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}

async function registerPasskey(){
  const cred = await navigator.credentials.create({
    publicKey:{
      rp:{name:"HiddenVault"},
      user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"user",displayName:"user"},
      challenge:crypto.getRandomValues(new Uint8Array(32)),
      pubKeyCredParams:[{type:"public-key",alg:-7}],
      authenticatorSelection:{userVerification:"required"}
    }
  });
  localStorage.setItem("pk", b64(cred.rawId));
  msg.textContent="パスキー登録完了";
}

async function unlockWithPasskey(){
  const id=localStorage.getItem("pk");
  if(!id) return msg.textContent="未登録";
  const assertion = await navigator.credentials.get({
    publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),allowCredentials:[{id:ub64(id),type:"public-key"}]}
  });
  if(assertion) openVault();
}
