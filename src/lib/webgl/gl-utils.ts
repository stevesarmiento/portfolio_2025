export interface FramebufferTarget {
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
  width: number;
  height: number;
}

export function assertWebGl(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

export function compileShader(
  gl: WebGL2RenderingContext,
  shaderType: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(shaderType);
  assertWebGl(shader, "Failed to create shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const isOk = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean;
  if (isOk) return shader;

  const infoLog = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error";
  gl.deleteShader(shader);
  throw new Error(infoLog);
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  const program = gl.createProgram();
  assertWebGl(program, "Failed to create program");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  const isOk = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
  if (isOk) return program;

  const infoLog = gl.getProgramInfoLog(program) ?? "Unknown program link error";
  gl.deleteProgram(program);
  throw new Error(infoLog);
}

export function createFramebufferTarget(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  options?: {
    filter?: number;
  },
): FramebufferTarget {
  const framebuffer = gl.createFramebuffer();
  assertWebGl(framebuffer, "Failed to create framebuffer");

  const texture = gl.createTexture();
  assertWebGl(texture, "Failed to create texture");

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );

  const filter = options?.filter ?? gl.LINEAR;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.deleteTexture(texture);
    gl.deleteFramebuffer(framebuffer);
    throw new Error(`Framebuffer incomplete: ${status}`);
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);

  return {
    framebuffer,
    texture,
    width,
    height,
  };
}

export function deleteFramebufferTarget(gl: WebGL2RenderingContext, target: FramebufferTarget) {
  gl.deleteTexture(target.texture);
  gl.deleteFramebuffer(target.framebuffer);
}
