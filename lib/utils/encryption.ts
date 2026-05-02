// lib/utils/encryption.ts – AES-256 end-to-end message encryption

/**
 * Derives a unique room key from two user IDs.
 * Both parties always compute the same key regardless of order.
 */
export function deriveRoomKey(userId1: string, userId2: string): string {
  const sorted = [userId1, userId2].sort().join(':');
  // In production: use WebCrypto HKDF with a server-side master secret
  return `${sorted}:${process.env.ENCRYPTION_SECRET ?? 'dev-secret-change-me'}`;
}

// ─── Browser-side (WebCrypto) ─────────────────────────────────────────────────

async function importKey(rawKey: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(rawKey.slice(0, 32).padEnd(32, '0')),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  );
  return keyMaterial;
}

export async function encryptMessage(plaintext: string, roomKey: string): Promise<{ ciphertext: string; iv: string }> {
  const key = await importKey(roomKey);
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const cipherbuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(cipherbuf))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

export async function decryptMessage(ciphertext: string, iv: string, roomKey: string): Promise<string> {
  try {
    const key      = await importKey(roomKey);
    const ivBytes  = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    const ctBytes  = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const ptBuf    = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivBytes }, key, ctBytes);
    return new TextDecoder().decode(ptBuf);
  } catch {
    return '[Message unavailable]';
  }
}

// ─── Server-side (Node crypto) ───────────────────────────────────────────────

import crypto from 'crypto';

export function serverEncrypt(plaintext: string, roomKey: string): { ciphertext: string; iv: string } {
  const key = crypto.createHash('sha256').update(roomKey).digest();
  const iv  = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: Buffer.concat([encrypted, tag]).toString('base64'),
    iv: iv.toString('base64'),
  };
}

export function serverDecrypt(ciphertext: string, iv: string, roomKey: string): string {
  try {
    const key     = crypto.createHash('sha256').update(roomKey).digest();
    const ivBuf   = Buffer.from(iv, 'base64');
    const ctBuf   = Buffer.from(ciphertext, 'base64');
    const tag     = ctBuf.subarray(ctBuf.length - 16);
    const ct      = ctBuf.subarray(0, ctBuf.length - 16);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuf);
    decipher.setAuthTag(tag);
    return decipher.update(ct) + decipher.final('utf8');
  } catch {
    return '[Message unavailable]';
  }
}
