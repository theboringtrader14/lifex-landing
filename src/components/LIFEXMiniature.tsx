/**
 * LIFEXMiniature — stylised floating island miniature.
 * Inspired by "Finding Oasis" / "Isetan City" Dribbble illustrations.
 * Fixed isometric camera, warm flat-style palette, gentle ambient animations only.
 */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─── material helpers ─────────────────────────────────────────────────────────
const mat  = (c: number) => new THREE.MeshLambertMaterial({ color: c })
const matE = (c: number, e: number, ei = 0.6) =>
  new THREE.MeshLambertMaterial({ color: c, emissive: e, emissiveIntensity: ei })
const matT = (c: number, t = 0.85) =>
  new THREE.MeshLambertMaterial({ color: c, transparent: true, opacity: t })

// ─── mesh builders ────────────────────────────────────────────────────────────
const mkBox  = (w: number, h: number, d: number, color: number) =>
  new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color))
const mkCyl  = (rT: number, rB: number, h: number, color: number, s = 20) =>
  new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, s), mat(color))
const mkCone = (r: number, h: number, color: number, s = 8) =>
  new THREE.Mesh(new THREE.ConeGeometry(r, h, s), mat(color))
const mkSph  = (r: number, color: number, s = 12) =>
  new THREE.Mesh(new THREE.SphereGeometry(r, s, s), mat(color))

function add(parent: THREE.Object3D, mesh: THREE.Mesh,
             x = 0, y = 0, z = 0, ry = 0) {
  mesh.position.set(x, y, z)
  mesh.rotation.y = ry
  mesh.castShadow = true
  mesh.receiveShadow = true
  parent.add(mesh)
  return mesh
}

// ─── island platform ──────────────────────────────────────────────────────────
function makeIsland() {
  const g = new THREE.Group()
  add(g, mkCyl(4.6, 4.8, 0.55, 0x6dc36d, 40))            // grass
  add(g, mkCyl(4.8, 4.3, 0.65, 0xb07d4a, 32), 0, -0.6)   // earth
  add(g, mkCyl(4.3, 3.5, 0.55, 0x8c7860, 24), 0, -1.1)   // rock
  add(g, mkCyl(3.5, 2.4, 0.5,  0x7a6a5a, 18), 0, -1.5)   // bottom taper
  return g
}

// ─── houses ───────────────────────────────────────────────────────────────────
function makeHouseA() {   // main cosy house — cream + red roof
  const g = new THREE.Group()
  add(g, mkBox(1.2, 1.0, 1.1, 0xfff4e0))                 // walls
  const roof = add(g, mkCone(0.95, 0.85, 0xe05c44, 4), 0, 0.92)
  roof.rotation.y = Math.PI / 4
  add(g, mkBox(0.24, 0.48, 0.06, 0x7a4e2d), 0, -0.28, 0.56) // door
  add(g, mkBox(0.22, 0.2,  0.05, 0xb3d9f5), -0.33, 0.12, 0.56) // win L
  add(g, mkBox(0.22, 0.2,  0.05, 0xb3d9f5),  0.33, 0.12, 0.56) // win R
  add(g, mkBox(0.18, 0.5,  0.18, 0xcc4a22),  0.35, 1.1, -0.18) // chimney
  return g
}

function makeHouseB() {   // smaller cottage — orange + teal
  const g = new THREE.Group()
  add(g, mkBox(0.85, 0.8, 0.85, 0xf5a35a))
  const roof = add(g, mkCone(0.74, 0.72, 0x3cb8b2, 4), 0, 0.76)
  roof.rotation.y = Math.PI / 4
  add(g, mkBox(0.2, 0.38, 0.05, 0x7a4e2d), 0, -0.22, 0.43)
  add(g, mkBox(0.2, 0.18, 0.04, 0xb3d9f5), 0, 0.08, 0.43)
  return g
}

