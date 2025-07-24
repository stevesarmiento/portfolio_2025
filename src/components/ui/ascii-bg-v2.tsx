"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"

// Define a type for colored ASCII characters
type ColoredChar = {
  char: string
  color: string
}

export default function AsciiBgV2() {
  console.log("🚀🚀🚀 NEW ASCII COMPONENT LOADED V2 🚀🚀🚀", new Date().toISOString())
  
  const [asciiArt, setAsciiArt] = useState<string>("")
  const [coloredAsciiArt, setColoredAsciiArt] = useState<ColoredChar[][]>([])
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const outputCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const mountedRef = useRef(true)

  // Fixed parameters - adjust these as needed
  const resolution = 0.35 // Slightly reduced for better performance
  const inverted = false
  const grayscale = false
  const charSet = "minimal"

  const charSets = {
    standard: " .:-=+*#%@",
    detailed: " .,:;i1tfLCG08@",
    blocks: " ░▒▓█",
    minimal: " . ",
  }

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ""
        videoRef.current.load()
      }
    }
  }, [])

  // Memoized conversion function
  const convertToAscii = useCallback(() => {
    if (!mountedRef.current) return
    
    try {
      if (!canvasRef.current || !videoRef.current) {
        console.log("❌ Missing canvas or video ref")
        return
      }
      
      console.log("🔄 Converting frame to ASCII...")

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) {
        console.log("❌ Failed to get canvas context for conversion")
        return
      }

      const video = videoRef.current
      
      // Check if video is ready
      if (video.readyState < 2) {
        console.log("❌ Video not ready yet")
        return
      }
      
      // Set canvas size to video size
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Clear the canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw video to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Get image data
      let imageData
      try {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      } catch (e) {
        console.log("❌ Failed to get image data:", e)
        return // Skip this frame if we can't get image data
      }

      const data = imageData.data

      // Choose character set
      const chars = charSets[charSet as keyof typeof charSets]

      // Calculate dimensions for ASCII output
      const outputWidth = Math.floor(canvas.width * resolution)
      const outputHeight = Math.floor(canvas.height * resolution * 0.5) // Account for font aspect ratio

      const widthStep = Math.ceil(canvas.width / outputWidth)
      const heightStep = Math.ceil(canvas.height / outputHeight)

      let result = ""
      const coloredResult: ColoredChar[][] = []

      // Process the image
      for (let y = 0; y < canvas.height; y += heightStep) {
        const coloredRow: ColoredChar[] = []

        for (let x = 0; x < canvas.width; x += widthStep) {
          const pos = (y * canvas.width + x) * 4

          const r = data[pos] || 0
          const g = data[pos + 1] || 0
          const b = data[pos + 2] || 0

          // Calculate brightness
          let brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255

          // Invert if needed
          if (inverted) brightness = 1 - brightness

          // Map brightness to character
          const charIndex = Math.floor(brightness * (chars.length - 1))
          const char = chars[charIndex] || " "

          result += char

          // For colored mode, store the character and its color
          if (!grayscale) {
            const brightnessFactor = Math.max(0.3, (charIndex / (chars.length - 1)) * 1.5 + 0.5)
            const adjustedR = Math.max(Math.min(Math.round(r * brightnessFactor), 255), 60)
            const adjustedG = Math.max(Math.min(Math.round(g * brightnessFactor), 255), 60)
            const adjustedB = Math.max(Math.min(Math.round(b * brightnessFactor), 255), 60)
            const color = `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`
            coloredRow.push({ char, color })
          } else {
            coloredRow.push({ char, color: "white" })
          }
        }

        result += "\n"
        coloredResult.push(coloredRow)
      }

      if (mountedRef.current) {
        setAsciiArt(result)
        setColoredAsciiArt(coloredResult)
        setError(null)
      }
      
      console.log("✅ ASCII conversion complete. Result length:", result.length, "Colored rows:", coloredResult.length)
    } catch (err) {
      console.error("❌ Error converting to ASCII:", err)
      if (mountedRef.current) {
        setError(`ASCII conversion error: ${err instanceof Error ? err.message : "Unknown error"}`)
      }
    }
  }, [resolution, inverted, grayscale, charSet])

  const renderToCanvas = useCallback(() => {
    if (!mountedRef.current) return
    
    if (!outputCanvasRef.current || (!asciiArt && coloredAsciiArt.length === 0)) {
      console.log("🚫 Render skipped - missing canvas/ASCII data")
      return
    }

    console.log("🖼️ Rendering ASCII to canvas...")
    
    const canvas = outputCanvasRef.current
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) {
      console.log("❌ Failed to get canvas context")
      return
    }

    // Set font properties
    const fontSize = 8
    const lineHeight = fontSize * 0.8
    const charWidth = fontSize * 0.6

    // Calculate canvas dimensions
    let canvasWidth, canvasHeight
    if (grayscale && asciiArt) {
      const lines = asciiArt.split("\n").filter(line => line.length > 0)
      const maxLineLength = Math.max(...lines.map((line) => line.length))
      canvasWidth = maxLineLength * charWidth
      canvasHeight = lines.length * lineHeight
    } else if (coloredAsciiArt.length > 0) {
      canvasWidth = (coloredAsciiArt[0]?.length || 0) * charWidth
      canvasHeight = coloredAsciiArt.length * lineHeight
    } else {
      return
    }

    // Set canvas size
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set font properties after canvas resize
    ctx.font = `${fontSize}px monospace`
    ctx.textBaseline = "top"

    // Render the ASCII art
    if (grayscale && asciiArt) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      const lines = asciiArt.split("\n").filter(line => line.length > 0)
      lines.forEach((line, lineIndex) => {
        ctx.fillText(line, 0, lineIndex * lineHeight)
      })
    } else {
      coloredAsciiArt.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          ctx.fillStyle = col.color
          ctx.fillText(col.char, colIndex * charWidth, rowIndex * lineHeight)
        })
      })
    }

    console.log("✅ ASCII rendered to canvas successfully")
  }, [asciiArt, coloredAsciiArt, grayscale])

  const loadVideo = useCallback(async () => {
    if (isLoading || !mountedRef.current) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      console.log("📥 Creating video element...")
      
      // Create a new video element
      const video = document.createElement("video")
      video.crossOrigin = "anonymous"
      video.loop = true
      video.muted = true
      video.playsInline = true
      video.autoplay = false // Don't autoplay initially

      // Use Big Buck Bunny - a reliable open source video
      // const videoUrl = "https://cdn.midjourney.com/video/5968eaf4-8897-47f5-9850-3b64a3a72f5e/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/91b92886-9e4a-4a39-9c8f-bc6f75635012/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/d0f201b5-3746-424e-9507-1a7996e94227/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/91f43552-5b7c-4451-81af-42af5e342a6c/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/561afba0-b9a4-4d8b-ae50-3b528862369d/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/790f3e18-4d55-4b9c-bc39-ce423c85421e/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/860c7a91-e2f3-4211-af82-4950de922ed7/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/1703ed12-23ee-4b5d-a73d-4c1acd46e823/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/b99e9209-ca8a-45ef-b121-803b01c31506/0.mp4"
      //  const videoUrl = "https://cdn.midjourney.com/video/a5db9318-5787-4e7b-9970-12e005ae9e25/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/c6fea955-cf63-489b-9d0a-aa4e55705478/0.mp4"
      //  const videoUrl = "https://cdn.midjourney.com/video/355af0af-465d-43a3-92bc-6cc8dcd9f0ea/0.mp4"
      //  const videoUrl = "https://cdn.midjourney.com/video/6a379917-a44d-4f68-9ac1-7c1f9e5d4e21/0.mp4"
      //  const videoUrl = "https://cdn.midjourney.com/video/196e067c-6a32-4b42-9476-66bd56f6b775/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/a851e2d9-d630-46fa-a6f8-08742647d348/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/16b86ec9-f310-4d40-95be-9c5bc885ac84/0.mp4"

      // GOOD TO GO
      // const videoUrl = "https://cdn.midjourney.com/video/0f357baf-1a92-4acf-b074-9ddc377d7805/0.mp4"
     const videoUrl = "https://cdn.midjourney.com/video/4f2e9964-3aed-4452-a74a-332f9ff74bc9/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/ad03f41b-e25f-4ea3-b617-5a4e9193f861/0.mp4"
      // const videoUrl = "https://cdn.midjourney.com/video/8a467a72-d5dd-4065-87a2-4766dc7034e9/0.mp4"



      console.log("📥 Loading video from:", videoUrl)
      
      const loadPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Video load timeout"))
        }, 15000) // 15 second timeout

        video.onloadeddata = () => {
          clearTimeout(timeout)
          console.log("🎥 Video data loaded:", video.videoWidth, "x", video.videoHeight, "duration:", video.duration)
          
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            reject(new Error("Invalid video dimensions"))
            return
          }

          if (mountedRef.current) {
            videoRef.current = video
            setMediaLoaded(true)
            setIsLoading(false)
          }
          resolve()
        }

        video.onerror = (e) => {
          clearTimeout(timeout)
          console.log("❌ Video loading failed:", e)
          reject(new Error("Video loading failed"))
        }
      })

      video.src = videoUrl
      video.load()
      
      await loadPromise

    } catch (err) {
      console.error("Error loading video:", err)
      if (mountedRef.current) {
        setError(`Failed to load video: ${err instanceof Error ? err.message : "Unknown error"}`)
        setIsLoading(false)
      }
    }
  }, [isLoading])

  // Video loading effect
  useEffect(() => {
    console.log("🎬 LOADING VIDEO ON MOUNT")
    if (!isLoading && !mediaLoaded && mountedRef.current) {
      loadVideo()
    }
  }, [loadVideo, isLoading, mediaLoaded])

  // Media loaded effect
  useEffect(() => {
    console.log("🎬 Media loaded effect - mediaLoaded:", mediaLoaded, "videoRef exists:", !!videoRef.current)
    if (mediaLoaded && videoRef.current && mountedRef.current) {
      console.log("✅ Starting ASCII conversion and playback...")
      convertToAscii()
      if (!isPlaying) {
        setIsPlaying(true)
      }
    }
  }, [mediaLoaded, convertToAscii, isPlaying])

  // Animation loop effect
  useEffect(() => {
    if (!videoRef.current || !mediaLoaded || !mountedRef.current) return

    const video = videoRef.current

    const handleTimeUpdate = () => {
      if (video.currentTime >= video.duration) {
        video.currentTime = 0 // Loop the video
      }
    }

    const handleCanPlay = () => {
      console.log("🎥 Video can play")
      if (isPlaying && mountedRef.current) {
        video.play().catch((err) => {
          console.error("Error playing video:", err)
          if (mountedRef.current) {
            setError("Failed to play video")
          }
        })
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("canplay", handleCanPlay)

    // Animation loop for playing
    const animateVideo = () => {
      if (!mountedRef.current) return
      
      if (isPlaying && video && !video.paused && !video.ended) {
        convertToAscii()
        animationFrameRef.current = requestAnimationFrame(animateVideo)
      } else {
        console.log("❌ Animation stopped - isPlaying:", isPlaying, "video exists:", !!video, "not paused:", video ? !video.paused : false)
      }
    }

    if (isPlaying && mediaLoaded && mountedRef.current) {
      console.log("▶️ Starting video playback...")
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA
        video.play().catch((err) => {
          console.error("Error playing video:", err)
          if (mountedRef.current) {
            setError("Failed to play video")
          }
        })
      }
      animateVideo()
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("canplay", handleCanPlay)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, mediaLoaded, convertToAscii])

  // Render effect
  useEffect(() => {
    if (mediaLoaded && !error && mountedRef.current) {
      renderToCanvas()
    }
  }, [asciiArt, coloredAsciiArt, renderToCanvas, mediaLoaded, error])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950">
        <div className="text-red-400 font-mono text-center p-4 text-sm">
          <div className="mb-2">Video loading failed</div>
          <div className="text-xs opacity-70">{error}</div>
          <button 
            onClick={() => {
              setError(null)
              setMediaLoaded(false)
              setIsLoading(false)
              loadVideo()
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-hidden relative">
      <canvas ref={canvasRef} className="hidden" />
      
      <canvas
        ref={outputCanvasRef}
        className="absolute inset-0 w-full h-full object-contain"
        style={{
          imageRendering: "pixelated",
        }}
      />
      
      {!mediaLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white font-mono text-sm">
            {isLoading ? "Loading video..." : "Initializing..."}
          </div>
        </div>
      )}
      
      {/* Debug info - remove in production */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-4 text-white font-mono text-xs bg-black/50 p-2 rounded">
          <div>Media: {mediaLoaded ? "✅" : "❌"}</div>
          <div>Playing: {isPlaying ? "✅" : "❌"}</div>
          <div>ASCII Length: {asciiArt.length}</div>
          <div>Mounted: {mountedRef.current ? "✅" : "❌"}</div>
        </div>
      )} */}
    </div>
  )
} 