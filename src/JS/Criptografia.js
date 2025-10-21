async function getKey(secretKey) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.digest("SHA-256", enc.encode(secretKey)); // 32 bytes
  return crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptPassword(password, secretKey) {
  const key = await getKey(secretKey);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM precisa de 12 bytes de IV
  const enc = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(password)
  );

  // Retorna base64 do IV + dados criptografados
  const buffer = new Uint8Array(iv.byteLength + encrypted.byteLength);
  buffer.set(iv, 0);
  buffer.set(new Uint8Array(encrypted), iv.byteLength);
  return btoa(String.fromCharCode(...buffer));
}

async function decryptPassword(encryptedBase64, secretKey) {
  const data = atob(encryptedBase64);
  const raw = Uint8Array.from(data, c => c.charCodeAt(0));
  const iv = raw.slice(0, 12);
  const encrypted = raw.slice(12);

  const key = await getKey(secretKey);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  );
  return new TextDecoder().decode(decrypted);
}

export { encryptPassword, decryptPassword };