function makeHouseC() {   // modern — light blue + dark roof
  const g = new THREE.Group()
  add(g, mkBox(1.05, 0.85, 0.9, 0xd0e8f8))
  add(g, mkBox(1.15, 0.18, 1.0, 0x2c5f8a), 0, 0.52)      // flat roof slab
  add(g, mkBox(0.22, 0.42, 0.05, 0x7a4e2d), 0, -0.23, 0.46)
  add(g, mkBox(0.26, 0.24, 0.04, 0x7ecef5), -0.3, 0.1, 0.46)
  add(g, mkBox(0.26, 0.24, 0.04, 0x7ecef5),  0.3, 0.1, 0.46)
  return g
}

// ─── finance tower ────────────────────────────────────────────────────────────
function makeFinanceTower() {
  const g = new THREE.Group()
  // base podium
  add(g, mkBox(1.1, 0.35, 1.1, 0x2c3e50), 0, 0.18)
  // main tower
  add(g, mkBox(0.85, 2.2, 0.85, 0x1c2e4a), 0, 1.45)
  // glass facade — slight blue tint
  const facade = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 1.7, 0.04), matT(0x2980b9, 0.75))
  facade.position.set(0, 1.55, 0.44)
  facade.castShadow = false
  g.add(facade)
  // ticker screen
  const ticker = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 0.2, 0.03),
    matE(0x2ecc71, 0x00ff88, 0.8))
  ticker.position.set(0, 2.35, 0.45)
  g.add(ticker)
  // window rows
  for (let row = 0; row < 3; row++) {
    for (let col = -1; col <= 1; col++) {
      const win = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.12, 0.03),
        new THREE.MeshLambertMaterial({ color: 0xffd97a, emissive: 0xffaa00, emissiveIntensity: 0.5 }))
      win.position.set(col * 0.22, 0.9 + row * 0.42, 0.44)
      g.add(win)
    }
  }
  // antenna
  add(g, mkCyl(0.025, 0.025, 0.55, 0x546e7a, 6), 0, 2.83)
  const tip = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 8, 6),
    matE(0xef5350, 0xff1744, 1.0))
  tip.position.set(0, 3.12, 0)
  g.add(tip)
  return { group: g, ticker: ticker.material as THREE.MeshLambertMaterial }
}

// ─── bank ─────────────────────────────────────────────────────────────────────
function makeBank() {
  const g = new THREE.Group()
  add(g, mkBox(1.3, 1.0, 0.95, 0xf0ebe3))                  // body
  add(g, mkBox(1.42, 0.12, 1.08, 0xddd5ca), 0, 0.56)       // roof slab
  ;[-0.44, -0.15, 0.15, 0.44].forEach(cx =>
    add(g, mkCyl(0.065, 0.065, 1.0, 0xe8e0d5, 8), cx, 0, 0.5))  // columns
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.13, 0.02),
    matE(0xf5c518, 0xe6ac00, 0.5))
  sign.position.set(0, 0.28, 0.49)
  g.add(sign)
  add(g, mkBox(0.24, 0.42, 0.04, 0x7a4e2d), 0, -0.26, 0.49) // door
  return g
}

// ─── pine trees ───────────────────────────────────────────────────────────────
function makePine(h = 1.0) {
  const g = new THREE.Group()
  add(g, mkCyl(0.07, 0.11, 0.5 * h, 0x6b4226, 7), 0, 0.25 * h)
  add(g, mkCone(0.52 * h, 0.7 * h, 0x2e7d32, 8), 0, 0.8 * h)
  add(g, mkCone(0.4  * h, 0.6 * h, 0x388e3c, 8), 0, 1.1 * h)
  add(g, mkCone(0.26 * h, 0.5 * h, 0x43a047, 8), 0, 1.35 * h)
  return g
}

// ─── round canopy tree (deciduous) ───────────────────────────────────────────
function makeRoundTree(h = 1.0) {
  const g = new THREE.Group()
  add(g, mkCyl(0.08, 0.12, 0.6 * h, 0x6b4226, 7), 0, 0.3 * h)
  // fluffy canopy — icosahedron for cartoon look
  const canopy = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.55 * h, 1),
    mat(0x4caf50))
  canopy.position.set(0, 0.85 * h, 0)
  canopy.castShadow = true
  g.add(canopy)
  const canopy2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.4 * h, 1),
    mat(0x66bb6a))
  canopy2.position.set(0.18 * h, 1.1 * h, 0.1 * h)
  g.add(canopy2)
  return g
}

