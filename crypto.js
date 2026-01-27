const enc = new TextEncoder(), dec = new TextDecoder();

async function deriveKey(password, salt){
  const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    {name:"PBKDF2", salt, iterations:100000, hash:"SHA-256"},
    base,{name:"AES-GCM", length:256},false,["encrypt","decrypt"]
  );
}

async function encryptBytes(bytes, password){
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const data = await crypto.subtle.encrypt({name:"AES-GCM", iv}, key, bytes);
  return {salt:[...salt], iv:[...iv], data:[...new Uint8Array(data)]};
}

async function decryptBytes(pkg, password){
  const salt = new Uint8Array(pkg.salt), iv=new Uint8Array(pkg.iv);
  const key = await deriveKey(password, salt);
  const buf = await crypto.subtle.decrypt({name:"AES-GCM", iv}, key, new Uint8Array(pkg.data));
  return new Uint8Array(buf);
}
