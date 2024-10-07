import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}

function Stars({ count = 2000 }) {  // Reducimos la cantidad de estrellas
  const mesh = useRef();
  const starTexture = useMemo(() => createStarTexture(), []);

  const [positions, colors, scales] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.1, 0.9, 0.9);  // Colores azulados y brillantes
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      scales[i] = Math.random() * 0.2 + 0.1;  // Hacemos las estrellas más pequeñas
    }
    return [positions, colors, scales];
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      const time = state.clock.getElapsedTime() * 0.1;  // Ralentizamos el movimiento
      const scaleAttribute = mesh.current.geometry.attributes.scale;

      for (let i = 0; i < count; i++) {
        // Efecto de parpadeo suave
        scaleAttribute.array[i] = scales[i] * (1 + Math.sin(time + i * 1000) * 0.2);
      }

      scaleAttribute.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}  // Reducimos el tamaño de las partículas
        vertexColors
        transparent
        opacity={0.8}  // Reducimos la opacidad para hacerlas más sutiles
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        map={starTexture}
      />
    </points>
  );
}

export default Stars;
