;(() => {
  const scene = new THREE.Scene()
  const W = 800
  const H = 600
  const camera = new THREE.PerspectiveCamera( 75, W/H, 0.1, 1000)

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(W, H)
  document.getElementById('viewer-holder').appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  camera.position.z = 5
  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  }
  animate()
  console.log('done')
})();
