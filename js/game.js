import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/RenderPass.js";
import { BloomPass } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/BloomPass.js";
import { FilmPass } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/FilmPass.js";
import { HorizontalBlurShader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/shaders/HorizontalBlurShader.js";
import { VerticalBlurShader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/shaders/VerticalBlurShader.js";
import { ShaderPass } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/ShaderPass.js";

//setup the loader
const manager = new THREE.LoadingManager();
manager.onLoad = init;
const models = {
  car: { url: "static/carmod.gltf", gltf: null },
};

const gltfLoader = new GLTFLoader(manager);

//load function
function load() {
  for (const model of Object.values(models)) {
    gltfLoader.load(model.url, (gltf) => {
      model.gltf = gltf;
    });
  }
}

//Declare global variables
const init_pos = [
  [0, -50],
  [-5, -40],
  [5, -20],
  [7, -10],
];

var canvas;
var renderer;

var camera;
const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 1000;

var scene;

var car;
var cubes;

var light;
const color = 0xffffff;
const intensity = 1;

var amlight;

var roadgeometry;
var road;
var roadm;
var cont = true;

var keyDown;
var keyMap = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};

var composer;
var vblur;
var hblur;

var bbox;
var bbox1;

//init function called after loading completes
function init() {
  console.log("modelloaded");

  canvas = document.querySelector("#c");
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setClearColor(0xffffff, 0);

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  scene = new THREE.Scene();

  light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  amlight = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(amlight);

  car = models.car.gltf.scene;
  bbox = new THREE.Box3();
  bbox1 = new THREE.Box3();

  cubes = [
    makeInstance(car, 0x44aa88, init_pos[0][0], init_pos[0][1]),
    makeInstance(car, 0x8844aa, init_pos[1][0], init_pos[1][1]),
    makeInstance(car, 0x8844aa, init_pos[2][0], init_pos[2][1]),
    makeInstance(car, 0x8844aa, init_pos[3][0], init_pos[3][1]),
  ];
  scene.add(car);

  roadgeometry = new THREE.PlaneGeometry(20, 200);
  roadm = new THREE.MeshBasicMaterial({
    color: 0x808080,
    side: THREE.DoubleSide,
  });

  road = new THREE.Mesh(roadgeometry, roadm);
  road.rotateX(-3.14 / 2);
  scene.add(road);

  document.addEventListener("keydown", onDocumentKey, false);
  document.addEventListener("keyup", onDocumentKey, false);

  //call the initial reset
  reset();
  const canv = renderer.domElement;

  composer = new EffectComposer(renderer);

  composer.addPass(new RenderPass(scene, camera));

  hblur = new ShaderPass(HorizontalBlurShader);
  console.log(hblur.uniforms + "" + canv.clientWidth);
  //hblur.uniforms.h=1/canv.clientWidth;

  //composer.addPass( hblur );

  vblur = new ShaderPass(VerticalBlurShader);
  // set this shader pass to render to screen so we can see the effects
  //Scomposer.addPass( vblur );

  //vblur.uniforms.v=1/canv.clientHeight;
  vblur.renderToScreen = true;

  /* const bloomPass = new BloomPass(
    1,    // strength
    25,   // kernel size
    4,    // sigma ?
    256,  // blur render target resolution
);
composer.addPass(bloomPass);

const filmPass = new FilmPass(
  0.35,   // noise intensity
  0.025,  // scanline intensity
  648,    // scanline count
  false,  // grayscale
);
filmPass.renderToScreen = true;
composer.addPass(filmPass); */

  if (resizeRendererToDisplaySize(renderer)) {
    const temp = renderer.domElement;
    camera.aspect = temp.clientWidth / temp.clientHeight;
    camera.updateProjectionMatrix();
  }

  //render initial frame
  renderer.render(scene, camera);
}

//function to reset the game
function reset() {
  camera.position.z = 1.2;
  camera.position.y = 3.1;
  camera.position.x = -0.5;
  camera.lookAt(new THREE.Vector3(-0.5, 3.1, 0));

  car.position.z = 0.0;
  car.position.y = 0.0;
  car.position.x = 0.0;

  if (cubes) {
    cubes.forEach((cube, ndx) => {
      cube.position.x = init_pos[ndx][0];
      cube.position.z = init_pos[ndx][1];
    });
  }
}

//function to register key events
function onDocumentKey(event) {
  console.log(event.type);
  keyDown = {};
  var keyCode = event.which;
  if (event.type == "keydown") {
    keyDown[keyMap[keyCode]] = true;
  } else if (event.type == "keyup") {
    keyDown[keyMap[keyCode]] = false;
  }

  if (car) {
    if (keyCode == 37) {
    } else if (keyCode == 39) {
    } else if (keyCode == 32) {
      car.position.set(0, 0, 0);
    }
  }
}

//function to make instances of the geometry
function makeInstance(geo, color, x, z) {
  const temp = new THREE.Object3D();
  temp.add(geo.clone());
  temp.rotateY(3.14);
  temp.position.x = x;
  temp.position.z = z;
  scene.add(temp);

  return temp;
}

//resize the renderer to display size
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

function checkcollision() {
  bbox.setFromObject(car);
  if (cubes) {
    cubes.forEach((cube, ndx) => {
      bbox1.setFromObject(cube);
      if (bbox.intersectsBox(bbox1)) {
        console.log("Collision......");
        cont = false;
      }
    });
  }
}

//Game loop function
function render(time) {
  let xSpeed = 0.1;
  time *= 0.001; // convert time to seconds
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  //Advacnce the cars
  if (cubes) {
    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const add = speed;
      cube.position.z = cube.position.z + add / 10;

      //cube.children[0].children[1].rotation.x+=0.1
      //cube.children[0].children[2].rotation.x+=0.1
      //cube.children[0].children[3].rotation.x+=0.1
      //cube.children[0].children[4].rotation.x+=0.1
      //console.log(cube)
      if (cube.position.z > 3) {
        cube.position.z = -50;
      }
    });
  }

  //Check collision
  checkcollision();

  //controls
  if (keyDown) {
    if (keyDown["up"]) {
      composer.addPass(hblur);
      composer.addPass(vblur);
    } else if (keyDown["down"]) {
      // down code

      composer.removePass(hblur);
      composer.removePass(vblur);
    } else if (keyDown["left"]) {
      car.position.x -= xSpeed * car.children[1].rotation.z;
      camera.position.x -= xSpeed * car.children[1].rotation.z;
      console.log(bbox);
      if (car.children[1].rotation.z < 3.14) {
        car.children[1].rotation.z += 0.1;
      }
      // car.rotation.y= car.children[1].rotation.z/4;
      console.log(keyDown);
    } else if (keyDown["right"]) {
      car.position.x -= xSpeed * car.children[1].rotation.z;
      camera.position.x -= xSpeed * car.children[1].rotation.z;
      if (car.children[1].rotation.z > -3.14) {
        car.children[1].rotation.z -= 0.1;
      }
      //car.rotation.y= car.children[1].rotation.z/4;
      console.log(keyDown);
    } else {
      car.children[1].rotation.z /= 1.1;
      //car.rotation.y= car.children[1].rotation.z/4;
    }
  }

  renderer.render(scene, camera);
  composer.render();

  if (cont == true) {
    requestAnimationFrame(render);
  }
}

//Start the game loop
function main() {
  requestAnimationFrame(render);
}

//Html buttons and controls
const gamebtn = document.getElementById("playbtn");
const resetbtn = document.getElementById("reset");
const gamecanvas = document.getElementById("c");
const playbtn = document.getElementById("play");
const stopbtn = document.getElementById("stop");
const continuebtn = document.getElementById("continue");

playbtn.addEventListener("click", () => {
  console.log("reset clicked");
  main();
});

stopbtn.addEventListener("click", () => {
  console.log("stop clicked");
  cont = false;
});

continuebtn.addEventListener("click", () => {
  console.log("continue clicked");
  cont = true;
  main();
});

resetbtn.addEventListener("click", () => {
  console.log("reset clicked");
  reset();
  main();
});

gamebtn.addEventListener("click", () => {
  console.log("game clicked");
  gamecanvas.style.display = "block";
  window.scrollTo(0, 3000);
  load();
});
