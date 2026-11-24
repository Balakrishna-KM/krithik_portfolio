import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { frame, measure } from '../../lib/sections'

const damp = THREE.MathUtils.damp
const chrome = { color: '#d6cbc2', metalness: 1, roughness: 0.14, envMapIntensity: 1.5 }
const glow = (c, i) => ({ color: c, emissive: c, emissiveIntensity: i, toneMapped: false })

let _tex
const glowTex = () => {
  if (_tex) return _tex
  const c = document.createElement('canvas'); c.width = c.height = 128
  const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,79,203,.55)'); g.addColorStop(1, 'rgba(139,92,246,0)')
  x.fillStyle = g; x.fillRect(0, 0, 128, 128)
  return (_tex = new THREE.CanvasTexture(c))
}

// Knurled focus-ring grip: one instanced mesh
function Ribs({ count = 56, r = 1.42 }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const o = new THREE.Object3D()
    for (let i = 0; i < count; i++) { const a = (i / count) * Math.PI * 2; o.position.set(Math.cos(a) * r, Math.sin(a) * r, 0); o.rotation.set(0, 0, a); o.updateMatrix(); ref.current.setMatrixAt(i, o.matrix) }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])
  return <instancedMesh ref={ref} args={[null, null, count]}><boxGeometry args={[0.09, 0.05, 0.3]} /><meshStandardMaterial {...chrome} roughness={0.38} /></instancedMesh>
}

