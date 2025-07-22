"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

// Define a type for colored ASCII characters
type ColoredChar = {
  char: string
  color: string
}

export default function AsciiVideoBackground() {
  console.log("🚀 ASCII VIDEO BACKGROUND COMPONENT LOADED - VERSION 2.0 - ", new Date().toISOString())
  
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

  // Fixed parameters - adjust these as needed
  const resolution = 0.21 // Lower for better performance, higher for more detail
  const inverted = false
  const grayscale = true // Set to true for grayscale
  const charSet = "minimal" // "standard", "detailed", "blocks", "minimal"
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fps = 30

  const charSets = {
    standard: " .:-=+*#%@",
    detailed: " .,:;i1tfLCG08@",
    blocks: " ░▒▓█",
    minimal: " .:█",
  }

  useEffect(() => {
    if (!isLoading && !mediaLoaded) {
      loadVideo()
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isLoading, mediaLoaded])

  useEffect(() => {
    console.log("🎬 Media loaded effect triggered - mediaLoaded:", mediaLoaded, "videoRef exists:", !!videoRef.current)
    if (mediaLoaded && videoRef.current) {
      console.log("✅ Starting ASCII conversion and playback...")
      convertToAscii()
      if (!isPlaying) {
        setIsPlaying(true)
      }
    }
  }, [mediaLoaded])

  // Video playback and frame extraction
  useEffect(() => {
    if (!videoRef.current || !mediaLoaded) return

    const video = videoRef.current

    const handleTimeUpdate = () => {
      if (video.currentTime >= video.duration) {
        video.currentTime = 0 // Loop the video
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)

    // Animation loop for playing
    const animateVideo = () => {
      if (isPlaying && video && !video.paused) {
        console.log("Animation frame - video time:", video.currentTime)
        convertToAscii()
        animationFrameRef.current = requestAnimationFrame(animateVideo)
      } else {
        console.log("Animation stopped - isPlaying:", isPlaying, "video exists:", !!video, "not paused:", video ? !video.paused : false)
      }
    }

    if (isPlaying && mediaLoaded) {
      console.log("Starting video playback...")
      video.play().catch((err) => {
        console.error("Error playing video:", err)
      })
      animateVideo()
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, mediaLoaded])

  const loadVideo = async () => {
    if (isLoading) return // Prevent multiple loads
    
    try {
      setIsLoading(true)
      setError(null)
      
      const videoUrl = "https://videos.pexels.com/video-files/3125427/3125427-sd_640_360_25fps.mp4"
      
      // Fetch the video file with cache busting
      const response = await fetch(videoUrl, {
        mode: "cors",
        cache: "no-cache",
        headers: {
          Origin: window.location.origin,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`)
      }

      // Convert to blob
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      // Create a new video element
      const video = document.createElement("video")
      video.crossOrigin = "anonymous"
      video.loop = true
      video.muted = true // Ensure autoplay works
      video.playsInline = true

      video.onloadedmetadata = () => {
        console.log("🎥 NEW VERSION - Video metadata loaded:", video.videoWidth, "x", video.videoHeight, "duration:", video.duration, "timestamp:", Date.now())
        
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          setError("Invalid video dimensions")
          setIsLoading(false)
          return
        }

        videoRef.current = video
        setMediaLoaded(true)
        setIsLoading(false)
      }

      video.onerror = (e) => {
        console.error("Video loading error:", e)
        setError(`Failed to load video: ${video.error?.message || "CORS or network error"}`)
        setIsLoading(false)
      }

      video.src = blobUrl
      video.load()
    } catch (err) {
      console.error("Error fetching video:", err)
      setError(`Error fetching video: ${err instanceof Error ? err.message : "Unknown error"}`)
      setIsLoading(false)
    }
  }

  // Helper function to adjust color brightness
  const adjustColorBrightness = (r: number, g: number, b: number, factor: number): string => {
    const minBrightness = 60 // Higher minimum for better visibility
    r = Math.max(Math.min(Math.round(r * factor), 255), minBrightness)
    g = Math.max(Math.min(Math.round(g * factor), 255), minBrightness)
    b = Math.max(Math.min(Math.round(b * factor), 255), minBrightness)
    return `rgb(${r}, ${g}, ${b})`
  }

  const renderToCanvas = () => {
    if (!outputCanvasRef.current || !asciiArt || coloredAsciiArt.length === 0) {
      console.log("Render skipped - missing canvas/ASCII data")
      return
    }

    console.log("Rendering ASCII to canvas...")
    
    const canvas = outputCanvasRef.current
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) {
      console.log("Failed to get canvas context")
      return
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set font properties - smaller for better performance
    const fontSize = 6
    ctx.font = `${fontSize}px monospace`
    ctx.textBaseline = "top"

    // Calculate dimensions
    const lineHeight = fontSize
    const charWidth = fontSize * 0.6

    // Resize canvas to fit the ASCII art
    if (grayscale) {
      const lines = asciiArt.split("\n")
      const maxLineLength = Math.max(...lines.map((line) => line.length))
      canvas.width = maxLineLength * charWidth
      canvas.height = lines.length * lineHeight
      console.log("Canvas sized for grayscale:", canvas.width, "x", canvas.height, "Lines:", lines.length)
    } else {
      canvas.width = coloredAsciiArt[0]?.length * charWidth || 0
      canvas.height = coloredAsciiArt.length * lineHeight
      console.log("Canvas sized for color:", canvas.width, "x", canvas.height, "Rows:", coloredAsciiArt.length)
    }

    // Re-apply font after canvas resize
    ctx.font = `${fontSize}px monospace`
    ctx.textBaseline = "top"

    // Render the ASCII art
    if (grayscale) {
      ctx.fillStyle = "white"
      asciiArt.split("\n").forEach((line, lineIndex) => {
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

    return canvas
  }

  useEffect(() => {
    if (mediaLoaded && !error) {
      renderToCanvas()
    }
  }, [asciiArt, coloredAsciiArt, grayscale, error, mediaLoaded])

  const convertToAscii = () => {
    try {
      if (!canvasRef.current || !videoRef.current) {
        console.log("Missing canvas or video ref")
        return
      }
      
      console.log("Converting frame to ASCII...")

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) {
        return
      }

      const video = videoRef.current
      const width = Math.floor(video.videoWidth * resolution)
      const height = Math.floor(video.videoHeight * resolution)
      
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
      } catch {
        return // Skip this frame if we can't get image data
      }

      const data = imageData.data

      // Choose character set
      const chars = charSets[charSet as keyof typeof charSets]

      // Calculate aspect ratio correction for monospace font
      const fontAspect = 0.5
      const widthStep = Math.ceil(canvas.width / width)
      const heightStep = Math.ceil(canvas.height / height / fontAspect)

      let result = ""
      const coloredResult: ColoredChar[][] = []

      // Process the image
      for (let y = 0; y < canvas.height; y += heightStep) {
        const coloredRow: ColoredChar[] = []

        for (let x = 0; x < canvas.width; x += widthStep) {
          const pos = (y * canvas.width + x) * 4

          const r = data[pos]
          const g = data[pos + 1]
          const b = data[pos + 2]

          // Calculate brightness based on grayscale setting
          let brightness
          if (grayscale) {
            brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255
          } else {
            brightness = Math.sqrt(
              0.299 * (r / 255) * (r / 255) + 0.587 * (g / 255) * (g / 255) + 0.114 * (b / 255) * (b / 255),
            )
          }

          // Invert if needed
          if (inverted) brightness = 1 - brightness

          // Map brightness to character
          const charIndex = Math.floor(brightness * (chars.length - 1))
          const char = chars[charIndex]

          result += char

          // For colored mode, store the character and its color
          if (!grayscale) {
            const brightnessFactor = (charIndex / (chars.length - 1)) * 1.5 + 0.5
            const color = adjustColorBrightness(r, g, b, brightnessFactor)
            coloredRow.push({ char, color })
          } else {
            coloredRow.push({ char, color: "white" })
          }
        }

        result += "\n"
        coloredResult.push(coloredRow)
      }

      setAsciiArt(result)
      setColoredAsciiArt(coloredResult)
      setError(null)
      
      console.log("ASCII conversion complete. Result length:", result.length, "Colored rows:", coloredResult.length)
    } catch (err) {
      console.error("Error converting to ASCII:", err)
      setError(`ASCII conversion error: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-red-400 font-mono text-center p-4">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-black overflow-hidden relative">
      <canvas ref={canvasRef} className="hidden" />
      
      <canvas
        ref={outputCanvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          fontSize: "0.3rem",
          lineHeight: "0.3rem",
          fontFamily: "monospace",
          imageRendering: "pixelated",
        }}
      />
      
      {!mediaLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white font-mono">Loading video...</div>
        </div>
      )}
    </div>
  )
} 