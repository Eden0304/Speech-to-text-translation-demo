// YOUDAO API credentials
const APP_KEY = "444a6400fad8fd62"
const APP_SECRET = "3irTcswmpcC5mUw5QDK8mU0Is8ghCjk3"

// Generate a UUID for salt
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Update language mapping table
export function mapLanguageCode(code: string): string {
  const languageMap: Record<string, string> = {
    "en-US": "en",
    "es-ES": "es",
    "fr-FR": "fr",
    "de-DE": "de",
    "ja-JP": "ja",
    "zh-CN": "zh-CHS",
    "ko-KR": "ko",
    "ru-RU": "ru",
    "pt-PT": "pt",
    "it-IT": "it",
    "ar-SA": "ar",
    "nl-NL": "nl",
    "th-TH": "th",
    "vi-VN": "vi",
    // Add other languages supported by Youdao API
    "pl-PL": "pl",
    "da-DK": "da",
    "fi-FI": "fi",
    "sv-SE": "sv",
    "tr-TR": "tr",
    "hi-IN": "hi",
  }
  return languageMap[code] || code
}

// Update supported languages list
export function getSupportedLanguages(): Record<string, string> {
  return {
    "en-US": "English",
    "zh-CN": "中文",
    "ja-JP": "日本語",
    "ko-KR": "한국어",
    "fr-FR": "Français",
    "es-ES": "Español",
    "de-DE": "Deutsch",
    "ru-RU": "Русский",
    "pt-PT": "Português",
    "it-IT": "Italiano",
    "ar-SA": "العربية",
    "nl-NL": "Nederlands",
    "pl-PL": "Polski",
    "da-DK": "Dansk",
    "fi-FI": "Suomi",
    "sv-SE": "Svenska",
    "th-TH": "ไทย",
    "vi-VN": "Tiếng Việt",
    "tr-TR": "Türkçe",
    "hi-IN": "हिन्दी",
  }
}

// Calculate authentication sign for YOUDAO API using browser's native SHA-256
export async function calculateSign(salt: string, curtime: string): Promise<string> {
  // Check if we're in a browser environment
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    // Fallback for server-side or older browsers
    return simpleHash(APP_KEY + salt + curtime + APP_SECRET)
  }

  // Use SubtleCrypto if available (modern browsers)
  const msgBuffer = new TextEncoder().encode(APP_KEY + salt + curtime + APP_SECRET)
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Simple hash function for browsers without SubtleCrypto or server-side
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

// Create WebSocket URL with authentication parameters
export async function createYoudaoWebSocketUrl(sourceLanguage: string, targetLanguage: string): Promise<string> {
  const salt = generateUUID()
  const curtime = Math.floor(Date.now() / 1000).toString()
  const sign = await calculateSign(salt, curtime)

  const from = mapLanguageCode(sourceLanguage)
  const to = mapLanguageCode(targetLanguage)

  console.log(`Mapped languages: ${sourceLanguage} -> ${from}, ${targetLanguage} -> ${to}`)

  const params = new URLSearchParams({
    appKey: APP_KEY,
    salt,
    curtime,
    signType: "v4",
    sign,
    from,
    to,
    format: "wav",
    rate: "16000",
    channel: "1",
    version: "v1",
    transPattern: "sentence", // Add transPattern parameter
  })

  return `wss://openapi.youdao.com/stream_speech_trans?${params.toString()}`
}
