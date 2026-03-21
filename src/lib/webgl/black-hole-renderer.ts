import {
  assertWebGl,
  createFramebufferTarget,
  createProgram,
  deleteFramebufferTarget,
} from "@/lib/webgl/gl-utils";
import {
  blitFragmentShaderSource,
  geodesicFragmentShaderSource,
  fullscreenVertexShaderSource,
  gridFragmentShaderSource,
  gridVertexShaderSource,
} from "@/lib/webgl/shaders";

export interface BlackHoleCameraUniforms {
  position: Float32Array;
  right: Float32Array;
  up: Float32Array;
  forward: Float32Array;
  tanHalfFov: number;
  aspect: number;
}

export interface BlackHoleDiskUniforms {
  r1: number;
  r2: number;
}

export interface BlackHoleObjectsUniforms {
  count: number;
  posRadius: Float32Array;
  color: Float32Array;
}

export interface BlackHoleSimSettings {
  rs: number;
  stepSize: number;
  escapeRadius: number;
  maxSteps: number;
}

export interface BlackHoleRenderer {
  resize: (next: { width: number; height: number; devicePixelRatio: number; qualityScale?: number }) => void;
  render: (params: {
    camera: BlackHoleCameraUniforms;
    disk: BlackHoleDiskUniforms;
    objects: BlackHoleObjectsUniforms;
    settings: BlackHoleSimSettings;
  }) => void;
  destroy: () => void;
}

interface SimUniformLocations {
  resolution: WebGLUniformLocation | null;
  camPos: WebGLUniformLocation | null;
  camRight: WebGLUniformLocation | null;
  camUp: WebGLUniformLocation | null;
  camForward: WebGLUniformLocation | null;
  tanHalfFov: WebGLUniformLocation | null;
  aspect: WebGLUniformLocation | null;
  rs: WebGLUniformLocation | null;
  stepSize: WebGLUniformLocation | null;
  escapeRadius: WebGLUniformLocation | null;
  maxSteps: WebGLUniformLocation | null;
  diskR1: WebGLUniformLocation | null;
  diskR2: WebGLUniformLocation | null;
  numObjects: WebGLUniformLocation | null;
  objPosRadius0: WebGLUniformLocation | null;
  objColor0: WebGLUniformLocation | null;
}

interface RendererState {
  simTarget: ReturnType<typeof createFramebufferTarget> | null;
  simProgram: WebGLProgram;
  blitProgram: WebGLProgram;
  gridProgram: WebGLProgram;
  simUniforms: SimUniformLocations;
  blitUniformTexture: WebGLUniformLocation | null;
  fullscreenVao: WebGLVertexArrayObject;
  gridVao: WebGLVertexArrayObject;
  gridVbo: WebGLBuffer;
  gridEbo: WebGLBuffer;
  gridIndexCount: number;
  gridUniformViewProj: WebGLUniformLocation | null;
  view: Float32Array;
  proj: Float32Array;
  viewProj: Float32Array;
  lastCameraPos: Float32Array;
  lastCameraRight: Float32Array;
  lastCameraUp: Float32Array;
  lastCameraForward: Float32Array;
  lastTanHalfFov: number;
  lastAspect: number;
  lastRs: number;
  lastStepSize: number;
  lastEscapeRadius: number;
  lastMaxSteps: number;
  lastDiskR1: number;
  lastDiskR2: number;
  lastObjectsCount: number;
  hasSimFrame: boolean;
  canvasWidth: number;
  canvasHeight: number;
  devicePixelRatio: number;
  internalWidth: number;
  internalHeight: number;
  qualityScale: number;
}

function createGridMesh(rs: number): { vertices: Float32Array; indices: Uint16Array } {
  const gridSize = 25;
  const spacing = 1e10;
  const half = gridSize / 2;

  const vertexCount = (gridSize + 1) * (gridSize + 1);
  const vertices = new Float32Array(vertexCount * 3);

  let v = 0;
  for (let z = 0; z <= gridSize; z += 1) {
    for (let x = 0; x <= gridSize; x += 1) {
      const worldX = (x - half) * spacing;
      const worldZ = (z - half) * spacing;
      const dist = Math.hypot(worldX, worldZ);

      let y = 0;
      if (dist > rs) {
        const deltaY = 2 * Math.sqrt(rs * (dist - rs));
        y = deltaY - 3e10;
      } else {
        y = 2 * rs - 3e10;
      }

      vertices[v] = worldX;
      vertices[v + 1] = y;
      vertices[v + 2] = worldZ;
      v += 3;
    }
  }

  const indices = new Uint16Array(gridSize * gridSize * 4);
  let i = 0;
  for (let z = 0; z < gridSize; z += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const base = z * (gridSize + 1) + x;
      indices[i] = base;
      indices[i + 1] = base + 1;
      indices[i + 2] = base;
      indices[i + 3] = base + gridSize + 1;
      i += 4;
    }
  }

  return { vertices, indices };
}

