;(() => {
  const pointUUIDMap = {}
  const scene = new THREE.Scene()
  const W = 800
  const H = 600

  const camera = new THREE.PerspectiveCamera( 75, W/H, 0.1, 1000)
  camera.position.z = 1

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(W, H)
  document.getElementById('viewer-holder').appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 0.01;
  controls.maxDistance = 2.0;

  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let lastIntersect = null
  mouse.x = 0
  mouse.y = 0

  renderer.domElement.addEventListener('mousemove', e => {
    mouse.x = ((e.pageX - renderer.domElement.offsetLeft) / W) * 2 - 1
    mouse.y = -(((e.pageY - renderer.domElement.offsetTop) / H) * 2 - 1)
  }, false)

  renderer.domElement.addEventListener('click', e => {
    if (lastIntersect) {
      const name = pointUUIDMap[lastIntersect.object.uuid].name
      alert('You clicked on: ' + name)
    }
  })

  function animate() {
    requestAnimationFrame(animate)
    controls.update()

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children);

    if (lastIntersect) {
      lastIntersect.object.material.color.set(0x00ff00)
      lastIntersect = null
    }

    if (intersects.length) {
      intersects[0].object.material.color.set(0xff0000)
      lastIntersect = intersects[0]
    }

    renderer.render(scene, camera)
  }

  fetch(CSpace.facetDataUrl)
    .then(res => res.json())
    .then(res => {
      const geometry = new THREE.SphereBufferGeometry(0.003, 12, 12)

      res.points.forEach(point => {
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
        const sphere = new THREE.Mesh(geometry, material)
        sphere.position.x = point.pos[0]
        sphere.position.y = point.pos[1]
        sphere.position.z = point.pos[2]

        pointUUIDMap[sphere.uuid] = point
        scene.add(sphere)
      })

      animate()
    })
})();
