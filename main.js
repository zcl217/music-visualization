//var THREE = require('three');

/*
window.onload = function() {

	var file = $("#audioFile")[0];
	
	//audio add active?
	//var audio = $("#audio");
	
	
	file.onchange = displayName(file);
	
	$("#button").click(play(file));
};
*/

//sample: https://codepen.io/prakhar625/pen/zddKRj?editors=1010

var animationId;

$(document).ready(function() {
	
	//audio add active?
	//var audio = $("#audio");
	
	
	//file.onchange = displayName(file);
	
	let audio = $("#audio")[0];
	
	audio.style.width = window.innerWidth+"px";
	
	var ctx = new AudioContext();
	//var audio = document.getElementById('myAudio');
	var audioSrc = ctx.createMediaElementSource(audio);
	var analyser = ctx.createAnalyser();
	// we have to connect the MediaElementSource with the analyser 
	audioSrc.connect(analyser);
	audioSrc.connect(ctx.destination);
	// we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)

	
	//if we don't use an arrow function it calls play right away
	$("#start").click( () => play(audio, analyser));
	$("#change").click(stop);
});

function displayName(file){
	if (file) $("#uploadedFile").text(file.name);
}

function stop(){
	cancelAnimationFrame(animationId);
	$("#audio").attr("src", "");
	
	$("#visuals").css({'display': 'none'});
	$("#overlay").css({'display': 'block'});
	
}

function play(audio, analyser){
	$("#overlay").css({'display': 'none'});
	$("#visuals").css({'display': 'block'});
	console.log($("#overlay")[0]);
	console.log("test");
	let selectedOption = $("#samples").val();
	let file = $("#audioFile")[0];
	let files = file.files;
	
	console.log(selectedOption);
	console.log(file);
	console.log(file.files);
	
	if (file && files.length > 0){
		
		//fileLabel.classList.add('normal');
	   // audio.classList.add('active');
		$("#audio").attr("src", URL.createObjectURL(files[0]));
		
	}else if (selectedOption){
		
		$("#audio").attr("src", "audio/" +selectedOption+".mp3");
		console.log("changed source");
	}else{
		//display error
		console.log("error, returning");
		stop();
		return;
	}
	
	
	audio.load();
	//audio.play();
	
	// frequencyBinCount tells you how many values you'll receive from the analyser
	var frequencyData = new Uint8Array(analyser.frequencyBinCount);

	/*
	// loop
	function renderFrame() {
	 requestAnimationFrame(renderFrame);
	 // update data in frequencyData
	 analyser.getByteFrequencyData(frequencyData);
	 // render frame based on values in frequencyData
	 // console.log(frequencyData)
	}
	//audio.start();
	renderFrame();
	*/
	
	let scene = new THREE.Scene();
	
	let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1500);
	camera.position.z = 15;
	camera.position.x = 5;
	camera.position.y = 5;
	var controls = new THREE.OrbitControls( camera );
	
	let renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setClearColor("#000000");
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	
	console.log($("#sceneDisplay").children[0]);
	//we do this to remove the previous canvas (if we changed songs)
	$("#sceneDisplay")[0].children[0].replaceWith(renderer.domElement);
	var pointLight = new THREE.PointLight( 0xffffff,1 );
	pointLight.position.set( 0, 0, 30 );

	scene.add( pointLight );

	/*
	let cubeList = [];
	let x = 0, y = 0, z = 0;
	let cube;
	for (let a = 0; a < 1000; a++){
		let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
		let material = new THREE.MeshNormalMaterial( );
		cube = new THREE.Mesh(geometry, material);

		cube.position.x = x;
		
		scene.add(cube);
		cubeList.push(cube);
		
		x+= 5;
		if (x == 50){
			y+= 5;
			x = 0;
		}else if (y == 50){
			z+= 5;
			y = 0;
			x = 0;
		}
		
		cube.position.y = y;
		cube.position.z = z;
	}
	*/
	
	let points = [];
  for (let a = 0; a <= 1024; a++){
	 
	let x = -1 + Math.random() * 2;
	let y = -1 + Math.random() * 2;
	let z = -1 + Math.random() * 2;
	let d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
	x *= d;
	y *= d;
	z *= d;
	
	x *= 50;
	y *= 50;
	z *= 50;
	let obj = {x: x, y: y, z: z};
	points[a] = obj;
  }
	console.log(points[0].x);
	

  //inner sphere
  for (let a = 0; a < 1024; a++){
	  
	  let {x, y, z} = points[a];
	  var parent = new THREE.Object3D();
		scene.add( parent );

		var stick = new THREE.Object3D();
		var point = new THREE.Vector3( x, y, z );
		stick.lookAt( point );
		parent.add( stick );

		var geometry = new THREE.CubeGeometry( 3, 3, 3, 1, 1, 1 );
		let material = new THREE.MeshNormalMaterial({
		//color: 'skyblue'
    });
		var mesh = new THREE.Mesh( geometry, material );
		let r = Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2));
		mesh.position.set( 0, 0, r );
		stick.add( mesh );
  }
  
  //outer sphere
  for (let a = 0; a < 1024; a++){
	  
	  let {x, y, z} = points[a];
	  x *= 10;
	  y *= 10;
	  z *= 10;
	  var parent = new THREE.Object3D();
		scene.add( parent );

		var stick = new THREE.Object3D();
		var point = new THREE.Vector3( x, y, z );
		stick.lookAt( point );
		parent.add( stick );

		var geometry = new THREE.CubeGeometry( 2, 2, 2, 2, 2, 2 );
		let material = new THREE.MeshNormalMaterial({
		//color: 'skyblue'
    });
	
		var mesh = new THREE.Mesh( geometry, material );
		let r = Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2));
		mesh.position.set( 0, 0, r );
		stick.add( mesh );
  }
  
  
  

  
	console.log(scene.children.length);
	console.log(scene.children);
	console.log(scene.children[0]);
	console.log(scene.children[5].children[0]);
	
	console.log(typeof(scene.children[5]));
	
	let angle = 0;
	let radius = 0.01;
	
	
	var render = function () {
	  animationId = requestAnimationFrame( render );
	  analyser.getByteFrequencyData(frequencyData);
	  controls.update();
	  
		let frequencyPointer = 0;
		for (let a = 2; a < scene.children.length; a++){
			
			let obj = scene.children[a];
			
			if (a < 1027){
				if (obj instanceof THREE.Object3D){
					
						
						let objCube = obj.children[0].children[0];
						
						let val = 0.5 + frequencyData[frequencyPointer]/150;
						objCube.scale.set(val/2, val/2, val/2);
						obj.scale.set(val, val, val);
						
				}
			}else{
				let objCube = obj.children[0].children[0];
						
						let val = 0.5 + frequencyData[frequencyPointer]/10;
						objCube.scale.set(val, val, val);
			}
			
			frequencyPointer++;
			if (frequencyPointer == 1024) frequencyPointer = 0;
			
			/*
			camera.position.x = radius * Math.cos( angle );  
camera.position.z = radius * Math.sin( angle );
angle += 0.000001;
			*/
			
		}
		
	
		// Render the scene
	  renderer.render(scene, camera);
	  
	};
	render();
	
	
}