function multiplyMat4(out: Float32Array, a: Float32Array, b: Float32Array) {
  for (let c = 0; c < 4; c += 1) {
    const b0 = b[c * 4 + 0];
    const b1 = b[c * 4 + 1];
    const b2 = b[c * 4 + 2];
    const b3 = b[c * 4 + 3];

    out[c * 4 + 0] = a[0] * b0 + a[4] * b1 + a[8] * b2 + a[12] * b3;
    out[c * 4 + 1] = a[1] * b0 + a[5] * b1 + a[9] * b2 + a[13] * b3;
    out[c * 4 + 2] = a[2] * b0 + a[6] * b1 + a[10] * b2 + a[14] * b3;
    out[c * 4 + 3] = a[3] * b0 + a[7] * b1 + a[11] * b2 + a[15] * b3;
  }
}

function makePerspective(out: Float32Array, tanHalfFov: number, aspect: number, near: number, far: number) {
  const f = 1 / tanHalfFov;
  const nf = 1 / (near - far);

  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;

  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;

  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;

  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;
}

function makeView(out: Float32Array, camera: BlackHoleCameraUniforms) {
  const rx = camera.right[0];
  const ry = camera.right[1];
  const rz = camera.right[2];

  const ux = camera.up[0];
  const uy = camera.up[1];
  const uz = camera.up[2];

  const fx = camera.forward[0];
  const fy = camera.forward[1];
  const fz = camera.forward[2];

  const px = camera.position[0];
  const py = camera.position[1];
  const pz = camera.position[2];

  const zx = -fx;
  const zy = -fy;
  const zz = -fz;

  out[0] = rx;
  out[1] = ry;
  out[2] = rz;
  out[3] = 0;

  out[4] = ux;
  out[5] = uy;
  out[6] = uz;
  out[7] = 0;

  out[8] = zx;
  out[9] = zy;
  out[10] = zz;
  out[11] = 0;

  out[12] = -(rx * px + ry * py + rz * pz);
  out[13] = -(ux * px + uy * py + uz * pz);
  out[14] = -(zx * px + zy * py + zz * pz);
  out[15] = 1;
}

function computeInternalResolution(qualityScale: number): {
  internalWidth: number;
  internalHeight: number;
} {
  const scale = Math.min(Math.max(qualityScale, 0.4), 1);
  return {
    internalWidth: Math.max(1, Math.round(200 * scale)),
    internalHeight: Math.max(1, Math.round(150 * scale)),
  };
}

function createOrUpdateSimTarget(
  gl: WebGL2RenderingContext,
  state: RendererState,
  internalWidth: number,
  internalHeight: number,
) {
  if (state.simTarget && state.simTarget.width === internalWidth && state.simTarget.height === internalHeight)
    return;

  if (state.simTarget) deleteFramebufferTarget(gl, state.simTarget);
  state.simTarget = createFramebufferTarget(gl, internalWidth, internalHeight, { filter: gl.LINEAR });
  state.internalWidth = internalWidth;
  state.internalHeight = internalHeight;
}

