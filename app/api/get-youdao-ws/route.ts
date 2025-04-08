import { createYoudaoWebSocketUrl } from "@/utils/youdao-websocket"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Get query parameters from the request URL
    const url = new URL(request.url)
    const sourceLanguage = url.searchParams.get("source") || "zh-CN"
    const targetLanguage = url.searchParams.get("target") || "en-US"

    console.log(`Creating WebSocket URL for ${sourceLanguage} to ${targetLanguage}`)

    // Create WebSocket URL - now async
    const wsUrl = await createYoudaoWebSocketUrl(sourceLanguage, targetLanguage)

    console.log(`WebSocket URL created: ${wsUrl}`)

    // Return the WebSocket URL
    return NextResponse.json({ url: wsUrl })
  } catch (error) {
    console.error("Error creating WebSocket URL:", error)
    return NextResponse.json(
      { error: "Failed to create WebSocket URL: " + (error.message || "Unknown error") },
      { status: 500 },
    )
  }
}
