import * as THREE from 'three';
import { Block } from './block.js';
import { pressedKeys } from './keyboard.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer();

scene.background = new THREE.Color("rgb(92, 168, 222)")
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement)

const light = new THREE.AmbientLight(0x404040);
const timer = new THREE.Clock(true);

timer.start();
scene.add(light)
camera.position.y = 15;
camera.rotation.x = -.3

// Function to update the color over time
function updateColor() {
    const time = timer.getElapsedTime(); 

    // Convert time to a color oscillation value (e.g., sine wave between 0 and 1)
    const red = Math.floor((Math.sin(time) + 1) / 2 * 255); // Range from 0 to 255
    const green = Math.floor((Math.cos(time) + 1) / 2 * 255);
    const blue = Math.floor((Math.sin(time + Math.PI / 2) + 1) / 2 * 255); 

    // Convert RGB to hex format and update the color
    const color = (red << 16) | (green << 8) | blue;

    // Return color in the format { color: 0xRRGGBB }
    return color;
}

function createBlock(pos, maxX, maxZ, color = {color : updateColor()}){
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial(color);
    const cube = new THREE.Mesh(geometry, material);
    const block = new Block(pos, cube, maxX, maxZ);
    scene.add(cube);
    return block;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function createWorld(x, z, maxY, amountOfCubes){
    const allCubes = [];
    
    for(let i = 0; i < amountOfCubes; i ++){
        const posX = -getRandomInt(x);
        const posZ = -getRandomInt(z);
        const position = new THREE.Vector3(posX, maxY, posZ);
        const newBlock = createBlock(position, -x, -z)
        allCubes.push(newBlock);
    }

    return allCubes;
}

// UI
const groundSlider = document.getElementById('groundRange');
const groundOutput = document.getElementById('groundOutput');

const amountSlider = document.getElementById('amountRange'); 
const amountOutput = document.getElementById('amountOutput');

let pos;
let amountPerClick = 20;

amountSlider.value = amountPerClick;
amountOutput.innerHTML = amountPerClick;

function createScene(x, z, oldCubes = []){
    const maxX = x;
    const maxZ = z;
    pos = new THREE.Vector3(maxX, 20, maxZ)

    for (const oldCube of oldCubes){
        scene.remove(oldCube.cube);
    }

    const allCubes = createWorld(pos.x, pos.z, pos.y, amountPerClick);

    camera.position.x = -pos.x/2;
    camera.position.z = pos.z/1.5;
    groundSlider.value = maxX;
    groundOutput.innerHTML = maxX;

    return allCubes;
}

let allCubes = createScene(20, 20)


function animate() {
	renderer.render( scene, camera );
    for (const cube of allCubes){
        cube.move(allCubes)
    }

    if (pressedKeys[32]){
        const amount = amountPerClick;
        for (let i = 0; i < amount; i += 1){
            const _pos = new THREE.Vector3(
                -getRandomInt(pos.x),
                pos.y,
                -getRandomInt(pos.z)
            )
            allCubes.push(createBlock(_pos, -pos.x, -pos.z))
        }
    }
}


renderer.setAnimationLoop( animate );


groundSlider.oninput = function() {
    groundOutput.innerHTML = this.value;
    allCubes = createScene(this.value, this.value, allCubes)
};

amountSlider.oninput = function(){
    amountOutput.innerHTML = this.value;
    amountPerClick = this.value; 
};