const BLADES = 8
function Lens() {
  const g = useRef(), focus = useRef(), glass = useRef(), blades = useRef(), f1 = useRef(), f2 = useRef()
  const bladeGeo = useMemo(() => {
    const s = new THREE.Shape(); s.moveTo(-0.9, -0.12); s.lineTo(0.12, -0.3); s.lineTo(0.12, 0.05); s.lineTo(-0.9, 0.3); s.closePath()
    return new THREE.ShapeGeometry(s)
  }, [])
  useFrame(({ pointer, clock }, dt) => {
    const t = clock.elapsedTime, f = frame(window.scrollY)
    g.current.position.x = damp(g.current.position.x, f.x, 2.5, dt)
    g.current.position.y = damp(g.current.position.y, f.y + Math.sin(t * 0.5) * 0.08, 2.5, dt)
    const s = damp(g.current.scale.x, f.s, 2.5, dt)
    g.current.scale.setScalar(Math.max(s, 0.0001)); g.current.visible = s > 0.03
    // slow rotation + mouse parallax
    g.current.rotation.y = damp(g.current.rotation.y, -0.5 + Math.sin(t * 0.12) * 0.18 + pointer.x * 0.28, 2, dt)
    g.current.rotation.x = damp(g.current.rotation.x, -pointer.y * 0.2 + Math.sin(t * 0.09) * 0.05, 2, dt)
    // focus pull: grip ring turns, front element breathes, aperture opens/closes (very slow)
    const pull = Math.sin(t * 0.32)
    focus.current.rotation.z = pull * 0.35
    glass.current.position.z = 0.6 + pull * 0.03
    const ap = 0.55 + Math.sin(t * 0.22) * 0.18
    blades.current.children.forEach((b) => (b.children[0].rotation.z = ap))
    f1.current.opacity = 0.24 + Math.sin(t * 0.4) * 0.06; f2.current.opacity = 0.16 + Math.sin(t * 0.3 + 1) * 0.04
  })
  return (
    <group ref={g}>
      <mesh rotation-x={Math.PI / 2} position={[0, 0, -0.9]}><cylinderGeometry args={[0.95, 0.95, 1.2, 64]} /><meshStandardMaterial {...chrome} roughness={0.32} /></mesh>
      <mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[1.25, 1.25, 1.1, 64]} /><meshStandardMaterial {...chrome} roughness={0.2} /></mesh>
      <group ref={focus} position={[0, 0, 0.1]}>
        <mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[1.36, 1.36, 0.36, 64]} /><meshStandardMaterial color="#1b1424" metalness={0.8} roughness={0.35} /></mesh>
        <Ribs />
      </group>
      <mesh position={[0, 0, -0.35]}><torusGeometry args={[1.3, 0.05, 16, 96]} /><meshStandardMaterial {...chrome} /></mesh>
      <mesh position={[0, 0, 0.58]}><torusGeometry args={[1.2, 0.07, 16, 96]} /><meshStandardMaterial {...chrome} roughness={0.1} /></mesh>
      <mesh position={[0, 0, 0.62]}><torusGeometry args={[0.98, 0.035, 16, 96]} /><meshStandardMaterial {...glow('#b5524b', 2.4)} /></mesh>
      <mesh position={[0, 0, 0.5]}><torusGeometry args={[0.72, 0.02, 16, 64]} /><meshStandardMaterial {...glow('#a9744a', 2.4)} /></mesh>
      {/* aperture */}
      <mesh position={[0, 0, 0.26]}><circleGeometry args={[0.95, 48]} /><meshBasicMaterial color="#050202" /></mesh>
      <group ref={blades} position={[0, 0, 0.3]}>
        {Array.from({ length: BLADES }, (_, i) => {
          const a = (i / BLADES) * Math.PI * 2
          return (
            <group key={i} position={[Math.cos(a) * 0.8, Math.sin(a) * 0.8, i * 0.003]} rotation-z={a}>
              <group><mesh geometry={bladeGeo}><meshStandardMaterial color="#2d2220" metalness={0.9} roughness={0.35} side={THREE.DoubleSide} /></mesh></group>
            </group>
          )
        })}
      </group>
      {/* coated front glass (translucent so the blades show through) */}
      <mesh ref={glass} position={[0, 0, 0.6]} scale={[1, 1, 0.35]}>
        <sphereGeometry args={[0.95, 48, 48]} />
        <meshPhysicalMaterial color="#120606" metalness={0.1} roughness={0.02} clearcoat={1} iridescence={1} iridescenceIOR={1.3} envMapIntensity={4} transparent opacity={0.4} depthWrite={false} />
      </mesh>
      {/* subtle flare */}
      <sprite position={[0, 0, 1.1]} scale={[3.4, 3.4, 1]}><spriteMaterial ref={f1} map={glowTex()} color="#b5524b" blending={THREE.AdditiveBlending} transparent opacity={0.24} depthWrite={false} /></sprite>
      <sprite position={[0, 0, 1.1]} scale={[9, 0.2, 1]}><spriteMaterial ref={f2} map={glowTex()} color="#a9744a" blending={THREE.AdditiveBlending} transparent opacity={0.16} depthWrite={false} /></sprite>
    </group>
  )
}

