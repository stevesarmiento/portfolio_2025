export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface CameraState {
  yaw: number;
  pitch: number;
  distance: number;
  focalLength: number;
}

export interface ScreenPoint extends Vector2 {
  depth: number;
}

export interface Star {
  position: Vector3;
  size: number;
  brightness: number;
  hue: number;
  twinkleOffset: number;
}

export interface DiskParticle {
  radius: number;
  angleOffset: number;
  speed: number;
  height: number;
  size: number;
  alpha: number;
  heat: number;
}

const SCHWARZSCHILD_RADIUS = 1;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function createSeededRandom(seed: number): () => number {
  let current = seed >>> 0;

  return function seededRandom(): number {
    current += 0x6d2b79f5;
    let value = current;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function rotateAroundY(point: Vector3, angle: number): Vector3 {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);

  return {
    x: point.x * cosine - point.z * sine,
    y: point.y,
    z: point.x * sine + point.z * cosine,
  };
}

function rotateAroundX(point: Vector3, angle: number): Vector3 {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);

  return {
    x: point.x,
    y: point.y * cosine - point.z * sine,
    z: point.y * sine + point.z * cosine,
  };
}

export function createWarpedGridPoint(x: number, z: number): Vector3 {
  const radius = Math.hypot(x, z);

  if (radius < SCHWARZSCHILD_RADIUS) {
    return {
      x,
      y: -2.6,
      z,
    };
  }

  const depth = 2 * Math.sqrt(SCHWARZSCHILD_RADIUS * (radius - SCHWARZSCHILD_RADIUS)) - 2.7;

  return {
    x,
    y: depth,
    z,
  };
}

export function projectWorldPoint(
  point: Vector3,
  camera: CameraState,
  viewport: Viewport,
): ScreenPoint | null {
  const yawRotatedPoint = rotateAroundY(point, camera.yaw);
  const rotatedPoint = rotateAroundX(yawRotatedPoint, camera.pitch);
  const depth = rotatedPoint.z + camera.distance;

  if (depth <= 0.25) return null;

  const scale = (Math.min(viewport.width, viewport.height) * camera.focalLength) / depth;

  return {
    x: viewport.width * 0.5 + rotatedPoint.x * scale,
    y: viewport.height * 0.5 - rotatedPoint.y * scale,
    depth,
  };
}

export function lensScreenPoint(
  point: Vector2,
  center: Vector2,
  radius: number,
  strength: number,
): Vector2 {
  const deltaX = point.x - center.x;
  const deltaY = point.y - center.y;
  const distance = Math.max(Math.hypot(deltaX, deltaY), 0.001);
  const directionX = deltaX / distance;
  const directionY = deltaY / distance;
  const tangentX = -directionY;
  const tangentY = directionX;
  const radialFalloff = Math.exp(-distance / (radius * 4.8));
  const ringWeight = Math.exp(-((distance - radius * 2.2) ** 2) / (radius * radius * 1.8));
  const radialOffset = strength * radius * radialFalloff;
  const tangentialOffset = strength * radius * 0.6 * ringWeight;

  return {
    x: point.x + directionX * radialOffset + tangentX * tangentialOffset,
    y: point.y + directionY * radialOffset + tangentY * tangentialOffset,
  };
}

export function createStarField(count: number): Star[] {
  const random = createSeededRandom(17);

  return Array.from({ length: count }, () => ({
    position: {
      x: (random() - 0.5) * 30,
      y: (random() - 0.5) * 18,
      z: -8 - random() * 20,
    },
    size: 0.7 + random() * 1.8,
    brightness: 0.35 + random() * 0.65,
    hue: 190 + random() * 70,
    twinkleOffset: random() * Math.PI * 2,
  }));
}

export function createDiskParticles(count: number): DiskParticle[] {
  const random = createSeededRandom(42);

  return Array.from({ length: count }, () => {
    const radius = 1.8 + random() * 3.3;

    return {
      radius,
      angleOffset: random() * Math.PI * 2,
      speed: 0.35 + (1 / radius) * 1.2 + random() * 0.1,
      height: (random() - 0.5) * 0.18,
      size: 1.5 + random() * 3.2,
      alpha: 0.24 + random() * 0.42,
      heat: 28 + random() * 18,
    };
  });
}
