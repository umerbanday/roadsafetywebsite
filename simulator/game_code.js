import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";
import { SVGLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/SVGLoader.js";


//setup the loader
const manager = new THREE.LoadingManager();
manager.onLoad = init;
const models = {
  car: { url: "../static/carmod.gltf", gltf: null },
  road: { url: "../static/roadnew.gltf", gltf: null },
};

var mode="drunk";
var speed_step=0.5;

const gltfLoader = new GLTFLoader(manager);
//SVG Loader
const loader = new SVGLoader(manager);

//load function
function load() {

   
  for (const model of Object.values(models)) {
    gltfLoader.load(model.url, (gltf) => {
      model.gltf = gltf;
    });

    loader.load(
      // resource URL
      "../static/steering.svg",
      // called when the resource is loaded
      function (data) {
        const paths = data.paths;
        steering = new THREE.Object3D();

        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];

          const material = new THREE.MeshBasicMaterial({
            color: path.color,
            side: THREE.DoubleSide,
            depthWrite: false,
          });

          const shapes = SVGLoader.createShapes(path);

          for (let j = 0; j < shapes.length; j++) {
            const shape = shapes[j];
            const geometry = new THREE.ShapeGeometry(shape);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.renderOrder = 999;
            steering.add(mesh);
          }
        }

        //calculate bounds of object
        var box = new THREE.Box3().setFromObject(steering);
        var center = new THREE.Vector3();
        box.getCenter(center);

        //Center the object geometry
        steering.children.forEach((item) => {
          item.geometry.translate(-center.x, -center.y, 0);
        });

        steering.scale.set(0.0027, 0.0027, 0.0027);
        steering.rotation.x = 3.14;
        steering.rotation.y = 3.14;

        steering.position.z += 0.01;
        steering.position.y += 2.5;
        steering.position.x -= 1.33;

        //steering.renderOrder = 999;

        //steering.onBeforeRender = function( renderer ) { renderer.clearDepth(); };
      },
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log(error);
      }
    );
    
    loader.load(
      // resource URL
      "../static/cardash.svg",
      // called when the resource is loaded
      function (data) {
        const paths = data.paths;
        dash = new THREE.Object3D();

        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];

          const material = new THREE.MeshBasicMaterial({
            color: path.color,
            side: THREE.DoubleSide,
            depthWrite: false,
          });

          const shapes = SVGLoader.createShapes(path);

          for (let j = 0; j < shapes.length; j++) {
            const shape = shapes[j];
            const geometry = new THREE.ShapeGeometry(shape);
            const mesh = new THREE.Mesh(geometry, material);
            dash.add(mesh);
          }
        }

        //calculate bounds of object
        var box = new THREE.Box3().setFromObject(dash);
        var center = new THREE.Vector3();
        box.getCenter(center);

        //Center the object geometry
        dash.children.forEach((item) => {
          item.geometry.translate(-center.x, -center.y, 0);
        });

        dash.scale.set(0.0027, 0.0027, 1);
        dash.rotation.z = 3.14;
        dash.rotation.y = 3.14;


        dash.position.z = 0.0;
        dash.position.y = 2.8;
        dash.position.x = -0.5;
        //
      },
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log(error);
      }
    );

    
  }
}

//Declare global variables
const init_pos = [
  [-5, -340],
  [5, -300],
  [5, -250],
  [-5, -200],
];

var canvas;
var renderer;

var camera;
var fov = 130;
const aspect = 2;
const near = 0.1;
const far = 1000;

var scene = new THREE.Scene();
var top = new THREE.Scene();

var car;
var dash;
var steering;
var cubes;
var roads = [];

var light;
const color = 0xffffff;
const intensity = 1;

var amlight;

var roadgeometry;
var road;
var roadbound;
var cont = true;

var keyDown = {};
var keyMap = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};

var composer;
var composer1;
var vblur;
var hblur;

var intervalID;

var bbox;
var bbox1;
var controls;
var last = 20;

var sound;
var crash;
var brake;
var offsety=0;

var accel = 0;
var step = 0;

