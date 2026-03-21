export const fullscreenVertexShaderSource = `#version 300 es
precision highp float;

out vec2 vUv;

void main() {
  vec2 pos;
  if (gl_VertexID == 0) pos = vec2(-1.0, -1.0);
  else if (gl_VertexID == 1) pos = vec2(3.0, -1.0);
  else pos = vec2(-1.0, 3.0);

  vUv = 0.5 * (pos + 1.0);
  gl_Position = vec4(pos, 0.0, 1.0);
}
`;

export const debugFragmentShaderSource = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform float uTimeSeconds;

void main() {
  vec2 uv = vUv;
  float lineX = step(0.985, fract(uv.x * 16.0));
  float lineY = step(0.985, fract(uv.y * 12.0));
  float grid = clamp(lineX + lineY, 0.0, 1.0);

  float pulse = 0.25 + 0.75 * (0.5 + 0.5 * sin(uTimeSeconds * 0.6));
  vec3 col = mix(vec3(0.0), vec3(1.0) * pulse, grid);
  outColor = vec4(col, 1.0);
}
`;

export const geodesicFragmentShaderSource = `#version 300 es
precision highp float;
precision highp int;

out vec4 outColor;

uniform vec2 uResolution;

uniform vec3 uCamPos;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform vec3 uCamForward;
uniform float uTanHalfFov;
uniform float uAspect;

uniform float uRs;
uniform float uStepSize;
uniform float uEscapeRadius;
uniform int uMaxSteps;

uniform float uDiskR1;
uniform float uDiskR2;

uniform int uNumObjects;
uniform vec4 uObjPosRadius[16];
uniform vec4 uObjColor[16];

struct Ray {
  float x;
  float y;
  float z;
  float r;
  float theta;
  float phi;
  float dr;
  float dtheta;
  float dphi;
  float E;
  float L;
};

Ray initRay(vec3 pos, vec3 dir) {
  Ray ray;

  ray.x = pos.x;
  ray.y = pos.y;
  ray.z = pos.z;
  ray.r = length(pos);

  float zOverR = ray.r > 0.0 ? pos.z / ray.r : 0.0;
  zOverR = clamp(zOverR, -1.0, 1.0);
  ray.theta = acos(zOverR);
  ray.phi = atan(pos.y, pos.x);

  float sinTheta = max(sin(ray.theta), 1e-6);
  float cosTheta = cos(ray.theta);
  float sinPhi = sin(ray.phi);
  float cosPhi = cos(ray.phi);

  float dx = dir.x;
  float dy = dir.y;
  float dz = dir.z;

  ray.dr = sinTheta * cosPhi * dx + sinTheta * sinPhi * dy + cosTheta * dz;
  ray.dtheta = (cosTheta * cosPhi * dx + cosTheta * sinPhi * dy - sinTheta * dz) / max(ray.r, 1e-6);
  ray.dphi = (-sinPhi * dx + cosPhi * dy) / max(ray.r * sinTheta, 1e-6);

  ray.L = ray.r * ray.r * sinTheta * ray.dphi;
  float f = 1.0 - uRs / max(ray.r, 1e-6);
  float dt_dL = sqrt((ray.dr * ray.dr) / max(f, 1e-6)
    + ray.r * ray.r * (ray.dtheta * ray.dtheta + sinTheta * sinTheta * ray.dphi * ray.dphi));
  ray.E = f * dt_dL;

  return ray;
}

bool intercept(Ray ray) {
  return ray.r <= uRs;
}

bool interceptObject(Ray ray, out vec4 objectColor, out vec3 hitCenter) {
  vec3 P = vec3(ray.x, ray.y, ray.z);

  for (int i = 0; i < 16; ++i) {
    if (i >= uNumObjects) break;
    vec3 center = uObjPosRadius[i].xyz;
    float radius = uObjPosRadius[i].w;
    if (distance(P, center) <= radius) {
      objectColor = uObjColor[i];
      hitCenter = center;
      return true;
    }
  }

  objectColor = vec4(0.0);
  hitCenter = vec3(0.0);
  return false;
}

