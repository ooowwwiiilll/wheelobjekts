import crypto from 'crypto';
import fs from 'fs';

const password = process.argv[2];
if (!password) {
  console.error("Usage: node encrypt.mjs <password>");
  process.exit(1);
}

const plaintext = fs.readFileSync('wip-data.json', 'utf8');

const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);

crypto.pbkdf2(password, salt, 100000, 32, 'sha-256', (err, key) => {
  if (err) throw err;
  
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(plaintext, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  // Combine encrypted data and authTag for WebCrypto compatibility
  const ciphertext = Buffer.concat([encrypted, authTag]);

  const output = {
    salt: Array.from(salt),
    iv: Array.from(iv),
    ciphertext: Array.from(ciphertext)
  };
  
  fs.writeFileSync('public/wip-encrypted.json', JSON.stringify(output));
  console.log('Successfully encrypted to public/wip-encrypted.json');
});
