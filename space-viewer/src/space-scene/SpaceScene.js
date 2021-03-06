import React from 'react'
import styled from 'styled-components'
import * as THREE from 'three'

import Legend from './support/Legend'
import { OrbitControls } from './support/OrbitControls'
import { TrackballControls } from './support/TrackballControls'
import { getColor, packColor } from './support/utils'

const CanvasContainer = styled.div`
  position: relative;
  width: calc(100vw - 300px);
`
const addLights = (scene) => {
  let light = new THREE.DirectionalLight(0xefefff, .5)
  light.position.set(1, 1, 1).normalize()
  scene.add(light)

  light = new THREE.DirectionalLight(0xffefef, 0.25)
  light.position.set(-1, -1, 2).normalize()
  scene.add(light)

  light = new THREE.AmbientLight(0xffffff, 0.9)
  scene.add(light)
}

const updateCanvasSize = (ref, renderer, camera) => {
  renderer.setSize(ref.clientWidth, ref.clientHeight)
  camera.aspect = ref.clientWidth / ref.clientHeight
  camera.updateProjectionMatrix()
}

const initScene = ({
  ref,
  facet,
  points,
  setSelectedChem
}) => {
  console.debug('INITING SCENE')

  const pointUUIDMap = {}
  const sphereChemIdMap = {}

  const scene = new THREE.Scene()
  //scene.fog = new THREE.FogExp2(0x999999, 0.2)
  scene.background = new THREE.Color(0x999999)
  addLights(scene)

  const camera = new THREE.PerspectiveCamera(
    75,
    4/3,
    0.01,
    facet.maxDistFromOrigin * 6)
  camera.position.z = facet.maxDistFromOrigin  * 2

  const renderer = new THREE.WebGLRenderer()
  ref.appendChild(renderer.domElement)

  //const controls = new OrbitControls(camera, renderer.domElement)
  const controls = new TrackballControls(camera, renderer.domElement)
	controls.rotateSpeed = 1.5;
  controls.dynamicDampingFactor = 0.15;
  controls.noPan = true;

  /*
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.minDistance = 0.01
  controls.maxDistance = facet.maxDistFromOrigin * 3
  */

  scene.controls = controls

  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  const mouseDownPos = new THREE.Vector2()
  let lastIntersect = null
  mouse.x = 0
  mouse.y = 0

  renderer.domElement.addEventListener('mousemove', e => {
    const W = renderer.domElement.clientWidth
    const H = renderer.domElement.clientHeight
    mouse.x = ((e.pageX - renderer.domElement.offsetLeft) / W) * 2 - 1
    mouse.y = -(((e.pageY - renderer.domElement.offsetTop) / H) * 2 - 1)
  }, false)

  renderer.domElement.addEventListener('mousedown', e => {
    mouseDownPos.x = mouse.x
    mouseDownPos.y = mouse.y
    renderer.domElement.style.cursor = 'grabbing'
  })

  renderer.domElement.addEventListener('mouseup', e => {
    renderer.domElement.style.cursor = ''

    if (!lastIntersect)
      return

    const dist = Math.sqrt(
      Math.pow(mouseDownPos.x - mouse.x, 2) + 
      Math.pow(mouseDownPos.y - mouse.y, 2) 
    )

    if (dist < 0.01) {
      setSelectedChem(pointUUIDMap[lastIntersect.object.uuid])
    }
  })

  window.addEventListener(
    'resize',
    () => updateCanvasSize(ref, renderer, camera))
  updateCanvasSize(ref, renderer, camera)

  function animate() {
    requestAnimationFrame(animate)
    controls.update()

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children)

    if (lastIntersect) {
      lastIntersect = null
    }

    if (intersects.length) {
      lastIntersect = intersects[0]
    }

    const style = renderer.domElement.style
    if (style.cursor !== 'grabbing') {
      if (lastIntersect) {
        style.cursor = 'pointer'
      } else {
        renderer.domElement.style.cursor = 'grab'
      }
    }

    renderer.render(scene, camera)
  }

  const r3ToV = 4/3 * Math.PI
  const volPerPoint = Math.pow(facet.maxDistFromOrigin, 3) / points.length
  const r = (Math.pow(volPerPoint, 1/3) / r3ToV) * 0.8
  const geometry = new THREE.SphereBufferGeometry(r, 12, 12)

  points.forEach(point => {
    const color = packColor(getColor(facet.tags, point.tags))
    const material = new THREE.MeshLambertMaterial({ color })

    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.x = point.pos[0]
    sphere.position.y = point.pos[1]
    sphere.position.z = point.pos[2]
    sphere._CSpace = { color }

    pointUUIDMap[sphere.uuid] = point
    sphereChemIdMap[point.chem_id] = sphere
    scene.add(sphere)
  })

  animate()

  return [scene, sphereChemIdMap]
}

const SpaceScene = ({
  facet,
  chemicals,
  selectedChem,
  setSelectedChem,
  pannedChem
}) => {
  const container = React.useRef(null)
  const scene = React.useRef(null)
  const sphereChemIdMap = React.useRef(null)
  const selectedSphere = React.useRef(null)

  React.useEffect(() => {
    if (container.current && chemicals) {
      [scene.current, sphereChemIdMap.current] = initScene({
        ref: container.current,
        points: chemicals,
        facet,
        setSelectedChem
      })
    }
  }, [facet, chemicals])

  React.useEffect(() => {
    if (selectedChem) {
      const oldSphere = selectedSphere.current
      const newSphere = sphereChemIdMap.current[selectedChem.chem_id]

      if (oldSphere) {
        oldSphere.material.color.set(oldSphere._CSpace.color)
      }

      newSphere.material.color.set(0xff0000)
      selectedSphere.current = newSphere
    }
  }, [selectedChem])

  React.useEffect(() => {
    if (pannedChem && scene.current) {
      const sphere = sphereChemIdMap.current[pannedChem.chem_id]
      scene.current.controls.setPositionFromVec3(sphere.position)
    }
  }, [pannedChem])

  return (
    <CanvasContainer ref={container}>
      { facet && <Legend tags={facet.tags} /> }
    </CanvasContainer>
  )
}

export default SpaceScene