void geodesicRHS(Ray ray, out vec3 d1, out vec3 d2) {
  float r = ray.r;
  float theta = ray.theta;
  float dr = ray.dr;
  float dtheta = ray.dtheta;
  float dphi = ray.dphi;

  float sinTheta = max(sin(theta), 1e-6);
  float cosTheta = cos(theta);

  float f = 1.0 - uRs / max(r, 1e-6);
  float dt_dL = ray.E / max(f, 1e-6);

  d1 = vec3(dr, dtheta, dphi);
  d2.x =
    - (uRs / (2.0 * r * r)) * f * dt_dL * dt_dL
    + (uRs / (2.0 * r * r * max(f, 1e-6))) * dr * dr
    + r * (dtheta * dtheta + sinTheta * sinTheta * dphi * dphi);

  d2.y = -2.0 * dr * dtheta / max(r, 1e-6) + sinTheta * cosTheta * dphi * dphi;
  d2.z = -2.0 * dr * dphi / max(r, 1e-6) - 2.0 * cosTheta / sinTheta * dtheta * dphi;
}

void stepRay(inout Ray ray, float dL) {
  vec3 k1a;
  vec3 k1b;
  geodesicRHS(ray, k1a, k1b);

  ray.r += dL * k1a.x;
  ray.theta += dL * k1a.y;
  ray.phi += dL * k1a.z;
  ray.dr += dL * k1b.x;
  ray.dtheta += dL * k1b.y;
  ray.dphi += dL * k1b.z;

  float sinTheta = sin(ray.theta);
  float cosTheta = cos(ray.theta);
  float cosPhi = cos(ray.phi);
  float sinPhi = sin(ray.phi);

  ray.x = ray.r * sinTheta * cosPhi;
  ray.y = ray.r * sinTheta * sinPhi;
  ray.z = ray.r * cosTheta;
}

bool crossesEquatorialPlane(vec3 oldPos, vec3 newPos) {
  bool crossed = oldPos.y * newPos.y < 0.0;
  float radius = length(vec2(newPos.x, newPos.z));
  return crossed && (radius >= uDiskR1) && (radius <= uDiskR2);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float u = (2.0 * frag.x / uResolution.x - 1.0) * uAspect * uTanHalfFov;
  float v = (1.0 - 2.0 * frag.y / uResolution.y) * uTanHalfFov;
  vec3 dir = normalize(u * uCamRight - v * uCamUp + uCamForward);

  Ray ray = initRay(uCamPos, dir);
  vec3 prevPos = vec3(ray.x, ray.y, ray.z);

  bool hitBlackHole = false;
  bool hitDisk = false;
  bool hitObject = false;

  vec4 objectColor = vec4(0.0);
  vec3 hitCenter = vec3(0.0);

  const int OUTER_STEPS = 2000;
  const int INNER_STEPS = 8;

  int stepIndex = 0;
  bool shouldStop = false;

  for (int outer = 0; outer < OUTER_STEPS; ++outer) {
    for (int inner = 0; inner < INNER_STEPS; ++inner) {
      if (stepIndex >= uMaxSteps) { shouldStop = true; break; }
      if (intercept(ray)) { hitBlackHole = true; shouldStop = true; break; }

      stepRay(ray, uStepSize);
      stepIndex += 1;

      vec3 newPos = vec3(ray.x, ray.y, ray.z);
      if (crossesEquatorialPlane(prevPos, newPos)) { hitDisk = true; shouldStop = true; break; }
      if (interceptObject(ray, objectColor, hitCenter)) { hitObject = true; shouldStop = true; break; }

      prevPos = newPos;
      if (ray.r > uEscapeRadius) { shouldStop = true; break; }
    }

    if (shouldStop) break;
  }

  vec4 color = vec4(0.0);
  if (hitDisk) {
    float rNorm = length(vec3(ray.x, ray.y, ray.z)) / uDiskR2;
    vec3 diskColor = vec3(1.0, rNorm, 0.2);
    color = vec4(diskColor, rNorm);
  } else if (hitBlackHole) {
    color = vec4(0.0, 0.0, 0.0, 1.0);
  } else if (hitObject) {
    vec3 P = vec3(ray.x, ray.y, ray.z);
    vec3 N = normalize(P - hitCenter);
    vec3 V = normalize(uCamPos - P);
    float ambient = 0.1;
    float diff = max(dot(N, V), 0.0);
    float intensity = ambient + (1.0 - ambient) * diff;
    vec3 shaded = objectColor.rgb * intensity;
    color = vec4(shaded, objectColor.a);
  }

  outColor = color;
}
`;

export const blitFragmentShaderSource = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uTexture;

void main() {
  outColor = texture(uTexture, vUv);
}
`;

export const gridVertexShaderSource = `#version 300 es
precision highp float;

layout(location = 0) in vec3 aPos;

uniform mat4 uViewProj;

void main() {
  gl_Position = uViewProj * vec4(aPos, 1.0);
}
`;

export const gridFragmentShaderSource = `#version 300 es
precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(0.5, 0.5, 0.5, 0.7);
}
`;