var resetplay = true;
//init function called after loading completes
function init() {
  console.log("modelloaded");
  document.getElementById("loading_img").style.display="none"
  document.getElementById("play").style.display="block"

  canvas = document.querySelector("#c");
  
 
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setClearColor(0xffffff, 0);
  renderer.autoClear = false;

  const temp = renderer.domElement;
  let aspect= temp.clientHeight/temp.clientWidth
  console.log(aspect)
  if(aspect<=0.35){
    fov=35
  }else if(aspect>0.35&&aspect<=0.4){
    fov =55
  }else if(aspect>0.4&&aspect<=0.55){
    fov =70
  }
  else if(aspect>0.55&&aspect<=0.65){
    fov =80
  }
  else if(aspect>0.65&&aspect<=0.75){
    fov =90
  }
  else if(aspect>0.75&&aspect<=1) {
    fov =100
  }else if(aspect>1&&aspect<=1.3) {
    fov =115
  }if(aspect>1.3) {
    fov =130;
    offsety=0.7;
  }



  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  // controls = new OrbitControls( camera, renderer.domElement );
  light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  amlight = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(amlight);

  car = models.car.gltf.scene;
  road = models.road.gltf.scene;
  console.log(car);

  bbox = new THREE.Box3();
  bbox1 = new THREE.Box3();

  // load a SVG resource
 
  top.add(dash);
  top.add(steering);

  //scene.add(car);
  cubes = [
    makeInstance(car, 0x44aa88, init_pos[0][0], init_pos[0][1], false),
    makeInstance(car, 0x8844aa, init_pos[1][0], init_pos[1][1], true),
    makeInstance(car, 0xd00ba6, init_pos[2][0], init_pos[2][1], true),
    makeInstance(car, 0x343f03, init_pos[3][0], init_pos[3][1], false),
  ];
  bbox1.setFromObject(road);
  roadbound = bbox1.max.z;

  for (let i = 0; i <= last; i++) {
    roads.push(makeInstance(road, null, 0, -roadbound *2* i));
  }

  console.log(roads);

  //scene.add(road);

  document.addEventListener("keydown", onDocumentKey, false);
  document.addEventListener("keyup", onDocumentKey, false);

  //call the initial reset
  reset();

  gamecanvas.classList.add("blur")

  /*const canv = renderer.domElement;

  composer = new EffectComposer(renderer);

  composer.addPass(new RenderPass(scene, camera));

  composer1 = new EffectComposer(renderer);

  composer1.addPass(new RenderPass(top, camera));


  hblur = new ShaderPass(HorizontalBlurShader);
  console.log(hblur.uniforms + "" + canv.clientWidth);
  //hblur.uniforms.h=1/canv.clientWidth;

  //composer.addPass( hblur );

  vblur = new ShaderPass(VerticalBlurShader);
  // set this shader pass to render to screen so we can see the effects
  //Scomposer.addPass( vblur );

  //vblur.uniforms.v=1/canv.clientHeight;
  vblur.renderToScreen = true;

   const bloomPass = new BloomPass(
    10,    // strength
    25,   // kernel size
    4,    // sigma ?
    256,  // blur render target resolution
);
bloomPass.renderToScreen = true;
//composer1.addPass(vblur);

/*
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

  //Sounds

  const listener = new THREE.AudioListener();
  camera.add(listener);

  // create a global audio source
  sound = new THREE.Audio(listener);
  crash = new THREE.Audio(listener);
  brake = new THREE.Audio(listener);

  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();

  audioLoader.load("../sounds/carloop.ogg", function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
  });

  audioLoader.load("../sounds/crash.ogg", function (buffer) {
    crash.setBuffer(buffer);
    crash.setLoop(false);
    crash.setVolume(0.8);
  });

  audioLoader.load("../sounds/brake.ogg", function (buffer) {
    brake.setBuffer(buffer);
    brake.setLoop(false);
    brake.setVolume(0.5);
  });
  sound.onEnded = () => {
    console.log("Sound ended");
  };

  //renderer.clear();
 // composer.render();


  //render initial frame
  renderer.clear();
  renderer.render(scene, camera);
  

  renderer.clearDepth();
  //composer1.render();
  renderer.render(top, camera);
}

//function to reset the game
function reset() {
  camera.position.z = 1.2;
  camera.position.y = 3.1+offsety;
  camera.position.x = -0.5;
  camera.lookAt(new THREE.Vector3(-0.5, 3.1+offsety, 0));

  //reset car position
  dash.position.x = -0.5;
  steering.position.x = -1.33;

  //reset steering whell
  steering.rotation.z = 0;

  //reset opposite cars
  if (cubes) {
    cubes.forEach((cube, ndx) => {
      // cube.material.color.set("blue");
      cube.position.x = init_pos[ndx][0];
      cube.position.z = init_pos[ndx][1];
    });
  }
  crashed.style.display="none";
  if(gamecanvas.classList.contains("blur")){
    gamecanvas.classList.remove("blur")
  }
  

}

//function to register key events
function onDocumentKey(event) {
  console.log(event.type);

  var keyCode = event.which;
  if (event.type == "keydown") {
    keyDown[keyMap[keyCode]] = true;
  } else if (event.type == "keyup") {
    keyDown[keyMap[keyCode]] = false;
  }
}

//function to make instances of the geometry
function makeInstance(geo, color, x, z, rev) {
  var temp;
  //This does not create a deep clone i.e materials are not cloned by value but by ref
  temp = geo.clone();

  //If color argument is passed, i.e we need diff colors for diff instances, we need to clone the materials too.
  //First we check if color is passed
  if (color != null) {
    //  clone materials too
    temp.traverse(function (object) {
      if (object.isMesh) {
        object.material = object.material.clone();
      }
    });
    //set the color of body
    temp.children[0].children[0].material.color.setHex(color);
    if (rev) {
      temp.rotation.y = 3.14;
    }

    temp.position.x = x;
  }

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
  let collided=false;
  //set bounding box from the dashboard
  bbox.setFromObject(dash);
  //check collisions with other cars
  if (cubes) {
    //traverse through every car and as soon as collison nis detected, stop traversing(return false and set collided =true)
    cubes.every((cube, ndx) => {
      bbox1.setFromObject(cube);
      if (bbox.intersectsBox(bbox1)) {
       
        collided=true;
        return false
      }
      else{
        return true
      }
      
    });
  }
  //check collisions with walls
  if(bbox.min.x<-15||bbox.max.x>15)
  {
    collided=true;  

  }
  if(collided==true){
    sound.stop();
    crash.play();
    cont = false;
    control.style.display="none"

    crashed.style.display="flex";
    clearInterval(intervalID);
    bl=0;
    gamecanvas.style.removeProperty('filter');
    gamecanvas.classList.add("blur")
    console.log(gamecanvas)
    speed_step=0.5;
  }
}

//Game loop function
function render(time) {
  let xSpeed = 0.1;

  //controls

  if (keyDown["up"]) {
    //composer.addPass(hblur);
    //composer.addPass(vblur);
  } else if (keyDown["down"]) {
    if (step >= 0) {
      step -= 0.01;
    } else {
      step = 0;
    }
    if (resetplay) {
      brake.play();
    }
    resetplay = false;

    //composer.removePass(hblur);
    //composer.removePass(vblur);
  } else if (keyDown["left"]) {
    //Move car
    dash.position.x -= xSpeed * steering.rotation.z;
    //Rotate steering
    camera.position.x -= xSpeed * steering.rotation.z;

    steering.position.x -= xSpeed * steering.rotation.z;
    //Steering rotation limit
    if (steering.rotation.z < 3.14) {
      steering.rotation.z += 0.1;
    }
  } else if (keyDown["right"]) {
    dash.position.x -= xSpeed * steering.rotation.z;
    camera.position.x -= xSpeed * steering.rotation.z;
    steering.position.x -= xSpeed * steering.rotation.z;
    if (steering.rotation.z > -3.14) {
      steering.rotation.z -= 0.1;
    }
  } else {
    //If no key pressed,bring steering to normal position
    steering.rotation.z /= 1.1;
    //console.log("im here")
    if (step < speed_step) {
      step += 0.01;
    }
    resetplay = true;
  }

  //sound.setVolume(step * 2);
  //console.log(step);

  time *= 0.001; // convert time to seconds
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  //Advacnce the cars
  if (cubes) {
    cubes.forEach((cube, ndx) => {
      //const speed = 1 + ndx * 0.1;
      const add = 2;

      if (cube.rotation.y == 3.14) {
        cube.position.z = cube.position.z + 2 * step + 1;
      } else {
        cube.position.z = cube.position.z + 2 * step - 0.2;
      }

      if (cube.position.z > 3) {
        cube.position.z = -340;
      }
    });
  }

  if (roads) {
    // advance all road blocks

    roads.forEach((road, ndx) => {
      road.position.z = road.position.z + 2 * step;
    });

    // check if any block crossed limits
    roads.forEach((road, ndx) => {
      if (road.position.z >= roadbound * 2) {
        //console.log("Old position is "+road.position.z)

        road.position.z = roads[last].position.z - roadbound * 2;
        //console.log("New position is "+road.position.z)
        last = ndx;
      }
    });
  }

  //Check collision
  checkcollision();

  //simulatemode();
  // controls.update();

  //composer1.render();
  renderer.clear();
  //composer.render();
  renderer.render(scene, camera);
  
  renderer.clearDepth();
  
  renderer.render(top, camera);
  

  if (cont == true) {
    requestAnimationFrame(render);
  }
}

var bl=0;
function myCallback(a, b)
{
  bl+=1;
 // Your code here
 // Parameters are purely optional.
 console.log("timer calling")
 //composer.addPass(hblur);
 //composer.addPass(vblur);
 gamecanvas.style.filter=`blur(${bl}px)`
 speed_step+=0.1;
}


//Start the game loop
function main() {

  //clearInterval(intervalID);
  
  intervalID = setInterval(myCallback, 2000, 'Parameter 1', 'Parameter 2');

  requestAnimationFrame(render);
}

//Html buttons and controls
//const gamebtn = document.getElementById("playbtn");
const resetbtn = document.getElementById("reset");
const gamecanvas = document.getElementById("c");
const playbtn = document.getElementById("play");
//const stopbtn = document.getElementById("stop");
//const continuebtn = document.getElementById("continue");
const crashed=document.getElementById("crashed");
const splash=document.getElementById("splash");
const enterbutton=document.getElementById("enterbutton");
const rightbutton=document.getElementById("right")
const leftbutton=document.getElementById("left")
const control=document.getElementById("control")
var ping = new Audio("../sounds/enterbutton.ogg");
var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x_width = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y_height = win.innerHeight|| docElem.clientHeight|| body.clientHeight;

   

playbtn.addEventListener("click", () => {
  //console.log("reset clicked");
  ping.play();
  sound.play();
  if(x_width<1000){
    control.style.display="flex"
  }
 
  gamecanvas.classList.remove("blur");
  main();
  splash.style.display="none"
});
playbtn.addEventListener("mouseenter", () => {
  ping.play();
  console.log("mouse hoverrr")
});
resetbtn.addEventListener("mouseenter", () => {
  ping.play();
  console.log("mouse hoverrr")
});

var rightdown=false;
var leftdown=false;

function absorbEvent_(event) {
      var e = event || window.event;
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      e.cancelBubble = true;
      e.returnValue = false;
      return false;
    }

leftbutton.ontouchstart=absorbEvent_;
leftbutton.ontouchmove=absorbEvent_;
leftbutton.ontouchend=absorbEvent_;
leftbutton.ontouchcancel=absorbEvent_;



rightbutton.ontouchstart=(e)=>{
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  if(leftdown==false){
    rightdown=true;
   
    keyDown["right"] = true;
    console.log("rightdown")
  }
}
rightbutton.ontouchend=(e)=>{
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  if(leftdown==false){
    rightdown=false;
    keyDown["right"] = false;
  }
}
leftbutton.ontouchstart=(e)=>{
  e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
  if(rightdown==false){
    leftdown=true;
   
    keyDown["left"] = true;
  }
}
leftbutton.ontouchend=(e)=>{
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  if(rightdown==false){
    leftdown=false;
    keyDown["left"] = false;
  }
}







/*stopbtn.addEventListener("click", () => {
  console.log("stop clicked");
  sound.pause();
  cont = false;
});

continuebtn.addEventListener("click", () => {
  console.log("continue clicked");
  cont = true;
  sound.play();
  main();
});*/

resetbtn.addEventListener("click", () => {
 // console.log("reset clicked");
 ping.play();
  reset();
  if(x_width<1000){
    control.style.display="flex"
  }
  cont = true;
  sound.stop();
  sound.play();
  gamecanvas.classList.remove("blur");
  main();
 
});


/*gamebtn.addEventListener("click", () => {
  console.log("game clicked");
  gamecanvas.style.display = "block";
  window.scrollTo(0, 3000);
  load();
});*/

load();