// Shared WIP loader — one place both modes use to unlock the confidential items.
// Fetches the encrypted blob and decrypts it client-side with the user's password.
// Returns the raw wip items: [{ id, img, title, html }] (as authored in wip-data.json).
import { decryptData } from "../lib/crypto.js";

export async function loadWipItems(password) {
  const res = await fetch("/wip-encrypted.json");
  const encryptedData = await res.json();
  return await decryptData(encryptedData, password);
}
