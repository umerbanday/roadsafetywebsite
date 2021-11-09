import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
import { MeshLine ,MeshLineMaterial} from '../node_modules/three.meshline/src/THREE.MeshLine.js';

function main() {

  const gltfloader = new GLTFLoader();
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setClearColor(0xffffff, 0);
  
  var car;
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  //const controls = new OrbitControls( camera, renderer.domElement );
  camera.position.z =0.5;
  camera.position.y = 2.2;
  camera.lookAt(new THREE.Vector3(0,2.2,0))
  //controls.update();

 
  const scene = new THREE.Scene();
  var cubes;

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
  gltfloader.load('../static/carbody1.gltf',(gltf)=>{
    car=gltf.scene
    cubes = [
        makeInstance(gltf.scene, 0x44aa88, 0, -50),
        makeInstance(gltf.scene, 0x8844aa, -5,-40),
        makeInstance(gltf.scene, 0x8844aa, 5,-20),
        makeInstance(gltf.scene, 0x8844aa, 7,-10),
      ];
    scene.add(car)
})


  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  //const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geo, color, x, z) {
    const temp=new THREE.Object3D();
    //const material = new THREE.MeshPhongMaterial({ color });
   
    
    temp.add(geo.clone());
    //const cube = new THREE.Mesh(geometry, material);
    
    temp.rotateY(3.14)
    temp.position.x = x;
    temp.position.z = z;
    scene.add(temp);

    return temp;
  }
  
  const points = [];
  points.push(  0, 0.01, -50 );
  points.push( 0, 0.01, 50 );

  
  const igeometry = new THREE.BufferGeometry().setFromPoints( points );

  const roadmaterial = new THREE.LineDashedMaterial( {
	color: 0xffffff,
	linewidth: 50,
	scale: 5,
	dashSize: 3,
	gapSize: 1,
} );

  const line = new THREE.Line( igeometry, roadmaterial );
  line.computeLineDistances();
  var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

  const mline = new MeshLine();
  mline.setPoints(points);
  const materialm = new MeshLineMaterial(
    {
		useMap: false,
		color: 0xffffff,
		opacity: 1,
		resolution: resolution,
		sizeAttenuation: false,
		lineWidth: 10,
	}
  );
  const meshl = new THREE.Mesh(mline, materialm);
  scene.add(meshl);


  const roadgeometry = new THREE.PlaneGeometry( 20,200 );
  const roadm = new THREE.MeshBasicMaterial( {color: 0x808080, side: THREE.DoubleSide} );
  
  const road = new THREE.Mesh( roadgeometry, roadm );
  road.rotateX(-3.14/2)
  scene.add(road);

 

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  

  var xSpeed = 0.5;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
   
   if(car){

    if (keyCode == 37) {
        car.position.x -= xSpeed;
        camera.position.x -= xSpeed;
    } else if (keyCode == 39) {
        car.position.x += xSpeed;
        camera.position.x += xSpeed;
    } else if (keyCode == 32) {
        car.position.set(0, 0, 0);
    }
   }
    
};
const amlight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( amlight );

  function render(time) {
    time *= 0.001; // convert time to seconds
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
   
   if(cubes){


    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const add = speed;
      cube.position.z=cube.position.z+add/10;
     
      if(cube.position.z>3){
          cube.position.z=-50;
      }
    
      
    })};
    //controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
