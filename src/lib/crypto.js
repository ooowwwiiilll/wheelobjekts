export async function decryptData(encryptedData, password) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  try {
    const data = typeof encryptedData === 'string' ? JSON.parse(encryptedData) : encryptedData;
    const iv = new Uint8Array(data.iv);
    const salt = new Uint8Array(data.salt);
    const ciphertext = new Uint8Array(data.ciphertext);

    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      ciphertext
    );

    return JSON.parse(decoder.decode(decrypted));
  } catch (e) {
    throw new Error("Invalid decryption key or corrupted data.");
  }
}
