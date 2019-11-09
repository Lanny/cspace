;(() => {

  function addLights(scene) {
    const pLight1 = new THREE.PointLight(0xffffff, 0.75, 100)
    pLight1.position.set(5, 5, 0)

    const pLight2 = new THREE.PointLight(0xffffff, 0.75, 100)
    pLight2.position.set(-5, 5, 0)


    const pLight3 = new THREE.PointLight(0xffffff, 0.75, 100)
    pLight3.position.set(0, 5, 0)

    const pLight4 = new THREE.PointLight(0xffffff, 0.5, 100)
    pLight4.position.set(0, -5, 0)

    scene.add(pLight1)
    scene.add(pLight2)
    scene.add(pLight3)
    scene.add(pLight4)
    
    let light = new THREE.DirectionalLight(0xefefff, 1.5)
    light.position.set(1, 1, 1).normalize()
    scene.add(light)

    light = new THREE.DirectionalLight(0xffefef, 1.5)
    light.position.set(-1, -1, -1).normalize()
    scene.add(light)
  }
  
  const pointUUIDMap = {}
  const W = 800
  const H = 600

  const POINT_COLOR = 0xaaaa00

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x999999, 1.0)
  scene.background = new THREE.Color(0x999999)
  addLights(scene)

  const camera = new THREE.PerspectiveCamera( 75, W/H, 0.01, 1000)
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
      lastIntersect.object.material.color.set(POINT_COLOR)
      lastIntersect = null
    }

    if (intersects.length) {
      intersects[0].object.material.color.set(0xff0000)
      lastIntersect = intersects[0]
    }

    renderer.render(scene, camera)
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.2))


  fetch(CSpace.facetDataUrl)
    .then(res => res.json())
    .then(res => {
      const geometry = new THREE.SphereBufferGeometry(0.005, 12, 12)

      res.points.forEach(point => {
        const material = new THREE.MeshPhongMaterial({
          color: POINT_COLOR,
          specular: 0x111111,
          shininess: 2
        })
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
