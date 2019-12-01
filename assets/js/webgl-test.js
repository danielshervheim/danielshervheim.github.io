const ASPECT_RATIO = 1920.0/1080.0;

// ???
var sceneContainer = document.getElementById("sceneContainer");

// SCENE
var scene = new THREE.Scene();

// CAMERA
var camera = new THREE.PerspectiveCamera( 75, ASPECT_RATIO, 0.1, 1000 );

// RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( sceneContainer.offsetWidth, sceneContainer.offsetWidth / ASPECT_RATIO );
sceneContainer.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

window.onresize = function () {
	// Aspect ratio is constant, so no need to update the camera.
	renderer.setSize( sceneContainer.offsetWidth, sceneContainer.offsetWidth / ASPECT_RATIO);
}

var animate = function () {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();
