"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Mic, Square } from "lucide-react"
import { Footer } from "@/components/footer"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSupportedLanguages } from "@/utils/youdao-websocket"
import { debounce } from "@/lib/utils"

// Format time as MM:SS.S
const formatTimeStamp = (seconds: number) => {
  const secs = Math.max(0, seconds)
  const mins = Math.floor(secs / 60)
  const remainingSecs = Math.floor(secs % 60)
  const tenths = Math.floor((secs % 1) * 10)
  return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}.${tenths}`
}

// Format current time as HH:MM:SS
const formatCurrentTime = () => {
  const now = new Date()
  return now.toLocaleTimeString() // Returns time in local format (e.g., "3:45:30 PM")
}

// Add WAV header information
const encodeWAV = (samples: Float32Array, sampleRate: number) => {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)

  // WAV header
  const writeString = (view: DataView, offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  writeString(view, 0, "RIFF")
  view.setUint32(4, 36 + samples.length * 2, true)
  writeString(view, 8, "WAVE")
  writeString(view, 12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, "data")
  view.setUint32(40, samples.length * 2, true)

  // PCM data
  const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]))
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
  }

  floatTo16BitPCM(view, 44, samples)
  return buffer
}

export default function TranslatePageClient() {
  const [sourceLanguage, setSourceLanguage] = useState("zh-CN")
  const [targetLanguage, setTargetLanguage] = useState("en-US")
  const [isTranslating, setIsTranslating] = useState(false)
  const [language, setLanguage] = useState("en")
  const [transcriptHistory, setTranscriptHistory] = useState([])
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [serviceAlert, setServiceAlert] = useState(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const [supportedLanguages, setSupportedLanguages] = useState({})
  const [currentTranscript, setCurrentTranscript] = useState({ source: "", translated: "" })

  const searchParams = useSearchParams()
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const scrollRef = useRef(null)

  // Web Audio API refs
  const audioContextRef = useRef(null)
  const processorRef = useRef(null)
  const sourceRef = useRef(null)
  const streamRef = useRef(null)
  const wsRef = useRef(null)
  const analyserRef = useRef(null)
  const animationFrameRef = useRef(null)
  const pingIntervalRef = useRef(null)

  // Language refs to avoid state update loops
  const sourceLanguageRef = useRef(sourceLanguage)
  const targetLanguageRef = useRef(targetLanguage)

  // Initialize supported languages only once
  useEffect(() => {
    setSupportedLanguages(getSupportedLanguages())
  }, [])

  // Update refs when state changes
  useEffect(() => {
    sourceLanguageRef.current = sourceLanguage
    targetLanguageRef.current = targetLanguage
  }, [sourceLanguage, targetLanguage])

  // Cleanup function to ensure all resources are properly released
  const cleanupResources = useCallback(() => {
    console.log("Cleaning up resources...")

    // Clear ping interval
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current)
      pingIntervalRef.current = null
    }

    // Close WebSocket connection
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        try {
          // Send proper end signal to Youdao API
          wsRef.current.send(JSON.stringify({ end: "true" }))
          console.log("Sent end message to WebSocket")
        } catch (error) {
          console.error("Error sending end message to WebSocket:", error)
        }
      }

      try {
        wsRef.current.close()
      } catch (error) {
        console.error("Error closing WebSocket:", error)
      }

      wsRef.current = null
    }

    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Disconnect audio nodes
    if (processorRef.current) {
      try {
        processorRef.current.disconnect()
      } catch (error) {
        console.error("Error disconnecting processor:", error)
      }
      processorRef.current = null
    }

    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect()
      } catch (error) {
        console.error("Error disconnecting source:", error)
      }
      sourceRef.current = null
    }

    if (analyserRef.current) {
      analyserRef.current = null
    }

    // Close audio context
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close()
      } catch (error) {
        console.error("Error closing audio context:", error)
      }
      audioContextRef.current = null
    }

    // Stop all audio tracks
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop())
      } catch (error) {
        console.error("Error stopping audio tracks:", error)
      }
      streamRef.current = null
    }

    console.log("All resources cleaned up")
  }, [])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupResources()
    }
  }, [cleanupResources])

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn) {
      setShowAuthModal(true)
    }

    // Get source and target languages from URL if available
    const sourceParam = searchParams.get("source")
    const targetParam = searchParams.get("target")

    if (sourceParam) {
      setSourceLanguage(sourceParam)
      sourceLanguageRef.current = sourceParam
    }

    if (targetParam) {
      setTargetLanguage(targetParam)
      targetLanguageRef.current = targetParam
    }

    // Load language from localStorage
    const savedLanguage = localStorage.getItem("speechTranslator-language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // Add event listeners
    const handleStorageChange = () => {
      const updatedLanguage = localStorage.getItem("speechTranslator-language")
      if (updatedLanguage) {
        setLanguage(updatedLanguage)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("languageChange", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("languageChange", handleStorageChange)
    }
  }, [searchParams, isLoggedIn, cleanupResources])

  // Scroll to bottom when new transcript is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcriptHistory, currentTranscript])

  // Initialize audio processing
  const initAudio = async (websocket) => {
    try {
      console.log("Initializing audio processing...")

      // Request microphone access with specific audio constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          noiseSuppression: true,
          echoCancellation: true,
        },
      })

      console.log("Microphone access granted")
      streamRef.current = stream

      // Create audio context with 16kHz sample rate
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000,
      })

      console.log("AudioContext created with sample rate:", audioContextRef.current.sampleRate)

      // Create media stream source
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream)

      // Create script processor for audio processing
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1)

      // Create analyzer for audio level visualization
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      // Connect source to analyzer
      sourceRef.current.connect(analyserRef.current)

      // Start audio level visualization
      const updateAudioLevel = () => {
        if (!analyserRef.current) return

        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
        setAudioLevel(Math.min(100, Math.max(0, average * 1.5)))

        animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
      }
      updateAudioLevel()

      // Handle audio processing with WAV encoding
      processorRef.current.onaudioprocess = (e) => {
        if (websocket?.readyState === WebSocket.OPEN) {
          const wavBuffer = encodeWAV(e.inputBuffer.getChannelData(0), 16000)
          websocket.send(wavBuffer)
        }
      }

      // Connect the audio nodes
      sourceRef.current.connect(processorRef.current)
      processorRef.current.connect(audioContextRef.current.destination)

      console.log("Audio processing initialized successfully")
      return true
    } catch (error) {
      console.error("Audio setup failed:", error)
      setServiceAlert({
        type: "error",
        message: error.message || "Failed to access microphone",
      })
      return false
    }
  }

  // Start recording
  const startRecording = async () => {
    try {
      console.log("Starting recording...")

      // Clean up any existing resources first
      cleanupResources()

      // Reset current transcript
      setCurrentTranscript({ source: "", translated: "" })

      // Set recording state first to update UI immediately
      setIsRecording(true)
      setServiceAlert(null)

      // Get WebSocket URL from API using refs to avoid state update loops
      console.log(`Fetching WebSocket URL for ${sourceLanguageRef.current} to ${targetLanguageRef.current}`)
      const res = await fetch(
        `/api/get-youdao-ws?source=${sourceLanguageRef.current}&target=${targetLanguageRef.current}`,
      )
      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const { url } = data
      console.log("WebSocket URL:", url)

      // Initialize WebSocket
      wsRef.current = new WebSocket(url)

      // Set up ping interval to keep connection alive
      pingIntervalRef.current = setInterval(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          // Send a small ping message to keep the connection alive
          const emptyBuffer = new ArrayBuffer(2)
          wsRef.current.send(emptyBuffer)
          console.log("Sent ping to keep WebSocket alive")
        }
      }, 5000) // Send ping every 5 seconds

      wsRef.current.onopen = async () => {
        console.log("WebSocket connection established")

        // Initialize audio processing after WebSocket is open
        const success = await initAudio(wsRef.current)
        if (!success) {
          stopRecording()
        }
      }

      // Updated WebSocket message handler based on the provided code
      wsRef.current.onmessage = (event) => {
        try {
          // Check if the message is a binary message (audio data)
          if (event.data instanceof Blob) {
            console.log("Received binary data from WebSocket")
            return
          }

          const response = JSON.parse(event.data)
          console.log("WebSocket message:", response)

          if (response.errorCode === "0") {
            // Process recognition results
            if (response.action === "recognition" && response.result) {
              const { context, tranContent, partial } = response.result

              // Update current transcript for real-time display
              if (context && tranContent) {
                setCurrentTranscript({
                  source: context,
                  translated: tranContent,
                })

                // If it's a complete sentence, add to history
                if (!partial) {
                  const newEntry = {
                    id: Date.now(),
                    timestamp: formatCurrentTime(), // Use current time instead of duration
                    source: context,
                    translated: tranContent,
                  }

                  setTranscriptHistory((prev) => [...prev, newEntry])
                }
              }
            }
          } else {
            console.error("API Error:", response)
            setServiceAlert({
              type: "error",
              message: `Translation error: ${response.errorCode}`,
            })
          }
        } catch (error) {
          console.error("Error parsing message:", error)
        }
      }

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error)
        setServiceAlert({
          type: "error",
          message: "Connection error with translation service",
        })
        stopRecording()
      }

      wsRef.current.onclose = (event) => {
        console.log("WebSocket connection closed with code:", event.code, "reason:", event.reason)

        // Handle specific close codes
        if (event.code === 1006) {
          setServiceAlert({
            type: "error",
            message: "Connection closed abnormally. This may be due to network issues or firewall settings.",
          })
        }

        stopRecording()
      }
    } catch (error) {
      console.error("Error starting recording:", error)
      setServiceAlert({
        type: "error",
        message: error.message || "Failed to start recording",
      })
      stopRecording()
    }
  }

  // Stop recording
  const stopRecording = () => {
    console.log("Stopping recording...")

    // Send proper end signal to Youdao API
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ end: "true" }))
        console.log("Sent end message to WebSocket")
      } catch (error) {
        console.error("Error sending end message to WebSocket:", error)
      }
    }

    cleanupResources()
    setIsRecording(false)
    setAudioLevel(0)
    console.log("Recording stopped")
  }

  // Toggle recording with debounce to prevent rapid clicking issues
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  // Create debounced version of toggle function
  const debouncedToggle = useMemo(() => debounce(toggleRecording, 300), [isRecording])

  // Handle language change - now just updates state and localStorage without auto-restarting
  const handleSourceLanguageChange = (value) => {
    console.log("Source language changed to:", value)
    setSourceLanguage(value)
    sourceLanguageRef.current = value
    localStorage.setItem("speechTranslator-sourceLanguage", value)

    // If recording, stop recording
    if (isRecording) {
      stopRecording()
    }
  }

  const handleTargetLanguageChange = (value) => {
    console.log("Target language changed to:", value)
    setTargetLanguage(value)
    targetLanguageRef.current = value
    localStorage.setItem("speechTranslator-targetLanguage", value)

    // If recording, stop recording
    if (isRecording) {
      stopRecording()
    }
  }

  // Translations for UI elements
  const translations = {
    en: {
      realTimeTranslation: "Real-Time Speech Translation",
      record: "Record",
      recording: "Recording...",
      processing: "Processing...",
      serviceAlert: "Service Alert",
      serviceUnavailable: "Service Unavailable",
      yourTranslationsWillAppear: "Your translations will appear here",
      stopRecording: "Stop",
      languageChanged: "Language changed. Please restart recording.",
      currentlyTranslating: "Currently translating...",
    },
    zh: {
      realTimeTranslation: "实时语音翻译",
      record: "录音",
      recording: "录音中...",
      processing: "处理中...",
      serviceAlert: "服务提醒",
      serviceUnavailable: "服务不可用",
      yourTranslationsWillAppear: "您的翻译将显示在这里",
      stopRecording: "停止",
      languageChanged: "语言已更改。请重新开始录音。",
      currentlyTranslating: "正在翻译...",
    },
  }

  // Get current language translations
  const t = translations[language] || translations.en

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold">{t.realTimeTranslation}</h1>
          </div>

          {/* Service Alert */}
          {serviceAlert && (
            <Alert variant={serviceAlert.type === "error" ? "destructive" : "warning"}>
              <AlertTitle>{serviceAlert.type === "error" ? t.serviceUnavailable : t.serviceAlert}</AlertTitle>
              <AlertDescription>{serviceAlert.message}</AlertDescription>
            </Alert>
          )}

          {/* Main content */}
          <Card className="p-6 bg-gray-50 rounded-lg">
            {/* Transcript history */}
            <div ref={scrollRef} className="mb-6 h-[400px] overflow-y-auto p-4 bg-white rounded-lg shadow-inner">
              {transcriptHistory.length === 0 && !currentTranscript.source ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>{t.yourTranslationsWillAppear}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Past transcripts */}
                  {transcriptHistory.map((entry) => (
                    <div key={entry.id} className="space-y-2">
                      <div className="text-xs text-gray-500">{entry.timestamp}</div>
                      <div className="space-y-1">
                        <p className="text-gray-900">{entry.source}</p>
                        <p className="text-gray-700">{entry.translated}</p>
                      </div>
                    </div>
                  ))}

                  {/* Current transcript (real-time) */}
                  {currentTranscript.source && (
                    <div className="space-y-2 border-l-4 border-gradient-start pl-3 animate-pulse">
                      <div className="text-xs text-gradient-start font-medium">{t.currentlyTranslating}</div>
                      <div className="space-y-1">
                        <p className="text-gray-900">{currentTranscript.source}</p>
                        <p className="text-gray-700">{currentTranscript.translated}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Language selection */}
              <div className="w-full md:w-auto">
                <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-sm border">
                  <Select value={sourceLanguage} onValueChange={handleSourceLanguageChange}>
                    <SelectTrigger className="w-[100px] border-none shadow-none">
                      <SelectValue placeholder={supportedLanguages[sourceLanguage] || sourceLanguage} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(supportedLanguages).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-gray-400 mx-2">→</span>
                  <Select value={targetLanguage} onValueChange={handleTargetLanguageChange}>
                    <SelectTrigger className="w-[100px] border-none shadow-none">
                      <SelectValue placeholder={supportedLanguages[targetLanguage] || targetLanguage} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(supportedLanguages).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Recording button */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  className="rounded-full bg-gradient-to-r from-gradient-start to-gradient-end hover:opacity-90 transition-opacity text-white w-[120px] h-[48px]"
                  disabled={isTranslating}
                  onClick={debouncedToggle}
                >
                  {isRecording ? (
                    <span className="flex items-center">
                      <Square className="mr-2 h-4 w-4" />
                      {t.stopRecording}
                    </span>
                  ) : isTranslating ? (
                    t.processing
                  ) : (
                    <span className="flex items-center">
                      <Mic className="mr-2 h-5 w-5" />
                      {t.record}
                    </span>
                  )}
                </Button>

                {/* Audio level visualization */}
                {isRecording && (
                  <div className="w-[120px] h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gradient-start to-gradient-end transition-all duration-100"
                      style={{ width: `${audioLevel}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false)
          if (!isLoggedIn) {
            router.push("/")
          }
        }}
      />
    </div>
  )
}
