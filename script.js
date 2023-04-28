import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/loaders/3DMLoader.js'
import rhino3dm from 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js'



 

// Set up the Three.js scene, camera, and renderer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Add orbit controls to the camera
const controls = new OrbitControls(camera, renderer.domElement)

// Load the .gh file and add it to the scene
const loader = new THREE.FileLoader()
loader.load(
  '/Assignment_ziqi cui.gh',
  (data) => {
    // Parse the .gh file data
    const parser = new DOMParser()
    const xml = parser.parseFromString(data, 'application/xml')
    const ghData = xml.getElementsByTagName('GrasshopperDocument')[0]

    // Create a Three.js Object3D to hold the geometry
    const geometry = new THREE.BufferGeometry()
    const material = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Extract the geometry data from the .gh file and add it to the Three.js mesh
    const meshData = ghData.getElementsByTagName('Mesh')[0]
    const positions = meshData.getElementsByTagName('P')[0].textContent.split(' ').map(Number)
    const normals = meshData.getElementsByTagName('N')[0].textContent.split(' ').map(Number)
    const indices = meshData.getElementsByTagName('F')[0].textContent.split(' ').map(Number)
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3))
    geometry.setIndex(indices)
  },
  undefined,
  (error) => {
    console.error(error)
  }
)

// Render the scene
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()
