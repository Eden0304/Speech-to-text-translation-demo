// Browser-compatible crypto functions

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * SHA-256 hash function for browser
 * Uses SubtleCrypto API if available, otherwise falls back to a simple hash
 */
export async function sha256(message: string): Promise<string> {
  // Use SubtleCrypto if available (modern browsers)
  if (window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  // Fallback for older browsers
  return simpleHash(message)
}

/**
 * Simple hash function for browsers without SubtleCrypto
 * Note: This is NOT cryptographically secure and should only be used as a fallback
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  // Convert to hex string
  let hexString = ""
  for (let i = 0; i < 8; i++) {
    const byte = (hash >> (i * 4)) & 0xf
    hexString += byte.toString(16)
  }

  // Pad to look like SHA-256 (not secure, just for appearance)
  return hexString.padEnd(64, "0")
}
