// 챕터 패널 간 WebGL 디스플레이스먼트 전환 (ogl)
// - 챕터마다 텍스처 1개: 포스터 이미지로 시작 → 루프 영상이 준비되면 영상 텍스처로 교체
// - uP(0..1)에 따라 노이즈 경계가 오른쪽→왼쪽으로 지나가며 A→B, 경계에 금빛 이음선(초원의 해)
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tA;
  uniform sampler2D tB;
  uniform vec2 uSizeA;
  uniform vec2 uSizeB;
  uniform vec2 uRes;
  uniform float uP;
  uniform float uTime;
  uniform vec3 uSeam;
  varying vec2 vUv;

  vec2 cover(vec2 uv, vec2 size, vec2 res) {
    float rs = res.x / res.y;
    float ri = size.x / size.y;
    vec2 scale = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
    // 가장자리(디코딩 패딩 행 등) 샘플링 방지
    return clamp((uv - 0.5) * scale + 0.5, vec2(0.002, 0.01), vec2(0.998, 0.99));
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float p = uP;
    float n = fbm(uv * vec2(2.2, 3.4) + vec2(uTime * 0.04, -uTime * 0.02));
    float edgeN = (n - 0.5) * 0.42;

    // 경계: x = 1.35 → -0.35
    float front = 1.35 - p * 1.7;
    float d = uv.x + edgeN - front;
    float mask = smoothstep(-0.11, 0.11, d);

    // A는 왼쪽으로 밀려나며 일렁이고, B는 오른쪽에서 들어오며 자리를 잡음
    float warpA = p * (0.6 + n * 0.8);
    float warpB = (1.0 - p) * (0.6 + n * 0.8);
    vec2 uvA = uv + vec2(p * 0.22, 0.0) + vec2(edgeN, edgeN * 0.4) * 0.12 * warpA;
    vec2 uvB = uv - vec2((1.0 - p) * 0.22, 0.0) - vec2(edgeN, edgeN * 0.4) * 0.12 * warpB;
    uvA = (uvA - 0.5) * (1.0 - p * 0.06) + 0.5;
    uvB = (uvB - 0.5) * (1.0 + (1.0 - p) * 0.08) + 0.5;

    vec3 a = texture2D(tA, cover(uvA, uSizeA, uRes)).rgb;
    vec3 b = texture2D(tB, cover(uvB, uSizeB, uRes)).rgb;
    vec3 col = mix(a, b, mask);

    // 금빛 이음선
    float seam = smoothstep(0.16, 0.0, abs(d)) * sin(clamp(p, 0.0, 1.0) * 3.14159);
    col += uSeam * seam * 0.55;
    col = mix(col, col * vec3(1.06, 1.0, 0.92), seam * 0.6);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function createChapterGL(canvas, posters) {
  let renderer;
  try {
    renderer = new Renderer({ canvas, dpr: Math.min(window.devicePixelRatio || 1, 1.5), alpha: false, antialias: false });
  } catch {
    return null;
  }
  const { gl } = renderer;
  if (!gl) return null;

  const slots = posters.map((src) => {
    const texture = new Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });
    return { src, texture, size: [16, 9], video: null, ready: false, requested: false };
  });

  // 포스터 텍스처는 섹션에 가까워졌을 때 요청 (첫 화면 용량 보호)
  function prime() {
    slots.forEach((slot) => {
      if (slot.requested) return;
      slot.requested = true;
      const img = new Image();
      img.crossOrigin = 'anonymous'; // WebGL 텍스처용 CORS 요청
      img.decoding = 'async';
      img.onload = () => {
        if (slot.video?.readyState >= 2) return;
        slot.texture.image = img;
        slot.size = [img.naturalWidth, img.naturalHeight];
        slot.ready = true;
      };
      img.src = slot.src;
    });
  }

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      tA: { value: slots[0].texture },
      tB: { value: slots[Math.min(1, slots.length - 1)].texture },
      uSizeA: { value: [16, 9] },
      uSizeB: { value: [16, 9] },
      uRes: { value: [1, 1] },
      uP: { value: 0 },
      uTime: { value: 0 },
      uSeam: { value: [0.83, 0.66, 0.26] },
    },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  // ogl이 canvas에 inline 크기를 넣으므로 부모 기준으로 측정
  const resize = () => {
    const box = canvas.parentElement;
    const w = Math.max(1, box.clientWidth);
    const h = Math.max(1, box.clientHeight);
    renderer.setSize(w, h);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    program.uniforms.uRes.value = [w, h];
  };
  resize();

  function attachVideo(index, video) {
    const slot = slots[index];
    slot.video = video;
  }

  function frame(a, b, p, time) {
    const u = program.uniforms;
    for (const i of new Set([a, b])) {
      const slot = slots[i];
      const v = slot.video;
      if (v && v.readyState >= 2 && v.videoWidth) {
        slot.texture.image = v;
        slot.texture.needsUpdate = true;
        slot.size = [v.videoWidth, v.videoHeight];
        slot.ready = true;
      }
    }
    u.tA.value = slots[a].texture;
    u.tB.value = slots[b].texture;
    u.uSizeA.value = slots[a].size;
    u.uSizeB.value = slots[b].size;
    u.uP.value = p;
    u.uTime.value = time;
    if (!slots[a].ready) return false;
    renderer.render({ scene: mesh });
    return true;
  }

  function destroy() {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }

  return { resize, frame, attachVideo, prime, destroy };
}
