import React from 'react'
import * as THREE from 'three'

import { OrbitControls } from './support/OrbitControls'
import { getColor, packColor } from './support/utils'

const addLights = (scene) => {
  let light = new THREE.DirectionalLight(0xefefff, 1.)
  light.position.set(1, 1, 1).normalize()
  scene.add(light)

  light = new THREE.DirectionalLight(0xffefef, 1.)
  light.position.set(-1, -1, -1).normalize()
  scene.add(light)

  light = new THREE.AmbientLight(0xffffff, 0.9)
  scene.add(light)
}

const initScene = (ref, facet, points) => {
  console.debug('INITING SCENE')

  const pointUUIDMap = {}
  const sphereChemIdMap = {}
  const W = 800
  const H = 600

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x999999, 0.2)
  scene.background = new THREE.Color(0x999999)
  addLights(scene)

  const camera = new THREE.PerspectiveCamera(75, W/H, 0.01, 1000)
  camera.position.z = 1

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(W, H)
  ref.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.minDistance = 0.01
  controls.maxDistance = 2.0

  scene.controls = controls

  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let lastIntersect = null
  mouse.x = 0
  mouse.y = 0

  renderer.domElement.addEventListener('mousemove', e => {
    mouse.x = ((e.pageX - renderer.domElement.offsetLeft) / W) * 2 - 1
    mouse.y = -(((e.pageY - renderer.domElement.offsetTop) / H) * 2 - 1)
  }, false)

  function animate() {
    requestAnimationFrame(animate)
    controls.update()

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children)

    /*
    if (lastIntersect) {
      const formerColor = pointUUIDMap[lastIntersect.object.uuid].color
      lastIntersect.object.material.color.set(formerColor)
      lastIntersect = null
    }

    if (intersects.length) {
      intersects[0].object.material.color.set(0xff0000)
      lastIntersect = intersects[0]
    }
    */

    renderer.render(scene, camera)
  }

  const geometry = new THREE.SphereBufferGeometry(0.005, 12, 12)

  points.forEach(point => {
    point.color = packColor(getColor(facet.tags, point.tags)) 
    const material = new THREE.MeshPhongMaterial({
      color: point.color,
      specular: 0x111111,
      shininess: 0
    })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.x = point.pos[0]
    sphere.position.y = point.pos[1]
    sphere.position.z = point.pos[2]

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
  pannedChem
}) => {
  const container = React.useRef(null)
  const scene = React.useRef(null)
  const sphereChemIdMap = React.useRef(null)
  const selectedSphere = React.useRef(null)

  React.useEffect(() => {
    if (container.current && chemicals) {
      [scene.current, sphereChemIdMap.current] = initScene(container.current, facet, chemicals)
    }
  }, [facet, chemicals])

  React.useEffect(() => {
    if (selectedChem) {
      const oldSphere = selectedSphere.current
      const newSphere = sphereChemIdMap.current[selectedChem.chem_id]

      if (oldSphere) {
        oldSphere.material.color.set(selectedChem.color)
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
    <div ref={container}></div>
  )
}

export default SpaceScene