// ─── walking person ───────────────────────────────────────────────────────────
function makePerson() {
  const g = new THREE.Group()
  add(g, mkSph(0.1, 0xffcc80), 0, 0.32)                   // head
  add(g, mkCyl(0.07, 0.07, 0.22, 0xff7043, 8), 0, 0.13)   // body (colourful shirt)
  add(g, mkCyl(0.04, 0.04, 0.18, 0x37474f, 6), 0, -0.06)  // legs (merged simple)
  const la = new THREE.Group(); la.position.set(-0.12, 0.16, 0)
  add(la, mkCyl(0.033, 0.033, 0.16, 0xff7043, 6))
  const ra = new THREE.Group(); ra.position.set( 0.12, 0.16, 0)
  add(ra, mkCyl(0.033, 0.033, 0.16, 0xff7043, 6))
  const ll = new THREE.Group(); ll.position.set(-0.05, -0.03, 0)
  add(ll, mkCyl(0.04, 0.04, 0.18, 0x37474f, 6))
  const rl = new THREE.Group(); rl.position.set( 0.05, -0.03, 0)
  add(rl, mkCyl(0.04, 0.04, 0.18, 0x37474f, 6))
  g.add(la, ra, ll, rl)
  return { g, la, ra, ll, rl }
}

// ─── decorative lamp post ─────────────────────────────────────────────────────
function makeLamp() {
  const g = new THREE.Group()
  add(g, mkCyl(0.03, 0.04, 0.9, 0x546e7a, 6), 0, 0.45)
  const top = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 8, 6),
    matE(0xffe082, 0xffcc02, 0.8))
  top.position.set(0, 0.95, 0)
  g.add(top)
  return g
}

// ─── small pond ───────────────────────────────────────────────────────────────
function makePond() {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.65, 0.06, 32),
    new THREE.MeshLambertMaterial({ color: 0x64b5f6, emissive: 0x1976d2, emissiveIntensity: 0.15 }))
  m.receiveShadow = true
  return m
}

