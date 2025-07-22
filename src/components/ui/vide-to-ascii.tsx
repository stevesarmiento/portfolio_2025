"use client"

import type React from "react"

import { useState, useEffect, useRef, type ChangeEvent } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { GripVertical, Upload, Download, Play, Pause, Film, ImageIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Define a type for colored ASCII characters
type ColoredChar = {
  char: string
  color: string
}

export default function VideoAsciiConverter() {
  // Add this at the beginning of the component, right after the imports
  useEffect(() => {
    // Set document background to black
    if (typeof document !== "undefined") {
      document.documentElement.style.backgroundColor = "black"
      document.body.style.backgroundColor = "black"
    }

    return () => {
      // Clean up when component unmounts
      if (typeof document !== "undefined") {
        document.documentElement.style.backgroundColor = ""
        document.body.style.backgroundColor = ""
      }
    }
  }, [])

  const [resolution, setResolution] = useState(0.11)
  const [inverted, setInverted] = useState(false)
  const [grayscale, setGrayscale] = useState(true)
  const [charSet, setCharSet] = useState("standard")
  const [loading, setLoading] = useState(true)
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const [asciiArt, setAsciiArt] = useState<string>("")
  const [coloredAsciiArt, setColoredAsciiArt] = useState<ColoredChar[][]>([])
  const [leftPanelWidth, setLeftPanelWidth] = useState(25) // percentage
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [sidebarNarrow, setSidebarNarrow] = useState(false)
  const [isVideo, setIsVideo] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [totalFrames, setTotalFrames] = useState(0)
  const [fps, setFps] = useState(24)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_processedFrames, setProcessedFrames] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_videoWidth, setVideoWidth] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_videoHeight, setVideoHeight] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_videoDuration, setVideoDuration] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const outputCanvasRef = useRef<HTMLCanvasElement>(null)
  const asciiVideoRef = useRef<HTMLVideoElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const processedVideoRef = useRef<string | null>(null)

  const charSets = {
    standard: " .:-=+*#%@",
    detailed: " .,:;i1tfLCG08@",
    blocks: " ░▒▓█",
    minimal: " .:█",
  }

  // Set hydration state
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    // Check if we're on the client side
    setIsDesktop(window.innerWidth >= 768)

    // Add resize listener
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 768
      setIsDesktop(newIsDesktop)

      // Reset panel width if switching between mobile and desktop
      if (newIsDesktop !== isDesktop) {
        setLeftPanelWidth(25) // Reset to default when switching layouts
      }
    }

    window.addEventListener("resize", handleResize)

    // Load default image
    loadDefaultImage()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isDesktop, isHydrated])

  // Check if sidebar is narrow
  useEffect(() => {
    if (!isHydrated || !isDesktop) return

    // Check if sidebar is narrow (less than 200px)
    const checkSidebarWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const sidebarWidth = (leftPanelWidth / 100) * containerWidth
        setSidebarNarrow(sidebarWidth < 350)
      }
    }

    checkSidebarWidth()

    // Add resize listener to check sidebar width
    window.addEventListener("resize", checkSidebarWidth)

    return () => {
      window.removeEventListener("resize", checkSidebarWidth)
    }
  }, [leftPanelWidth, isHydrated, isDesktop])

  useEffect(() => {
    if (mediaLoaded && (imageRef.current || (videoRef.current && !isPlaying))) {
      convertToAscii()
    }
  }, [resolution, inverted, grayscale, charSet, mediaLoaded, currentFrame])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

        // Limit the minimum width of each panel to 20%
        if (newLeftWidth >= 20 && newLeftWidth <= 80) {
          setLeftPanelWidth(newLeftWidth)
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  // Video playback and frame extraction
  useEffect(() => {
    if (!isVideo || !videoRef.current || !mediaLoaded) return

    const video = videoRef.current

    const handleTimeUpdate = () => {
      if (video.currentTime >= video.duration) {
        setIsPlaying(false)
        video.currentTime = 0
      }

      // Update current frame based on time
      const frameNumber = Math.floor(video.currentTime * fps)
      setCurrentFrame(frameNumber)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)

    // Animation loop for playing
    const animateVideo = () => {
      if (isPlaying && video) {
        convertToAscii()
        animationFrameRef.current = requestAnimationFrame(animateVideo)
      }
    }

    if (isPlaying) {
      video.play()
      animateVideo()
    } else {
      video.pause()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, isVideo, mediaLoaded, fps])

  const startDragging = () => {
    setIsDragging(true)
  }

  const loadDefaultImage = () => {
    setLoading(true)
    setError(null)
    setMediaLoaded(false)
    setIsVideo(false)

    // For the Pexels video URL, use the fetch approach
    const pexelsUrl = "https://videos.pexels.com/video-files/3125427/3125427-sd_640_360_25fps.mp4"
    fetchAndLoadVideo(pexelsUrl)

    // We're not loading an image anymore, so we'll return early
    return

    // The following code is kept for reference but won't execute
    // Create a new image element
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      if (img.width === 0 || img.height === 0) {
        setError("Invalid image dimensions")
        setLoading(false)
        return
      }

      imageRef.current = img
      videoRef.current = null
      setMediaLoaded(true)
      setLoading(false)
    }

    img.onerror = () => {
      setError("Failed to load image")
      setLoading(false)
    }

    // Set the source after setting up event handlers
    img.src = "https://v0.dev/placeholder.svg"
  }

  const loadImage = (src: string) => {
    setLoading(true)
    setError(null)
    setMediaLoaded(false)
    setIsVideo(false)
    setProcessedFrames([])
    setVideoUrl(null)

    // Create a new image element
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      if (img.width === 0 || img.height === 0) {
        setError("Invalid image dimensions")
        setLoading(false)
        return
      }

      imageRef.current = img
      videoRef.current = null
      setMediaLoaded(true)
      setLoading(false)
    }

    img.onerror = () => {
      setError("Failed to load image")
      setLoading(false)
    }

    // Set the source after setting up event handlers
    img.src = src
  }

  const loadVideo = (src: string) => {
    setLoading(true)
    setError(null)
    setMediaLoaded(false)
    setIsVideo(true)
    setIsPlaying(false)
    setCurrentFrame(0)
    setProcessedFrames([])
    setVideoUrl(null)

    // Create a new video element
    const video = document.createElement("video")
    video.crossOrigin = "anonymous"

    // Add more detailed event handlers for debugging
    video.onloadedmetadata = () => {
      console.log("Video metadata loaded:", video.videoWidth, video.videoHeight, video.duration)
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setError("Invalid video dimensions")
        setLoading(false)
        return
      }

      setVideoWidth(video.videoWidth)
      setVideoHeight(video.videoHeight)
      setVideoDuration(video.duration)
      setTotalFrames(Math.floor(video.duration * fps))

      videoRef.current = video
      imageRef.current = null
      setMediaLoaded(true)
      setLoading(false)
    }

    video.onerror = (e) => {
      console.error("Video loading error:", e)
      setError(`Failed to load video: ${video.error?.message || "CORS or network error"}`)
      setLoading(false)
    }

    // Add a timeout to detect if the video is taking too long to load
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError("Video loading timed out. This might be due to CORS restrictions.")
        setLoading(false)
      }
    }, 10000)

    // Set the source after setting up event handlers
    try {
      video.src = src
      video.load()

      // Try to play a tiny bit to force loading (some browsers need this)
      video.currentTime = 0.1
    } catch (err) {
      console.error("Error setting video source:", err)
      setError(`Error setting video source: ${err instanceof Error ? err.message : "Unknown error"}`)
      setLoading(false)
      clearTimeout(timeoutId)
    }

    return () => clearTimeout(timeoutId)
  }

  const fetchAndLoadVideo = async (url: string) => {
    setLoading(true)
    setError(null)

    try {
      // Inform the user we're fetching the video
      setError("Fetching video... This may take a moment.")

      // Fetch the video file
      const response = await fetch(url, {
        mode: "cors",
        headers: {
          Origin: window.location.origin,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`)
      }

      // Convert to blob
      const blob = await response.blob()

      // Create a local blob URL
      const blobUrl = URL.createObjectURL(blob)

      // Load the video from the blob URL
      loadVideo(blobUrl)
    } catch (err) {
      console.error("Error fetching video:", err)
      setError(
        `Error fetching video: ${err instanceof Error ? err.message : "Unknown error"}. Try uploading the file directly instead.`,
      )
      setLoading(false)
    }
  }

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          loadImage(e.target.result as string)
        }
      }
      reader.onerror = () => {
        setError("Failed to read file")
      }
      reader.readAsDataURL(file)
    } else if (file.type.startsWith("video/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          loadVideo(e.target.result as string)
        }
      }
      reader.onerror = () => {
        setError("Failed to read file")
      }
      reader.readAsDataURL(file)
    } else {
      setError("Please upload an image or video file")
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFile(true)
  }

  const handleDragLeave = () => {
    setIsDraggingFile(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFile(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  // Helper function to adjust color brightness
  const adjustColorBrightness = (r: number, g: number, b: number, factor: number): string => {
    // Ensure the colors are visible against black background
    const minBrightness = 40 // Minimum brightness to ensure visibility
    r = Math.max(Math.min(Math.round(r * factor), 255), minBrightness)
    g = Math.max(Math.min(Math.round(g * factor), 255), minBrightness)
    b = Math.max(Math.min(Math.round(b * factor), 255), minBrightness)
    return `rgb(${r}, ${g}, ${b})`
  }

  // Add this function after the adjustColorBrightness function
  const renderToCanvas = () => {
    if (!outputCanvasRef.current || !asciiArt || coloredAsciiArt.length === 0) return

    const canvas = outputCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set font properties to match the DOM rendering
    const fontSize = 8 // Base font size in pixels
    ctx.font = `${fontSize}px monospace`
    ctx.textBaseline = "top"

    // Calculate dimensions
    const lineHeight = fontSize
    const charWidth = fontSize * 0.6 // Approximate width of monospace character

    // Resize canvas to fit the ASCII art
    if (grayscale) {
      const lines = asciiArt.split("\n")
      const maxLineLength = Math.max(...lines.map((line) => line.length))
      canvas.width = maxLineLength * charWidth
      canvas.height = lines.length * lineHeight
    } else {
      canvas.width = coloredAsciiArt[0].length * charWidth
      canvas.height = coloredAsciiArt.length * lineHeight
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

  // Add this effect to trigger canvas rendering when ASCII art changes
  useEffect(() => {
    if (mediaLoaded && !loading && !error) {
      renderToCanvas()
    }
  }, [asciiArt, coloredAsciiArt, grayscale, loading, error, mediaLoaded])

  const convertToAscii = () => {
    try {
      if (!canvasRef.current || (!imageRef.current && !videoRef.current)) {
        throw new Error("Canvas or media not available")
      }

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        throw new Error("Could not get canvas context")
      }

      let width, height, mediaElement

      if (isVideo && videoRef.current) {
        mediaElement = videoRef.current
        width = Math.floor(mediaElement.videoWidth * resolution)
        height = Math.floor(mediaElement.videoHeight * resolution)
        canvas.width = mediaElement.videoWidth
        canvas.height = mediaElement.videoHeight
      } else if (imageRef.current) {
        mediaElement = imageRef.current
        width = Math.floor(mediaElement.width * resolution)
        height = Math.floor(mediaElement.height * resolution)
        canvas.width = mediaElement.width
        canvas.height = mediaElement.height
      } else {
        throw new Error("No media element available")
      }

      // Validate dimensions
      if (
        (isVideo && (mediaElement as HTMLVideoElement).videoWidth === 0) ||
        (!isVideo && (mediaElement as HTMLImageElement).width === 0)
      ) {
        throw new Error("Invalid media dimensions")
      }

      // Clear the canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw media to canvas
      ctx.drawImage(mediaElement, 0, 0, canvas.width, canvas.height)

      // Get image data
      let imageData
      try {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              } catch {
        throw new Error("Failed to get image data. This might be a CORS issue.")
      }

      const data = imageData.data

      // Choose character set
      const chars = charSets[charSet as keyof typeof charSets]

      // Calculate aspect ratio correction for monospace font
      const fontAspect = 0.5 // Width/height ratio of monospace font characters
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
            // Standard grayscale calculation
            brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255
          } else {
            // Color-aware brightness (perceived luminance)
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
            // Adjust color brightness based on the character density
            // Characters with more "ink" (later in the charset) should be brighter
            const brightnessFactor = (charIndex / (chars.length - 1)) * 1.5 + 0.5
            const color = adjustColorBrightness(r, g, b, brightnessFactor)
            coloredRow.push({ char, color })
          } else {
            // For grayscale mode, we still need to populate the array
            coloredRow.push({ char, color: "white" })
          }
        }

        result += "\n"
        coloredResult.push(coloredRow)
      }

      setAsciiArt(result)
      setColoredAsciiArt(coloredResult)
      setError(null)
    } catch (err) {
      console.error("Error converting to ASCII:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      setAsciiArt("")
      setColoredAsciiArt([])
    }
  }

  const processVideo = async () => {
    if (!isVideo || !videoRef.current || !mediaLoaded) {
      setError("No video to process")
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessedFrames([])

    try {
      const video = videoRef.current
      const totalFramesToProcess = Math.min(totalFrames, 300) // Limit to 300 frames for performance
      const frameInterval = video.duration / totalFramesToProcess

      const processedFramesList: string[] = []

      // Process each frame
      for (let i = 0; i < totalFramesToProcess; i++) {
        // Set video to specific time
        video.currentTime = i * frameInterval

        // Wait for the video to seek to the specified time
        await new Promise<void>((resolve) => {
          const seeked = () => {
            video.removeEventListener("seeked", seeked)
            resolve()
          }
          video.addEventListener("seeked", seeked)
        })

        // Convert current frame to ASCII
        convertToAscii()

        // Render to canvas and get frame as data URL
        const canvas = renderToCanvas()
        if (canvas) {
          const frameDataUrl = canvas.toDataURL("image/jpeg", 0.7)
          processedFramesList.push(frameDataUrl)
        }

        // Update progress
        setProcessingProgress(((i + 1) / totalFramesToProcess) * 100)
      }

      setProcessedFrames(processedFramesList)

      // Create video from frames
      await createVideoFromFrames(processedFramesList)

      setIsProcessing(false)
    } catch (error) {
      console.error("Error processing video:", error)
      setError("Failed to process video: " + (error instanceof Error ? error.message : "Unknown error"))
      setIsProcessing(false)
    }
  }

  const createVideoFromFrames = async (frames: string[]) => {
    if (!frames.length) return

    try {
      // Create a canvas for the output video
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Could not get canvas context")

      // Get dimensions from the first frame
      const firstFrameImg = new Image()
      firstFrameImg.src = frames[0]
      await new Promise((resolve) => {
        firstFrameImg.onload = resolve
      })

      canvas.width = firstFrameImg.width
      canvas.height = firstFrameImg.height

      // Create MediaRecorder
      const stream = canvas.captureStream(fps)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 5000000,
      })

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        setVideoUrl(url)
        processedVideoRef.current = url
      }

      // Start recording
      mediaRecorder.start()

      // Draw each frame to the canvas
      for (let i = 0; i < frames.length; i++) {
        const img = new Image()
        img.src = frames[i]
        await new Promise((resolve) => {
          img.onload = resolve
        })

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Add a small delay between frames
        await new Promise((resolve) => setTimeout(resolve, 1000 / fps))
      }

      // Stop recording after all frames are processed
      mediaRecorder.stop()
    } catch (error) {
      console.error("Error creating video:", error)
      setError("Failed to create video: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const downloadAsciiArt = () => {
    if (!asciiArt) {
      setError("No ASCII art to download")
      return
    }

    const element = document.createElement("a")
    const file = new Blob([asciiArt], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "ascii-art.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadAsciiVideo = () => {
    if (!videoUrl) {
      setError("No processed video to download")
      return
    }

    const element = document.createElement("a")
    element.href = videoUrl
    element.download = "ascii-video.webm"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div
        ref={containerRef}
        className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden select-none"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* ASCII Art Preview - Top on mobile, Right on desktop */}
        <div
          ref={previewRef}
          className={`order-1 md:order-2 flex-1 bg-black overflow-auto flex items-center justify-center ${
            isDraggingFile ? "bg-opacity-50" : ""
          } relative`}
          style={{
            ...(isHydrated && isDesktop
              ? {
                  width: `${100 - leftPanelWidth}%`,
                  marginLeft: `${leftPanelWidth}%`,
                }
              : {}),
          }}
        >
          {isDraggingFile && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10 select-none">
              <div className="text-white text-xl font-mono">Drop image or video here</div>
            </div>
          )}

          {loading ? (
            <div className="text-white font-mono select-none">Loading media...</div>
          ) : error ? (
            <div className="text-red-400 font-mono p-4 text-center select-none">
              {error}
              <div className="mt-2 text-white text-sm">Try uploading a different file or refreshing the page.</div>
            </div>
          ) : isProcessing ? (
            <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md p-4">
              <div className="text-white font-mono">Processing video: {Math.round(processingProgress)}%</div>
              <Progress value={processingProgress} className="w-full h-2" />
            </div>
          ) : videoUrl ? (
            <div className="flex flex-col items-center gap-4">
              <video ref={asciiVideoRef} src={videoUrl} controls className="max-w-full max-h-[80vh]" />
              <Button
                onClick={downloadAsciiVideo}
                className="bg-stone-700 hover:bg-stone-600 text-stone-200 border-stone-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Download ASCII Video
              </Button>
            </div>
          ) : (
            <div className="relative">
              <canvas
                ref={outputCanvasRef}
                className="max-w-full select-text"
                style={{
                  fontSize: "0.4rem",
                  lineHeight: "0.4rem",
                  fontFamily: "monospace",
                }}
              />

              {isVideo && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 p-2 rounded-full">
                  <Button
                    onClick={togglePlayPause}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div className="text-xs font-mono">
                    Frame: {currentFrame}/{totalFrames}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resizable divider - Only visible on desktop after hydration */}
        {isHydrated && isDesktop && (
          <div
            className="order-3 w-2 bg-stone-800 hover:bg-stone-700 cursor-col-resize items-center justify-center z-10 transition-opacity duration-300"
            onMouseDown={startDragging}
            style={{
              position: "absolute",
              left: `${leftPanelWidth}%`,
              top: 0,
              bottom: 0,
              display: "flex",
            }}
          >
            <GripVertical className="h-6 w-6 text-stone-500" />
          </div>
        )}

        {/* Control Panel - Bottom on mobile, Left on desktop */}
        <div
          className={`order-2 md:order-1 w-full md:h-auto p-2 md:p-4 bg-stone-900 font-mono text-stone-300 transition-opacity duration-300 ${
            !isHydrated ? "opacity-0" : "opacity-100"
          }`}
          style={{
            width: "100%",
            height: "auto",
            flex: "0 0 auto",
            ...(isHydrated && isDesktop
              ? {
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${leftPanelWidth}%`,
                  overflowY: "auto",
                }
              : {}),
          }}
        >
          <div className="space-y-4 p-2 md:p-4 border border-stone-700 rounded-md">
            <div className="space-y-1">
              <h1 className="text-lg text-stone-100 font-bold">ASCII Video Converter</h1>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2 border-t border-stone-700 pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="resolution" className="text-stone-300">
                    Resolution: {resolution.toFixed(2)}
                  </Label>
                </div>
                <Slider
                  id="resolution"
                  min={0.05}
                  max={0.3}
                  step={0.01}
                  value={[resolution]}
                  onValueChange={(value: number[]) => setResolution(value[0])}
                  className="[&>span]:border-none [&_.bg-primary]:bg-stone-800 [&>.bg-background]:bg-stone-500/30"
                />
              </div>

              {isVideo && (
                <div className="space-y-2 border-t border-stone-700 pt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fps" className="text-stone-300">
                      FPS: {fps}
                    </Label>
                  </div>
                  <Slider
                    id="fps"
                    min={1}
                    max={30}
                    step={1}
                    value={[fps]}
                    onValueChange={(value: number[]) => setFps(value[0])}
                    className="[&>span]:border-none [&_.bg-primary]:bg-stone-800 [&>.bg-background]:bg-stone-500/30"
                  />
                </div>
              )}

              <div className="space-y-2 border-t border-stone-700 pt-4">
                <Label htmlFor="charset" className="text-stone-300">
                  Character Set
                </Label>
                <Select value={charSet} onValueChange={setCharSet}>
                  <SelectTrigger id="charset" className="bg-stone-800 border-stone-700 text-stone-300">
                    <SelectValue placeholder="Select character set" />
                  </SelectTrigger>
                  <SelectContent className="bg-stone-800 border-stone-700 text-stone-300">
                    <SelectItem value="standard" className="focus:bg-stone-700 focus:text-stone-100">
                      Standard
                    </SelectItem>
                    <SelectItem value="detailed" className="focus:bg-stone-700 focus:text-stone-100">
                      Detailed
                    </SelectItem>
                    <SelectItem value="blocks" className="focus:bg-stone-700 focus:text-stone-100">
                      Block Characters
                    </SelectItem>
                    <SelectItem value="minimal" className="focus:bg-stone-700 focus:text-stone-100">
                      Minimal
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 border-t border-stone-700 pt-4">
                <Switch
                  id="invert"
                  checked={inverted}
                  onCheckedChange={setInverted}
                  className="data-[state=checked]:bg-stone-600"
                />
                <Label htmlFor="invert" className="text-stone-300">
                  Invert Colors
                </Label>
              </div>

              <div className="flex items-center space-x-2 border-t border-stone-700 pt-4">
                <Switch
                  id="grayscale"
                  checked={grayscale}
                  onCheckedChange={setGrayscale}
                  className="data-[state=checked]:bg-stone-600"
                />
                <Label htmlFor="grayscale" className="text-stone-300">
                  Grayscale Mode
                </Label>
              </div>

              <div className="hidden">
                <canvas ref={canvasRef} width="300" height="300"></canvas>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-700">
                {isVideo ? (
                  <>
                    <Button
                      onClick={processVideo}
                      className="flex-1 bg-stone-700 hover:bg-stone-600 text-stone-200 border-stone-600"
                      disabled={loading || !mediaLoaded || isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Process Video to ASCII"}
                    </Button>

                    <Button
                      onClick={togglePlayPause}
                      className="bg-stone-700 hover:bg-stone-600 text-stone-200 border-stone-600"
                      disabled={loading || !mediaLoaded || isProcessing}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={downloadAsciiArt}
                    className="flex-1 bg-stone-700 hover:bg-stone-600 text-stone-200 border-stone-600"
                    disabled={loading || !mediaLoaded}
                  >
                    {sidebarNarrow ? "Download" : "Download ASCII Art"}
                  </Button>
                )}

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-stone-700 hover:bg-stone-600 text-stone-200 border-stone-600"
                  title="Upload Media"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {sidebarNarrow ? "" : "Upload"}
                </Button>

                <Button
                  onClick={() => {
                    if (isVideo) {
                      loadDefaultImage()
                    } else {
                      setError("Please upload a video file")
                      fileInputRef.current?.click()
                    }
                  }}
                  className="bg-stone-700 hover:bg-stone-600 text-stone-200 border-stone-600"
                  title={isVideo ? "Switch to Image" : "Switch to Video"}
                >
                  {isVideo ? <ImageIcon className="h-4 w-4" /> : <Film className="h-4 w-4" />}
                </Button>

                <Button
                  onClick={() =>
                    fetchAndLoadVideo("https://videos.pexels.com/video-files/20518177/20518177-hd_1080_1922_60fps.mp4")
                  }
                  className="bg-stone-700 hover:bg-stone-600 text-stone-200 border-stone-600"
                  disabled={isProcessing}
                >
                  Load Pexels Video
                </Button>
              </div>

              {videoUrl && (
                <div className="pt-4 border-t border-stone-700">
                  <Button
                    onClick={downloadAsciiVideo}
                    className="w-full bg-stone-700 hover:bg-stone-600 text-stone-200 border-stone-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download ASCII Video
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