// Transparent film strips: glowing rails, sprocket holes, faint frames
const W = 8, H = 1.1, HOLES = 26, FRAMES = 7
function Strip({ x, y, z, rot, depth, phase }) {
  const g = useRef(), holes = useRef(), frames = useRef()
  useLayoutEffect(() => {
    const o = new THREE.Object3D()
    for (let i = 0; i < HOLES * 2; i++) { const row = i < HOLES ? 1 : -1, k = i % HOLES; o.position.set(-W / 2 + (k + 0.5) * (W / HOLES), row * 0.46, 0.006); o.updateMatrix(); holes.current.setMatrixAt(i, o.matrix) }
    for (let i = 0; i < FRAMES; i++) { o.position.set(-W / 2 + (i + 0.5) * (W / FRAMES), 0, 0.006); o.updateMatrix(); frames.current.setMatrixAt(i, o.matrix) }
    holes.current.instanceMatrix.needsUpdate = frames.current.instanceMatrix.needsUpdate = true
  }, [])
  useFrame(({ pointer, clock }, dt) => {
    const t = clock.elapsedTime
    g.current.position.y = THREE.MathUtils.euclideanModulo(y + window.scrollY * 0.0009 * depth + t * 0.02 * depth + 14, 28) - 14 + Math.sin(t * 0.25 + phase) * 0.12
    g.current.position.x = damp(g.current.position.x, x + pointer.x * depth * 0.9, 2, dt)
    g.current.rotation.z = rot + Math.sin(t * 0.1 + phase) * 0.04
    g.current.rotation.y = damp(g.current.rotation.y, pointer.x * 0.14 * depth, 2, dt)
  })
  return (
    <group ref={g} position={[x, y, z]} rotation-z={rot}>
      <mesh><boxGeometry args={[W, H, 0.012]} /><meshStandardMaterial color="#1f0e0d" metalness={0.5} roughness={0.3} transparent opacity={0.2} depthWrite={false} /></mesh>
      {[1, -1].map((s) => <mesh key={s} position={[0, s * (H / 2), 0]}><boxGeometry args={[W, 0.025, 0.02]} /><meshStandardMaterial {...glow('#b5524b', 1.6)} /></mesh>)}
      <instancedMesh ref={holes} args={[null, null, HOLES * 2]}><planeGeometry args={[0.13, 0.085]} /><meshBasicMaterial color="#0a0606" /></instancedMesh>
      <instancedMesh ref={frames} args={[null, null, FRAMES]}><planeGeometry args={[W / FRAMES - 0.2, 0.62]} /><meshStandardMaterial {...glow('#a9744a', 0.5)} transparent opacity={0.16} depthWrite={false} /></instancedMesh>
    </group>
  )
}
const STRIPS = [
  { x: -6, y: 3, z: -5, rot: 0.32, depth: 1, phase: 0 },
  { x: 6.5, y: -3.5, z: -7, rot: -0.28, depth: 0.7, phase: 2 },
  { x: 0, y: -9, z: -9, rot: 0.12, depth: 0.5, phase: 4 },
  { x: -3, y: 10, z: -10, rot: -0.2, depth: 0.4, phase: 1 },
]
function Rig() {
  useFrame(({ camera, pointer }, dt) => { camera.position.x = damp(camera.position.x, pointer.x * 0.5, 2, dt); camera.position.y = damp(camera.position.y, pointer.y * 0.3, 2, dt); camera.lookAt(0, 0, 0) })
  return null
}
export default function CinematicScene() {
  useEffect(() => {
    measure()
    const ro = new ResizeObserver(measure); ro.observe(document.body)
    const t = setTimeout(measure, 1500)
    return () => { ro.disconnect(); clearTimeout(t) }
  }, [])
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 9], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} style={{ pointerEvents: 'none' }}>
      <fog attach="fog" args={['#0a0606', 9, 28]} />
      <ambientLight intensity={0.22} />
      <pointLight position={[4, 3, 5]} color="#b5524b" intensity={70} />
      <pointLight position={[-5, -3, 4]} color="#a9744a" intensity={55} />
      <spotLight position={[0, 6, 6]} color="#d3c7bd" intensity={40} angle={0.5} penumbra={1} />
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="rect" intensity={4} position={[0, 5, -5]} scale={[10, 10, 1]} color="#b5524b" />
          <Lightformer form="ring" intensity={3} position={[-5, 1, -1]} scale={4} color="#a9744a" />
          <Lightformer form="rect" intensity={2.5} position={[5, -1, 2]} scale={[6, 2, 1]} color="#c9776e" />
        </group>
      </Environment>
      <Rig /><Lens />
      {STRIPS.map((s, i) => <Strip key={i} {...s} />)}
      <Sparkles count={70} scale={[20, 14, 10]} size={2} speed={0.2} opacity={0.7} color="#c9776e" />
      <Sparkles count={40} scale={[18, 14, 8]} size={3} speed={0.15} opacity={0.6} color="#d3c7bd" />
    </Canvas>
  )
}
