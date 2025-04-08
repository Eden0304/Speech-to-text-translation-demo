"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, StopCircle } from "lucide-react"
import { createAudioRecorder, createAudioAnalyzer, convertAudioFormat } from "@/utils/audio-utils"
import { Progress } from "@/components/ui/progress"

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  onRecordingStart: () => void
  onError: (error: string) => void
  isDisabled?: boolean
  language?: string
  maxDuration?: number // in seconds
  customButton?: React.ReactNode
}

export function AudioRecorder({
  onRecordingComplete,
  onRecordingStart,
  onError,
  isDisabled = false,
  language = "english",
  maxDuration = 30, // default to 30 seconds
  customButton = null,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingProgress, setRecordingProgress] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const analyzerRef = useRef<any>(null)
  const audioLevelIntervalRef = useRef<number | null>(null)
  const recordingTimerRef = useRef<number | null>(null)

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      stopRecording()

      // Clean up audio analyzer
      if (analyzerRef.current) {
        analyzerRef.current.cleanup()
        analyzerRef.current = null
      }

      // Clear audio level interval
      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current)
        audioLevelIntervalRef.current = null
      }

      // Clear recording timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }

      // Clean up stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  // Start recording audio
  const startRecording = async () => {
    try {
      audioChunksRef.current = []
      setRecordingTime(0)
      setRecordingProgress(0)

      // Create audio recorder
      const mediaRecorder = await createAudioRecorder()
      mediaRecorderRef.current = mediaRecorder
      streamRef.current = mediaRecorder.stream

      // Set up audio analyzer
      const analyzer = createAudioAnalyzer(mediaRecorder.stream)
      analyzerRef.current = analyzer

      // Set up audio level visualization
      if (analyzer) {
        audioLevelIntervalRef.current = window.setInterval(() => {
          setAudioLevel(analyzer.getAudioLevel())
        }, 100)
      }

      // Set up recording timer
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1
          // Calculate progress as a percentage of maxDuration
          const progress = (newTime / maxDuration) * 100
          setRecordingProgress(progress)

          // Auto-stop recording if we reach the maximum duration
          if (newTime >= maxDuration) {
            stopRecording()
          }

          return newTime
        })
      }, 1000)

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // Create audio blob when recording stops
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

        // Convert audio format if needed
        const processedAudio = await convertAudioFormat(audioBlob, "audio/webm")

        // Call the callback with the audio blob
        onRecordingComplete(processedAudio)

        // Clean up resources
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }

        // Clear audio level interval
        if (audioLevelIntervalRef.current) {
          clearInterval(audioLevelIntervalRef.current)
          audioLevelIntervalRef.current = null
        }

        // Clear recording timer
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current)
          recordingTimerRef.current = null
        }

        // Reset audio level and recording time
        setAudioLevel(0)
        setRecordingTime(0)
        setRecordingProgress(0)
      }

      // Start recording
      mediaRecorder.start(1000) // Get data every second
      setIsRecording(true)
      onRecordingStart()
    } catch (error) {
      console.error("Error starting recording:", error)
      onError(error.message || "Failed to access microphone")
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Toggle recording state
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {customButton ? (
        <div onClick={toggleRecording} className={isDisabled ? "opacity-50 pointer-events-none" : ""}>
          {customButton}
        </div>
      ) : (
        <Button
          variant={isRecording ? "destructive" : "default"}
          onClick={toggleRecording}
          disabled={isDisabled}
          className="w-full bg-gradient-to-r from-gradient-start to-gradient-end hover:opacity-90 transition-opacity"
        >
          {isRecording ? (
            <>
              <StopCircle className="mr-2 h-4 w-4" />
              Stop Recording ({formatTime(maxDuration - recordingTime)})
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Start Recording (Max {maxDuration}s)
            </>
          )}
        </Button>
      )}

      {/* Recording progress */}
      {isRecording && !customButton && (
        <div className="w-full space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(recordingTime)}</span>
            <span>{formatTime(maxDuration)}</span>
          </div>
          <Progress value={recordingProgress} className="h-2" />
        </div>
      )}

      {/* Audio level visualization */}
      {isRecording && !customButton && (
        <div className="w-full h-8 bg-muted rounded-md overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gradient-start to-gradient-end transition-all duration-100"
            style={{ width: `${audioLevel}%` }}
          ></div>
        </div>
      )}
    </div>
  )
}
