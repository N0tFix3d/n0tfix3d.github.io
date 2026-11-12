import {
  BufferGeometry,
  Float32BufferAttribute,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three'

export function mountSignalField(host: HTMLElement): () => void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const scene = new Scene()
  const camera = new PerspectiveCamera(40, 1, 0.1, 40)
  camera.position.set(0, 0.1, 7.4)

  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setClearColor(0x000000, 0)
  const canvas = renderer.domElement
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.display = 'block'
  host.appendChild(canvas)

  const coreMaterial = new MeshBasicMaterial({
    color: 0xe0b15a,
    wireframe: true,
    transparent: true,
    opacity: 0.72,
  })
  const shellMaterial = new MeshBasicMaterial({
    color: 0x8ec4d4,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
  })
  const coreGeometry = new IcosahedronGeometry(1.35, 1)
  const shellGeometry = new IcosahedronGeometry(2.15, 0)
  const core = new Mesh(coreGeometry, coreMaterial)
  const shell = new Mesh(shellGeometry, shellMaterial)

  const count = 160
  const positions = new Float32Array(count * 3)
  for (let index = 0; index < count; index += 1) {
    const theta = Math.acos(1 - (2 * (index + 0.5)) / count)
    const phi = Math.PI * (1 + Math.sqrt(5)) * index
    const radius = 2.7
    positions[index * 3] = radius * Math.sin(theta) * Math.cos(phi)
    positions[index * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi)
    positions[index * 3 + 2] = radius * Math.cos(theta)
  }
  const pointGeometry = new BufferGeometry()
  pointGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  const pointMaterial = new PointsMaterial({
    color: 0xf3ddb0,
    size: 0.028,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    depthWrite: false,
  })
  const points = new Points(pointGeometry, pointMaterial)
  scene.add(core, shell, points)

  const pointer = { x: 0, y: 0 }
  const onPointerMove = (event: PointerEvent) => {
    const bounds = host.getBoundingClientRect()
    if (bounds.width === 0 || bounds.height === 0) return
    pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.7
    pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.45
  }

  let frame = 0
  let playing = false
  let onScreen = true

  const resize = () => {
    const width = host.clientWidth
    const height = host.clientHeight
    if (width === 0 || height === 0) return
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setSize(width, height, false)
  }

  const render = () => {
    if (!reducedMotion) {
      core.rotation.y += 0.0018
      core.rotation.x += 0.00045
      shell.rotation.y -= 0.0009
      shell.rotation.z += 0.00035
      points.rotation.y += 0.0011
      camera.position.x += (pointer.x - camera.position.x) * 0.04
      camera.position.y += (-pointer.y - camera.position.y) * 0.04
    }
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
  }

  const stop = () => {
    playing = false
    window.cancelAnimationFrame(frame)
  }

  const start = () => {
    if (playing || reducedMotion) return
    playing = true
    const tick = () => {
      if (!playing) return
      frame = window.requestAnimationFrame(tick)
      render()
    }
    tick()
  }

  const sync = () => {
    const shouldPlay = onScreen && document.visibilityState === 'visible'
    if (shouldPlay) start()
    else stop()
  }

  resize()
  render()

  const resizeObserver = new ResizeObserver(() => {
    resize()
    if (reducedMotion) render()
  })
  resizeObserver.observe(host)

  const intersection = new IntersectionObserver(([entry]) => {
    onScreen = entry?.isIntersecting ?? false
    sync()
  })
  intersection.observe(host)

  const onVisibility = () => {
    sync()
  }
  document.addEventListener('visibilitychange', onVisibility)
  if (!reducedMotion) window.addEventListener('pointermove', onPointerMove, { passive: true })
  sync()

  return () => {
    stop()
    resizeObserver.disconnect()
    intersection.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pointermove', onPointerMove)
    coreGeometry.dispose()
    shellGeometry.dispose()
    pointGeometry.dispose()
    coreMaterial.dispose()
    shellMaterial.dispose()
    pointMaterial.dispose()
    renderer.dispose()
    canvas.remove()
  }
}
