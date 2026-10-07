// 커서를 따라오는 이미지 프리뷰 (ogl WebGL)
// - 커서 속도에 비례하는 물결 왜곡 + 약한 RGB 분리
// - 이미지 교체 시 물결 경계로 크로스 전환, 등장/퇴장은 아래→위 물결 와이프
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
precision highp float;
uniform sampler2D tA;
uniform sampler2D tB;
uniform vec2 uScaleA;
uniform vec2 uScaleB;
uniform float uMix;
uniform float uReveal;
uniform vec2 uVel;
uniform float uTime;
varying vec2 vUv;

vec2 cover(vec2 uv, vec2 s) { return (uv - 0.5) * s + 0.5; }

vec3 sampleRGB(sampler2D t, vec2 uv, vec2 s, vec2 shift) {
  float r = texture2D(t, cover(uv + shift, s)).r;
  float g = texture2D(t, cover(uv, s)).g;
  float b = texture2D(t, cover(uv - shift, s)).b;
  return vec3(r, g, b);
}

void main() {
  vec2 uv = vUv;
  float speed = clamp(length(uVel), 0.0, 1.0);
  // 물결: 속도에 비례
  uv.x += sin(uv.y * 14.0 + uTime * 5.0) * 0.016 * speed;
  uv.y += cos(uv.x * 11.0 + uTime * 4.0) * 0.012 * speed;
  // 진행 방향으로 살짝 끌림
  uv -= uVel * 0.05 * (1.0 - distance(vUv, vec2(0.5)));
  // 전환 경계(물결)
  float edge = uMix * 1.3 - 0.15 + sin(vUv.x * 9.0 + uTime * 2.0) * 0.04;
  float m = 1.0 - smoothstep(edge - 0.12, edge + 0.12, 1.0 - vUv.y);
  vec2 shift = uVel * 0.012;
  vec3 a = sampleRGB(tA, uv, uScaleA, shift);
  vec3 b = sampleRGB(tB, uv, uScaleB, shift);
  vec3 col = mix(a, b, m);
  // 등장 와이프 (아래→위, 물결 경계)
  float w = uReveal * 1.25 - 0.12 + sin(vUv.x * 7.0 + uTime * 3.0) * 0.03;
  float alpha = 1.0 - smoothstep(w - 0.08, w, vUv.y);
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

export class RipplePreview {
  constructor(canvasHost, { aspect = 0.8 } = {}) {
    this.aspect = aspect;
    this.renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true, premultipliedAlpha: true, antialias: false });
    const gl = this.renderer.gl;
    this.gl = gl;
    gl.clearColor(0, 0, 0, 0);
    canvasHost.appendChild(gl.canvas);
    this.textures = new Map();
    this.blank = new Texture(gl, { image: new Uint8Array([0, 0, 0, 0]), width: 1, height: 1, magFilter: gl.NEAREST });
    this.program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      uniforms: {
        tA: { value: this.blank }, tB: { value: this.blank },
        uScaleA: { value: [1, 1] }, uScaleB: { value: [1, 1] },
        uMix: { value: 0 }, uReveal: { value: 0 }, uVel: { value: [0, 0] }, uTime: { value: 0 },
      },
    });
    this.mesh = new Mesh(gl, { geometry: new Triangle(gl), program: this.program });
    this.current = null;
  }

  resize(w, h) {
    this.renderer.setSize(w, h);
    this.w = w; this.h = h;
  }

  scaleFor(tex) {
    const img = tex.image;
    if (!img || !img.width) return [1, 1];
    const ia = img.width / img.height;
    const pa = this.w / this.h;
    return ia > pa ? [pa / ia, 1] : [1, ia / pa];
  }

  load(url) {
    if (this.textures.has(url)) return this.textures.get(url);
    const tex = new Texture(this.gl, { generateMipmaps: false, minFilter: this.gl.LINEAR });
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CDN 이미지를 WebGL 텍스처로 쓰려면 필수
    img.decoding = 'async';
    img.onload = () => { tex.image = img; tex.loaded = true; };
    // 같은 URL 을 일반 <img>(CORS 없음)가 먼저 받아 브라우저 캐시에 ACAO 없는 응답이 남으면
    // crossOrigin 요청이 그 캐시를 재사용해 CORS 로 실패한다 → WebGL 용은 ?gl 로 캐시를 분리
    img.src = `${url}${url.includes('?') ? '&' : '?'}gl`;
    this.textures.set(url, tex);
    return tex;
  }

  preload(urls) { urls.forEach((u) => this.load(u)); }

  // 다음 이미지로 전환: B 에 새 텍스처, uMix 0→1 은 호출 측(GSAP)에서
  setNext(url) {
    const u = this.program.uniforms;
    const tex = this.load(url);
    if (!this.current) {
      u.tA.value = tex; u.tB.value = tex;
    } else {
      u.tA.value = u.tB.value;
      u.tB.value = tex;
    }
    u.uMix.value = 0;
    this.current = url;
  }

  render(time, vel) {
    const u = this.program.uniforms;
    u.uTime.value = time;
    u.uVel.value = vel;
    u.uScaleA.value = this.scaleFor(u.tA.value);
    u.uScaleB.value = this.scaleFor(u.tB.value);
    this.renderer.render({ scene: this.mesh });
  }

  destroy() {
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    this.gl.canvas.remove();
  }
}
