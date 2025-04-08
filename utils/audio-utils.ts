// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Create audio recorder
export const createAudioRecorder = async () => {
  if (!isBrowser) {
    throw new Error("Audio recording is only available in browser environments")
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    })

    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.start()

    return {
      mediaRecorder,
      stream,
    }
  } catch (error) {
    console.error("Error accessing microphone:", error)
    throw new Error("Failed to access microphone: " + (error.message || "Unknown error"))
  }
}

// Create audio analyzer
export const createAudioAnalyzer = (stream) => {
  if (!isBrowser) {
    return null
  }

  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(stream)
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

    analyser.smoothingTimeConstant = 0.8
    analyser.fftSize = 1024

    microphone.connect(analyser)
    analyser.connect(javascriptNode)
    javascriptNode.connect(audioContext.destination)

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    return {
      getAudioLevel: () => {
        analyser.getByteFrequencyData(dataArray)
        let values = 0
        const length = dataArray.length
        for (let i = 0; i < length; i++) {
          values += dataArray[i]
        }
        const average = values / length
        return Math.min(100, Math.max(0, average * 1.5))
      },
      cleanup: () => {
        javascriptNode.disconnect()
        analyser.disconnect()
        microphone.disconnect()
        audioContext.close()
      },
    }
  } catch (error) {
    console.error("Error creating audio analyzer:", error)
    return null
  }
}

// Convert audio format if needed
export const convertAudioFormat = async (audioBlob, targetFormat) => {
  // For now, just return the original blob
  // In a real app, you might want to convert between formats
  return audioBlob
}