// ─── main component ───────────────────────────────────────────────────────────
export default function LIFEXMiniature() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth  || 520
    const H = mount.clientHeight || 440

    // ── renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    try {
      (renderer as any).outputColorSpace = (THREE as any).SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1
    } catch { /* older three.js */ }
    mount.appendChild(renderer.domElement)

    // ── scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()

    // ── camera — fixed isometric-ish, no controls ─────────────────────────────
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100)
    camera.position.set(7.5, 6.5, 9)
    camera.lookAt(0, 0.6, 0)

    // ── lighting ──────────────────────────────────────────────────────────────
    scene.add(new THREE.HemisphereLight(0x87ceeb, 0x5a8c3e, 0.8))
    scene.add(new THREE.AmbientLight(0xfff5e4, 0.35))
    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.4)
    dirLight.position.set(6, 10, 7)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.set(1024, 1024)
    dirLight.shadow.camera.near = 0.5
    dirLight.shadow.camera.far  = 40
    dirLight.shadow.camera.left = dirLight.shadow.camera.bottom = -10
    dirLight.shadow.camera.right = dirLight.shadow.camera.top  =  10
    dirLight.shadow.bias = -0.001
    scene.add(dirLight)

    // ── world group — only floats, never rotates ───────────────────────────────
    const world = new THREE.Group()
    scene.add(world)

    // island
    world.add(makeIsland())

    // paths (sand ring)
    const pathRing = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 1.7, 48),
      new THREE.MeshLambertMaterial({ color: 0xe8d5aa, side: THREE.DoubleSide }))
    pathRing.rotation.x = -Math.PI / 2
    pathRing.position.y = 0.29
    world.add(pathRing)

    // pond
    const pond = makePond()
    pond.position.set(0.3, 0.29, 0.4)
    world.add(pond)

    // ── buildings ─────────────────────────────────────────────────────────────
    const hA = makeHouseA()
    hA.position.set(-1.7, 0.5, -0.4)
    hA.rotation.y = 0.3
    world.add(hA)

    const hB = makeHouseB()
    hB.scale.setScalar(0.88)
    hB.position.set(-1.0, 0.4, 1.5)
    hB.rotation.y = -0.4
    world.add(hB)

    const hC = makeHouseC()
    hC.scale.setScalar(0.82)
    hC.position.set(1.2, 0.43, 1.3)
    hC.rotation.y = 0.2
    world.add(hC)

    const { group: tower, ticker: tickerMat } = makeFinanceTower()
    tower.position.set(1.7, 0, -1.5)
    tower.rotation.y = -0.5
    world.add(tower)

    const bank = makeBank()
    bank.position.set(-0.1, 0, -2.0)
    bank.rotation.y = 0.1
    world.add(bank)

    // ── trees ─────────────────────────────────────────────────────────────────
    const treeData: [number, number, number, number, boolean][] = [
      [ 3.2,  0.8, 0.9, 0.0, true ],
      [-2.8,  0.5, 0.8, 0.2, true ],
      [ 2.5, -2.0, 0.85, -0.3, true ],
      [-2.6, -1.5, 0.95, 0.1, true ],
      [ 0.5, -3.0, 0.75, 0.0, true ],
      [-1.5,  2.2, 0.7,  0.3, false],
      [ 2.2,  2.2, 0.8, -0.2, false],
    ]
    const treeGroups: THREE.Group[] = []
    treeData.forEach(([x, z, s, ry, pine]) => {
      const t = pine ? makePine(s) : makeRoundTree(s)
      t.position.set(x, 0.28 * s, z)
      t.rotation.y = ry
      world.add(t)
      treeGroups.push(t)
    })

    // ── lamp posts ────────────────────────────────────────────────────────────
    const lampPositions: [number, number][] = [
      [1.4, 0.3], [-0.3, 1.6], [-1.4, -0.2], [0.3, -1.6]
    ]
    lampPositions.forEach(([x, z]) => {
      const l = makeLamp()
      l.position.set(x, 0.29, z)
      world.add(l)
    })

    // ── person ────────────────────────────────────────────────────────────────
    const { g: person, la, ra, ll, rl } = makePerson()
    world.add(person)

    // ── animation — NO rotation on world, only float + life animations ────────
    const clock = new THREE.Clock()
    let raf: number

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()

      // gentle island float only
      world.position.y = Math.sin(t * 0.7) * 0.12

      // trees sway softly in wind
      treeGroups.forEach((tr, i) => {
        const phase = i * 0.8
        tr.rotation.z = Math.sin(t * 1.2 + phase) * 0.022
        tr.rotation.x = Math.sin(t * 0.9 + phase) * 0.015
      })

      // person walks the circle
      const spd = 0.38, R = 1.55
      person.position.x = Math.cos(t * spd) * R
      person.position.z = Math.sin(t * spd) * R
      person.position.y = 0.42 + Math.abs(Math.sin(t * spd * Math.PI * 2)) * 0.03
      person.rotation.y = -(t * spd) + Math.PI / 2
      const sw = Math.sin(t * spd * Math.PI * 4) * 0.5
      la.rotation.x =  sw;  ra.rotation.x = -sw
      ll.rotation.x = -sw * 0.7; rl.rotation.x = sw * 0.7

      // ticker pulses green / red
      const isUp = Math.sin(t * 1.3) > 0
      tickerMat.color.setHex(isUp ? 0x2ecc71 : 0xe74c3c)
      tickerMat.emissive.setHex(isUp ? 0x00ff88 : 0xff3333)

      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ height: 440, width: '100%', maxWidth: 560, margin: '16px auto 0' }}
    />
  )
}
