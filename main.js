import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js';





const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

//background texture
const starTexture=cubeTextureLoader.load([
    'assets/stars (1).jpg',
    'assets/stars (1).jpg',
    'assets/stars (1).jpg',
    'assets/stars (1).jpg',
    'assets/stars (1).jpg',
    'assets/stars (1).jpg',
])
starTexture.colorSpace=THREE.SRGBColorSpace;

// create renderer
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({canvas,antialias:true});

renderer.setSize(window.innerWidth,window.innerHeight);


//create Scene
const scene = new THREE.Scene();

//create Camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

//orbital controls
const orbit = new OrbitControls(camera,renderer.domElement);
camera.position.set(-90,140,140);
orbit.update();

//directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);


//Ambient lighting
const ambientLight = new THREE.AmbientLight(0x333333,5);
scene.add(ambientLight);

scene.background = starTexture;


// create sun
const sunGeo = new THREE.SphereGeometry(20,30,30);
const sunTexture =  textureLoader.load('assets/sun.jpg');
sunTexture.colorSpace = THREE.SRGBColorSpace;
const sunMat = new THREE.MeshBasicMaterial({
    map: sunTexture,
});
const sun = new THREE.Mesh(sunGeo,sunMat);
sun.position.set(0,0,0);
scene.add(sun);

//create pointLight
const pointLight = new THREE.PointLight(0xffffff,10000,300);
scene.add(pointLight);



//function to create planets
function createPlanet(size, texturepath, position, ring) {
    const texture = textureLoader.load(texturepath);
    texture.colorSpace = THREE.SRGBColorSpace;

    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if (ring) {
      const ringGeo = new THREE.RingGeometry(
        ring.innerRadius,
        ring.outerRadius,
        32
      );
      const ringMat = new THREE.MeshBasicMaterial({
        map: ring.texture,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      obj.add(ringMesh);
      ringMesh.position.x = position;
      ringMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(obj);
    mesh.position.x = position;
   
    return { mesh, obj };
};

//mercury
const mercury = createPlanet(3.2,'assets/mercury.jpg',28);
//venus
const venus = createPlanet(5.8,'assets/venus.jpg',44);
//earth
const earth = createPlanet(6,'assets/earth.jpg',62);
// mars
const mars = createPlanet(4,'assets/mars.jpg',78);
//jupiter
const jupiter = createPlanet(12,'assets/jupiter.jpg',100);
//saturn
const saturn = createPlanet(10,'assets/saturn.jpg',138,{
    innerRadius:10,
    outerRadius:20,
    texture:textureLoader.load('assets/saturn ring.png'),
    position:0
});
//uranus
const uranus = createPlanet(7,'assets/uranus.jpg',176,{
    innerRadius:7,
    outerRadius:12,
    texture:textureLoader.load('assets/uranus ring.png'),
    position:0
});
//neptune
const neptune = createPlanet(7,'assets/neptune.jpg',200);
//pluto
const pluto = createPlanet(2.8,'assets/pluto.jpg',216);



//animation loop
function animate() {
    //Self-rotation
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.032);
    pluto.mesh.rotateY(0.008);

    //Around-sun-rotation
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);
    renderer.render(scene, camera);
};
renderer.setAnimationLoop(animate);

//resize window
window.addEventListener('resize',function(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});
