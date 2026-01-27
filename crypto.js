async function encrypt(data, key){
  const enc = new TextEncoder().encode(key);
  const cryptoKey = await crypto.subtle.importKey(
    "raw", enc, "PBKDF2", false, ["deriveKey"]
  );
}
