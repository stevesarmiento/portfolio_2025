"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import {
  createBlackHoleRenderer,
  type BlackHoleCameraUniforms,
  type BlackHoleDiskUniforms,
  type BlackHoleObjectsUniforms,
  type BlackHoleSimSettings,
} from "@/lib/webgl/black-hole-renderer";

interface BlackHoleSceneProps {
  className?: string;
  isInteractive?: boolean;
  isAsciiEnabled?: boolean;
}

function normalize3(out: Float32Array, x: number, y: number, z: number) {
  const length = Math.hypot(x, y, z);
  if (!length) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return;
  }

  out[0] = x / length;
  out[1] = y / length;
  out[2] = z / length;
}

function cross3(out: Float32Array, ax: number, ay: number, az: number, bx: number, by: number, bz: number) {
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
}

function set3(out: Float32Array, x: number, y: number, z: number) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
}

export function BlackHoleScene({
  className,
  isInteractive = false,
  isAsciiEnabled = false,
}: BlackHoleSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const asciiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const asciiCanvas = asciiCanvasRef.current;

    if (!canvas) return;

    const sceneCanvas = canvas;
    const gl = sceneCanvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });

    if (!gl) return;

    const renderer = createBlackHoleRenderer(gl);

    const asciiContext = asciiCanvas?.getContext("2d", { alpha: true });
    const sampleCanvas = document.createElement("canvas");
    const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });

    const ascii = {
      isEnabled: isAsciiEnabled,
      targetFps: 30,
      lastUpdateMs: 0,
      resolution: 1,
      inverted: false,
      grayscale: false,
      chars: " .,:;-=+*#%@|/\\0<>",
      minChannel: 60,
      alpha: 0.8,
      fontScale: 0.72,
      fontSize: 16,
      cellWidth: 10,
      cellHeight: 18,
      columns: 0,
      rows: 0,
      viewportWidth: 0,
      viewportHeight: 0,
      devicePixelRatio: 1,
    };

    const sagARs = 1.269e10;
    const disk: BlackHoleDiskUniforms = {
      r1: sagARs * 2.2,
      r2: sagARs * 5.2,
    };
    const objects: BlackHoleObjectsUniforms = {
      count: 2,
      posRadius: new Float32Array(16 * 4),
      color: new Float32Array(16 * 4),
    };

    objects.posRadius.set([4e11, 0, 0, 4e10], 0);
    objects.color.set([1, 1, 0, 1], 0);
    objects.posRadius.set([0, 0, 4e11, 4e10], 4);
    objects.color.set([1, 0, 0, 1], 4);

    const camera: BlackHoleCameraUniforms = {
      position: new Float32Array(3),
      right: new Float32Array(3),
      up: new Float32Array(3),
      forward: new Float32Array(3),
      tanHalfFov: Math.tan((60 * Math.PI) / 180 / 2),
      aspect: 1,
    };

    const settings: BlackHoleSimSettings = {
      rs: sagARs,
      stepSize: 1e7,
      escapeRadius: 1e30,
      maxSteps: 8000,
    };

    // Default placement (from your snapshot):
    // ?r=1.249765e11&az=1.661461&el=1.452789&ar=1&aa=1&ad=1.0
    let cameraRadius = 1.649765e11;
    const minRadius = 1e10;
    const maxRadius = 1e12;

    let cameraAzimuth = 1.661461;
    let cameraElevation = 1.452789;

    const orbitSpeed = 0.01;
    const zoomSpeed = 25e9;

    const rightScratch = new Float32Array(3);
    const upScratch = new Float32Array(3);

    function updateCameraBasis() {
      cameraElevation = Math.min(Math.max(cameraElevation, 0.01), Math.PI - 0.01);

      const sinElevation = Math.sin(cameraElevation);
      const cosElevation = Math.cos(cameraElevation);
      const sinAzimuth = Math.sin(cameraAzimuth);
      const cosAzimuth = Math.cos(cameraAzimuth);

      const px = cameraRadius * sinElevation * cosAzimuth;
      const py = cameraRadius * cosElevation;
      const pz = cameraRadius * sinElevation * sinAzimuth;

      set3(camera.position, px, py, pz);

      normalize3(camera.forward, -px, -py, -pz);

      cross3(
        rightScratch,
        camera.forward[0],
        camera.forward[1],
        camera.forward[2],
        0,
        1,
        0,
      );
      normalize3(camera.right, rightScratch[0], rightScratch[1], rightScratch[2]);

      cross3(
        upScratch,
        camera.right[0],
        camera.right[1],
        camera.right[2],
        camera.forward[0],
        camera.forward[1],
        camera.forward[2],
      );
      normalize3(camera.up, upScratch[0], upScratch[1], upScratch[2]);
    }

    updateCameraBasis();

    let frameId = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let qualityScale = 1;
    let lastFrameTimestamp = 0;
    let autoOrbitAccumulatorSeconds = 0;

    let isAutoOrbitEnabled = true;
    const autoOrbitSpeed = 0.325; // rad/s
    const autoOrbitUpdateHz = 15; // sim updates per second while auto-orbiting

    function parseNumberParam(value: string | null): number | null {
      if (!value) return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }

    function formatRadius(value: number): string {
      return value.toExponential(6).replace("e+", "e");
    }

    function formatAngle(value: number): string {
      return value.toFixed(6);
    }

    function showToast(message: string) {
      const toast = document.createElement("div");
      toast.textContent = message;
      toast.style.position = "fixed";
      toast.style.left = "12px";
      toast.style.bottom = "12px";
      toast.style.zIndex = "50";
      toast.style.padding = "6px 10px";
      toast.style.fontFamily =
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
      toast.style.fontSize = "12px";
      toast.style.background = "rgba(0, 0, 0, 0.72)";
      toast.style.color = "rgba(255, 255, 255, 0.9)";
      toast.style.border = "1px solid rgba(255, 255, 255, 0.12)";
      toast.style.borderRadius = "10px";
      toast.style.pointerEvents = "none";
      toast.style.backdropFilter = "blur(6px)";

      document.body.appendChild(toast);
      window.setTimeout(() => toast.remove(), 1200);
    }

    function applyPlacementFromUrl() {
      const params = new URLSearchParams(window.location.search);

      const radiusParam = parseNumberParam(params.get("r"));
      const azimuthParam = parseNumberParam(params.get("az"));
      const elevationParam = parseNumberParam(params.get("el"));
      const autoRotateParam = params.get("ar");
      const asciiEnabledParam = params.get("aa");
      const asciiResolutionParam = parseNumberParam(params.get("ad"));

      if (radiusParam !== null) cameraRadius = Math.min(Math.max(radiusParam, minRadius), maxRadius);
      if (azimuthParam !== null) cameraAzimuth = azimuthParam;
      if (elevationParam !== null) cameraElevation = elevationParam;
      if (autoRotateParam === "0" || autoRotateParam === "1") isAutoOrbitEnabled = autoRotateParam === "1";
      if (asciiEnabledParam === "0" || asciiEnabledParam === "1") ascii.isEnabled = asciiEnabledParam === "1";
      if (asciiResolutionParam !== null)
        ascii.resolution = Math.min(1, Math.max(0.2, Math.round(asciiResolutionParam * 10) / 10));
    }

    function updateUrlPlacement() {
      const params = new URLSearchParams(window.location.search);
      params.set("r", formatRadius(cameraRadius));
      params.set("az", formatAngle(cameraAzimuth));
      params.set("el", formatAngle(cameraElevation));
      params.set("ar", isAutoOrbitEnabled ? "1" : "0");
      params.set("aa", ascii.isEnabled ? "1" : "0");
      params.set("ad", ascii.resolution.toFixed(1));

      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState(null, "", newUrl);
    }

    function buildPlacementSnippet(): string {
      const radius = formatRadius(cameraRadius);
      const azimuth = formatAngle(cameraAzimuth);
      const elevation = formatAngle(cameraElevation);
      const autoRotate = isAutoOrbitEnabled ? "true" : "false";
      const asciiEnabled = ascii.isEnabled ? "true" : "false";
      const asciiDensity = ascii.resolution.toFixed(1);

      return `const defaultPlacement = {\n` +
        `  cameraRadius: ${radius},\n` +
        `  cameraAzimuth: ${azimuth},\n` +
        `  cameraElevation: ${elevation},\n` +
        `  autoRotate: ${autoRotate},\n` +
        `  asciiEnabled: ${asciiEnabled},\n` +
        `  asciiDensity: ${asciiDensity},\n` +
        `} as const;\n\n` +
        `?r=${encodeURIComponent(radius)}&az=${encodeURIComponent(azimuth)}&el=${encodeURIComponent(elevation)}&ar=${isAutoOrbitEnabled ? "1" : "0"}&aa=${ascii.isEnabled ? "1" : "0"}&ad=${encodeURIComponent(asciiDensity)}\n`;
    }

    async function copyPlacementToClipboard() {
      const text = buildPlacementSnippet();

      try {
        await navigator.clipboard.writeText(text);
        showToast("Copied placement");
        return;
      } catch {
        // fallback below
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
        showToast("Copied placement");
      } finally {
        textarea.remove();
      }
    }

    if (isInteractive) {
      applyPlacementFromUrl();
      updateCameraBasis();
    }

    function resizeAsciiOverlay() {
      if (!asciiCanvas || !asciiContext || !sampleContext) return;

      asciiCanvas.width = Math.max(1, Math.round(ascii.viewportWidth * ascii.devicePixelRatio));
      asciiCanvas.height = Math.max(1, Math.round(ascii.viewportHeight * ascii.devicePixelRatio));
      asciiCanvas.style.width = `${ascii.viewportWidth}px`;
      asciiCanvas.style.height = `${ascii.viewportHeight}px`;

      asciiContext.setTransform(ascii.devicePixelRatio, 0, 0, ascii.devicePixelRatio, 0, 0);
      asciiContext.textBaseline = "top";

      const targetColumns = Math.max(24, Math.round(160 * ascii.resolution));
      const targetRows = Math.max(14, Math.round(90 * ascii.resolution));

      ascii.columns = Math.max(1, Math.min(targetColumns, Math.floor(ascii.viewportWidth / 6)));
      ascii.rows = Math.max(1, Math.min(targetRows, Math.floor(ascii.viewportHeight / 10)));

      ascii.cellWidth = ascii.viewportWidth / ascii.columns;
      ascii.cellHeight = ascii.viewportHeight / ascii.rows;

      const nextFontSize = Math.floor(
        Math.min(ascii.cellHeight / 1.15, ascii.cellWidth / 0.6) * ascii.fontScale,
      );
      ascii.fontSize = Math.max(4, Math.min(28, nextFontSize));

      asciiContext.font = `${ascii.fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;

      sampleCanvas.width = ascii.columns;
      sampleCanvas.height = ascii.rows;
      sampleContext.imageSmoothingEnabled = true;

      asciiContext.clearRect(0, 0, ascii.viewportWidth, ascii.viewportHeight);
    }

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      ascii.viewportWidth = width;
      ascii.viewportHeight = height;
      ascii.devicePixelRatio = devicePixelRatio;

      sceneCanvas.width = Math.max(1, Math.round(width * devicePixelRatio));
      sceneCanvas.height = Math.max(1, Math.round(height * devicePixelRatio));
      sceneCanvas.style.width = `${width}px`;
      sceneCanvas.style.height = `${height}px`;

      camera.aspect = width / Math.max(height, 1);
      renderer.resize({ width, height, devicePixelRatio, qualityScale });
      resizeAsciiOverlay();
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.button !== 0 && event.button !== 1) return;
      isDragging = true;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      sceneCanvas.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isDragging) return;

      const dx = event.clientX - lastPointerX;
      const dy = event.clientY - lastPointerY;

      cameraAzimuth += dx * orbitSpeed;
      cameraElevation -= dy * orbitSpeed;

      lastPointerX = event.clientX;
      lastPointerY = event.clientY;

      updateCameraBasis();
    }

    function handlePointerUp(event: PointerEvent) {
      if (!isDragging) return;
      isDragging = false;
      try {
        sceneCanvas.releasePointerCapture(event.pointerId);
      } catch {
      }

      updateUrlPlacement();
    }

    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      const yoffset = -event.deltaY / 100;
      cameraRadius -= yoffset * zoomSpeed;
      cameraRadius = Math.min(Math.max(cameraRadius, minRadius), maxRadius);
      updateCameraBasis();
      updateUrlPlacement();
    }

    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if (key === "r") {
        isAutoOrbitEnabled = !isAutoOrbitEnabled;
        autoOrbitAccumulatorSeconds = 0;
        updateUrlPlacement();
        return;
      }

      if (key === "a") {
        ascii.isEnabled = !ascii.isEnabled;
        ascii.lastUpdateMs = 0;
        if (asciiContext) asciiContext.clearRect(0, 0, ascii.viewportWidth, ascii.viewportHeight);
        updateUrlPlacement();
        return;
      }

      if (key === "[" || key === "{") {
        ascii.resolution = Math.max(0.2, Math.round((ascii.resolution - 0.1) * 10) / 10);
        ascii.lastUpdateMs = 0;
        resizeAsciiOverlay();
        updateUrlPlacement();
        return;
      }

      if (key === "]" || key === "}") {
        ascii.resolution = Math.min(1, Math.round((ascii.resolution + 0.1) * 10) / 10);
        ascii.lastUpdateMs = 0;
        resizeAsciiOverlay();
        updateUrlPlacement();
        return;
      }

      if (key === "p") {
        void copyPlacementToClipboard();
      }
    }

    const baseLambdaRange = 6e11; // ~ 60000 * 1e7 from geodesic.comp

    function renderFrame(timestamp: number) {
      const deltaSeconds = lastFrameTimestamp ? (timestamp - lastFrameTimestamp) / 1000 : 0;
      lastFrameTimestamp = timestamp;

      const isAutoOrbiting = isAutoOrbitEnabled && !isDragging;
      if (isAutoOrbiting) {
        autoOrbitAccumulatorSeconds += deltaSeconds;
        const updateInterval = 1 / autoOrbitUpdateHz;
        if (autoOrbitAccumulatorSeconds >= updateInterval) {
          cameraAzimuth += autoOrbitAccumulatorSeconds * autoOrbitSpeed;
          autoOrbitAccumulatorSeconds = 0;
          updateCameraBasis();
        }
      } else {
        autoOrbitAccumulatorSeconds = 0;
      }

      const nextMaxSteps = isDragging ? 3000 : isAutoOrbiting ? 2500 : 8000;
      settings.maxSteps = nextMaxSteps;
      settings.stepSize = baseLambdaRange / nextMaxSteps;

      const nextQualityScale = isDragging ? 0.65 : isAutoOrbiting ? 0.65 : 1;
      if (nextQualityScale !== qualityScale) {
        qualityScale = nextQualityScale;
        renderer.resize({
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          qualityScale,
        });
        resizeAsciiOverlay();
      }

      renderer.render({
        camera,
        disk,
        objects,
        settings,
      });

      if (
        ascii.isEnabled &&
        asciiCanvas &&
        asciiContext &&
        sampleContext &&
        timestamp - ascii.lastUpdateMs >= 1000 / ascii.targetFps
      ) {
        ascii.lastUpdateMs = timestamp;

        sampleContext.clearRect(0, 0, ascii.columns, ascii.rows);
        sampleContext.drawImage(sceneCanvas, 0, 0, ascii.columns, ascii.rows);

        const imageData = sampleContext.getImageData(0, 0, ascii.columns, ascii.rows);
        const pixels = imageData.data;

        asciiContext.clearRect(0, 0, ascii.viewportWidth, ascii.viewportHeight);
        asciiContext.fillStyle = "rgba(0, 0, 0, 1)";
        asciiContext.fillRect(0, 0, ascii.viewportWidth, ascii.viewportHeight);

        const chars = ascii.chars;
        const maxIndex = Math.max(chars.length - 1, 1);

        for (let row = 0; row < ascii.rows; row += 1) {
          for (let col = 0; col < ascii.columns; col += 1) {
            const idx = (row * ascii.columns + col) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const a = pixels[idx + 3];

            if (a < 18) continue;

            let brightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            if (ascii.inverted) brightness = 1 - brightness;

            const charIndex = Math.min(maxIndex, Math.floor(brightness * maxIndex));
            const ch = chars[charIndex] ?? " ";
            if (ch === " ") continue;

            if (ascii.grayscale) {
              asciiContext.fillStyle = `rgba(255, 255, 255, ${ascii.alpha})`;
            } else {
              const brightnessFactor = Math.max(0.3, (charIndex / maxIndex) * 1.5 + 0.5);
              const adjustedR = Math.max(Math.min(Math.round(r * brightnessFactor), 255), ascii.minChannel);
              const adjustedG = Math.max(Math.min(Math.round(g * brightnessFactor), 255), ascii.minChannel);
              const adjustedB = Math.max(Math.min(Math.round(b * brightnessFactor), 255), ascii.minChannel);
              asciiContext.fillStyle = `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${ascii.alpha})`;
            }

            asciiContext.fillText(ch, col * ascii.cellWidth, row * ascii.cellHeight);
          }
        }
      }

      frameId = window.requestAnimationFrame(renderFrame);
    }

    resize();
    frameId = window.requestAnimationFrame(renderFrame);

    window.addEventListener("resize", resize);
    if (isInteractive) {
      window.addEventListener("keydown", handleKeyDown);
      sceneCanvas.addEventListener("pointerdown", handlePointerDown);
      sceneCanvas.addEventListener("pointermove", handlePointerMove);
      sceneCanvas.addEventListener("pointerup", handlePointerUp);
      sceneCanvas.addEventListener("pointercancel", handlePointerUp);
      sceneCanvas.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      if (isInteractive) {
        window.removeEventListener("keydown", handleKeyDown);
        sceneCanvas.removeEventListener("pointerdown", handlePointerDown);
        sceneCanvas.removeEventListener("pointermove", handlePointerMove);
        sceneCanvas.removeEventListener("pointerup", handlePointerUp);
        sceneCanvas.removeEventListener("pointercancel", handlePointerUp);
        sceneCanvas.removeEventListener("wheel", handleWheel);
      }
      renderer.destroy();
    };
  }, [isAsciiEnabled, isInteractive]);

  return (
    <div className={cn("absolute inset-0", className)}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn("absolute inset-0 h-full w-full", !isInteractive && "pointer-events-none")}
      />
      {isAsciiEnabled ? (
        <canvas
          ref={asciiCanvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      ) : null}
    </div>
  );
}
