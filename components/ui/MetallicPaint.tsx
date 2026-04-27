"use client";
import React, { useEffect, useRef } from "react";

const vs = `#version 300 es
in vec4 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main() {
  gl_Position = a_position;
  v_texCoord = a_texCoord;
}`;

const fs = `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 outColor;
uniform sampler2D u_image;
uniform sampler2D u_depthMap;
uniform vec2 u_lightDir;
uniform float u_time;
uniform float u_metalness;
uniform float u_roughness;

vec3 metallic(vec3 baseColor, float depth, vec2 uv, vec2 lightDir) {
  float specPow = mix(8.0, 256.0, 1.0 - u_roughness);
  float fresnel = pow(1.0 - abs(depth), 3.0) * u_metalness;
  vec2 normal = normalize(vec2(
    dFdx(depth * 8.0),
    dFdy(depth * 8.0)
  ));
  vec2 reflected = reflect(-lightDir, normal);
  float specular = pow(max(dot(reflected, lightDir), 0.0), specPow);
  vec3 metal = mix(baseColor, vec3(1.0), fresnel);
  metal += specular * u_metalness;
  float rainbow = sin(depth * 12.0 + u_time * 0.5) * 0.3 + 0.7;
  metal *= vec3(
    rainbow * 0.9 + 0.1,
    rainbow * 0.85 + 0.15,
    rainbow
  );
  return metal;
}

void main() {
  vec4 src = texture(u_image, v_texCoord);
  float depth = texture(u_depthMap, v_texCoord).r;
  if (src.a < 0.1) { outColor = vec4(0.0); return; }
  vec2 lightDir = normalize(u_lightDir);
  vec3 col = metallic(src.rgb, depth, v_texCoord, lightDir);
  outColor = vec4(col * src.a, src.a);
}`;

function buildDepthMap(gl: WebGL2RenderingContext, imageData: ImageData): WebGLTexture {
  const { width, height, data } = imageData;
  const depth = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const a = data[i + 3] / 255;
      depth[y * width + x] = a;
    }
  }
  // Simple SOR blur for depth smoothing
  for (let pass = 0; pass < 6; pass++) {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (depth[idx] > 0) {
          depth[idx] = (
            depth[idx] * 4 +
            depth[(y - 1) * width + x] +
            depth[(y + 1) * width + x] +
            depth[y * width + x - 1] +
            depth[y * width + x + 1]
          ) / 8;
        }
      }
    }
  }
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, width, height, 0, gl.RED, gl.FLOAT, depth);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

interface MetallicPaintProps {
  imageSrc: string;
  className?: string;
  metalness?: number;
  roughness?: number;
  width?: number;
  height?: number;
}

const MetallicPaint: React.FC<MetallicPaintProps> = ({
  imageSrc,
  className = '',
  metalness = 1.0,
  roughness = 0.1,
  width = 48,
  height = 48,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);

    const positions = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
    const texCoords = new Float32Array([0,1, 1,1, 0,0, 1,0]);

    const posBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const tcBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, tcBuf);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, 'a_position');
    const tcLoc = gl.getAttribLocation(prog, 'a_texCoord');
    const imgLoc = gl.getUniformLocation(prog, 'u_image');
    const depthLoc = gl.getUniformLocation(prog, 'u_depthMap');
    const lightLoc = gl.getUniformLocation(prog, 'u_lightDir');
    const timeLoc = gl.getUniformLocation(prog, 'u_time');
    const metalLoc = gl.getUniformLocation(prog, 'u_metalness');
    const roughLoc = gl.getUniformLocation(prog, 'u_roughness');

    let imgTex: WebGLTexture, depthTex: WebGLTexture, loaded = false;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const offscreen = document.createElement('canvas');
      offscreen.width = img.naturalWidth; offscreen.height = img.naturalHeight;
      const ctx2d = offscreen.getContext('2d')!;
      ctx2d.drawImage(img, 0, 0);
      const imageData = ctx2d.getImageData(0, 0, offscreen.width, offscreen.height);

      imgTex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, imgTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      depthTex = buildDepthMap(gl, imageData);
      loaded = true;
    };
    img.src = imageSrc;

    const render = (t: number) => {
      rafRef.current = requestAnimationFrame(render);
      if (!loaded) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(prog);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, tcBuf);
      gl.enableVertexAttribArray(tcLoc);
      gl.vertexAttribPointer(tcLoc, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, imgTex); gl.uniform1i(imgLoc, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, depthTex); gl.uniform1i(depthLoc, 1);
      gl.uniform2f(lightLoc, mouseRef.current.x * 2 - 1, -(mouseRef.current.y * 2 - 1));
      gl.uniform1f(timeLoc, t * 0.001);
      gl.uniform1f(metalLoc, metalness);
      gl.uniform1f(roughLoc, roughness);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    rafRef.current = requestAnimationFrame(render);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [imageSrc, metalness, roughness]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ imageRendering: 'auto' }}
    />
  );
};

export default MetallicPaint;
