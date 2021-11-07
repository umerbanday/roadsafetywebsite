import * as THREE from "../node_modules/three/build/three.module.js";

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 50;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  camera.position.y = 1;

  const scene = new THREE.Scene();

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x, z) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    cube.position.z = z;
    cube.position.y = 0.5;

    return cube;
  }
  const roadgeometry = new THREE.PlaneGeometry( 5,100 );
  const roadmaterial = new THREE.LineDashedMaterial( {
	color: 0xffff00,
	linewidth: 1,
	scale: 1,
	dashSize: 3,
	gapSize: 1,
} );
  const road = new THREE.Mesh( roadgeometry, roadmaterial );
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

  const cubes = [
    makeInstance(geometry, 0x44aa88, 0, -50),
    makeInstance(geometry, 0x8844aa, -1,-40),
    makeInstance(geometry, 0xaa8844, -2,-30),
    makeInstance(geometry, 0x44aa88, 1, -20),
    makeInstance(geometry, 0x8844aa, -2,-10),
    makeInstance(geometry, 0xaa8844, 2,-3),
  ];

  function render(time) {
    time *= 0.001; // convert time to seconds
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const add = speed;
      cube.position.z=cube.position.z+add/10;
      if(cube.position.z>3){
          cube.position.z=-50;
      }
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