export function createBlackHoleRenderer(gl: WebGL2RenderingContext): BlackHoleRenderer {
  const fullscreenVao = gl.createVertexArray();
  assertWebGl(fullscreenVao, "Failed to create VAO");
  gl.bindVertexArray(fullscreenVao);

  const simProgram = createProgram(gl, fullscreenVertexShaderSource, geodesicFragmentShaderSource);
  const blitProgram = createProgram(gl, fullscreenVertexShaderSource, blitFragmentShaderSource);
  const gridProgram = createProgram(gl, gridVertexShaderSource, gridFragmentShaderSource);

  const simUniforms: SimUniformLocations = {
    resolution: gl.getUniformLocation(simProgram, "uResolution"),
    camPos: gl.getUniformLocation(simProgram, "uCamPos"),
    camRight: gl.getUniformLocation(simProgram, "uCamRight"),
    camUp: gl.getUniformLocation(simProgram, "uCamUp"),
    camForward: gl.getUniformLocation(simProgram, "uCamForward"),
    tanHalfFov: gl.getUniformLocation(simProgram, "uTanHalfFov"),
    aspect: gl.getUniformLocation(simProgram, "uAspect"),
    rs: gl.getUniformLocation(simProgram, "uRs"),
    stepSize: gl.getUniformLocation(simProgram, "uStepSize"),
    escapeRadius: gl.getUniformLocation(simProgram, "uEscapeRadius"),
    maxSteps: gl.getUniformLocation(simProgram, "uMaxSteps"),
    diskR1: gl.getUniformLocation(simProgram, "uDiskR1"),
    diskR2: gl.getUniformLocation(simProgram, "uDiskR2"),
    numObjects: gl.getUniformLocation(simProgram, "uNumObjects"),
    objPosRadius0: gl.getUniformLocation(simProgram, "uObjPosRadius[0]"),
    objColor0: gl.getUniformLocation(simProgram, "uObjColor[0]"),
  };
  const blitUniformTexture = gl.getUniformLocation(blitProgram, "uTexture");

  const gridUniformViewProj = gl.getUniformLocation(gridProgram, "uViewProj");

  const defaultRs = 1.269e10;
  const gridMesh = createGridMesh(defaultRs);
  const gridVao = gl.createVertexArray();
  assertWebGl(gridVao, "Failed to create grid VAO");
  const gridVbo = gl.createBuffer();
  assertWebGl(gridVbo, "Failed to create grid VBO");
  const gridEbo = gl.createBuffer();
  assertWebGl(gridEbo, "Failed to create grid EBO");

  gl.bindVertexArray(gridVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gridVbo);
  gl.bufferData(gl.ARRAY_BUFFER, gridMesh.vertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gridEbo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, gridMesh.indices, gl.STATIC_DRAW);

  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);

  const state: RendererState = {
    simTarget: null,
    simProgram,
    blitProgram,
    gridProgram,
    simUniforms,
    blitUniformTexture,
    fullscreenVao,
    gridVao,
    gridVbo,
    gridEbo,
    gridIndexCount: gridMesh.indices.length,
    gridUniformViewProj,
    view: new Float32Array(16),
    proj: new Float32Array(16),
    viewProj: new Float32Array(16),
    lastCameraPos: new Float32Array(3),
    lastCameraRight: new Float32Array(3),
    lastCameraUp: new Float32Array(3),
    lastCameraForward: new Float32Array(3),
    lastTanHalfFov: 0,
    lastAspect: 0,
    lastRs: 0,
    lastStepSize: 0,
    lastEscapeRadius: 0,
    lastMaxSteps: 0,
    lastDiskR1: 0,
    lastDiskR2: 0,
    lastObjectsCount: 0,
    hasSimFrame: false,
    canvasWidth: 0,
    canvasHeight: 0,
    devicePixelRatio: 1,
    internalWidth: 200,
    internalHeight: 150,
    qualityScale: 1,
  };

  function resize(next: { width: number; height: number; devicePixelRatio: number; qualityScale?: number }) {
    state.canvasWidth = next.width;
    state.canvasHeight = next.height;
    state.devicePixelRatio = next.devicePixelRatio;
    if (typeof next.qualityScale === "number") state.qualityScale = next.qualityScale;

    const { internalWidth, internalHeight } = computeInternalResolution(state.qualityScale);
    createOrUpdateSimTarget(gl, state, internalWidth, internalHeight);
    state.hasSimFrame = false;
  }

  function render(params: {
    camera: BlackHoleCameraUniforms;
    disk: BlackHoleDiskUniforms;
    objects: BlackHoleObjectsUniforms;
    settings: BlackHoleSimSettings;
  }) {
    if (!state.simTarget) return;

    gl.bindVertexArray(state.fullscreenVao);

    const shouldUpdateSim =
      !state.hasSimFrame ||
      params.camera.position[0] !== state.lastCameraPos[0] ||
      params.camera.position[1] !== state.lastCameraPos[1] ||
      params.camera.position[2] !== state.lastCameraPos[2] ||
      params.camera.right[0] !== state.lastCameraRight[0] ||
      params.camera.right[1] !== state.lastCameraRight[1] ||
      params.camera.right[2] !== state.lastCameraRight[2] ||
      params.camera.up[0] !== state.lastCameraUp[0] ||
      params.camera.up[1] !== state.lastCameraUp[1] ||
      params.camera.up[2] !== state.lastCameraUp[2] ||
      params.camera.forward[0] !== state.lastCameraForward[0] ||
      params.camera.forward[1] !== state.lastCameraForward[1] ||
      params.camera.forward[2] !== state.lastCameraForward[2] ||
      params.camera.tanHalfFov !== state.lastTanHalfFov ||
      params.camera.aspect !== state.lastAspect ||
      params.settings.rs !== state.lastRs ||
      params.settings.stepSize !== state.lastStepSize ||
      params.settings.escapeRadius !== state.lastEscapeRadius ||
      params.settings.maxSteps !== state.lastMaxSteps ||
      params.disk.r1 !== state.lastDiskR1 ||
      params.disk.r2 !== state.lastDiskR2 ||
      params.objects.count !== state.lastObjectsCount;

    if (shouldUpdateSim) {
      // Pass 1: low-resolution simulation texture (only when camera/settings change).
      gl.bindFramebuffer(gl.FRAMEBUFFER, state.simTarget.framebuffer);
      gl.viewport(0, 0, state.simTarget.width, state.simTarget.height);
      gl.useProgram(state.simProgram);

      gl.uniform2f(state.simUniforms.resolution, state.simTarget.width, state.simTarget.height);
      gl.uniform3fv(state.simUniforms.camPos, params.camera.position);
      gl.uniform3fv(state.simUniforms.camRight, params.camera.right);
      gl.uniform3fv(state.simUniforms.camUp, params.camera.up);
      gl.uniform3fv(state.simUniforms.camForward, params.camera.forward);
      gl.uniform1f(state.simUniforms.tanHalfFov, params.camera.tanHalfFov);
      gl.uniform1f(state.simUniforms.aspect, params.camera.aspect);

      gl.uniform1f(state.simUniforms.rs, params.settings.rs);
      gl.uniform1f(state.simUniforms.stepSize, params.settings.stepSize);
      gl.uniform1f(state.simUniforms.escapeRadius, params.settings.escapeRadius);
      gl.uniform1i(state.simUniforms.maxSteps, params.settings.maxSteps);

      gl.uniform1f(state.simUniforms.diskR1, params.disk.r1);
      gl.uniform1f(state.simUniforms.diskR2, params.disk.r2);

      gl.uniform1i(state.simUniforms.numObjects, params.objects.count);
      if (params.objects.count > 0) {
        gl.uniform4fv(state.simUniforms.objPosRadius0, params.objects.posRadius);
        gl.uniform4fv(state.simUniforms.objColor0, params.objects.color);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      state.lastCameraPos.set(params.camera.position);
      state.lastCameraRight.set(params.camera.right);
      state.lastCameraUp.set(params.camera.up);
      state.lastCameraForward.set(params.camera.forward);
      state.lastTanHalfFov = params.camera.tanHalfFov;
      state.lastAspect = params.camera.aspect;
      state.lastRs = params.settings.rs;
      state.lastStepSize = params.settings.stepSize;
      state.lastEscapeRadius = params.settings.escapeRadius;
      state.lastMaxSteps = params.settings.maxSteps;
      state.lastDiskR1 = params.disk.r1;
      state.lastDiskR2 = params.disk.r2;
      state.lastObjectsCount = params.objects.count;
      state.hasSimFrame = true;
    }

    // Pass 2: upscale to screen.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, Math.round(state.canvasWidth * state.devicePixelRatio), Math.round(state.canvasHeight * state.devicePixelRatio));
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    makeView(state.view, params.camera);
    makePerspective(state.proj, params.camera.tanHalfFov, params.camera.aspect, 1e9, 1e14);
    multiplyMat4(state.viewProj, state.proj, state.view);

    gl.useProgram(state.gridProgram);
    gl.uniformMatrix4fv(state.gridUniformViewProj, false, state.viewProj);
    gl.bindVertexArray(state.gridVao);
    gl.drawElements(gl.LINES, state.gridIndexCount, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(state.fullscreenVao);
    gl.useProgram(state.blitProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, state.simTarget.texture);
    gl.uniform1i(state.blitUniformTexture, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.disable(gl.BLEND);
  }

  function destroy() {
    if (state.simTarget) deleteFramebufferTarget(gl, state.simTarget);
    gl.deleteProgram(state.simProgram);
    gl.deleteProgram(state.blitProgram);
    gl.deleteProgram(state.gridProgram);
    gl.deleteBuffer(state.gridVbo);
    gl.deleteBuffer(state.gridEbo);
    gl.deleteVertexArray(state.gridVao);
    gl.deleteVertexArray(state.fullscreenVao);
  }

  return { resize, render, destroy };
}
