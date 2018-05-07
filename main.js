
var animationId;
let renderer, camera, controls, light;
let rotation = false;
let topColor = "";
let bottomColor = "";

$(document).ready(function() {
	
	//audio add active?
	//var audio = $("#audio");
	
	
	//file.onchange = displayName(file);
	
	let audio = $("#audio")[0];
	
	var ctx = new AudioContext();
	//var audio = document.getElementById('myAudio');
	var audioSrc = ctx.createMediaElementSource(audio);
	var analyser = ctx.createAnalyser();
	// we have to connect the MediaElementSource with the analyser 
	audioSrc.connect(analyser);
	audioSrc.connect(ctx.destination);
	// we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)

	
	ctx.resume();
	//if we don't use an arrow function it calls play right away
	$("#start").click( () => play(audio, analyser, ctx));
	$("#optionsToggle").click(toggleOptions);
	$("#change").click(stop);
	$("#rotation").click(toggleRotation);
	$("#color").click(toggleColors);
	$("#colorSelect").click(changeColors);
	$("#closeColors").click(closeColors);
	$("#toggleAudio").click(toggleAudio);
	
	window.addEventListener('resize', onWindowResize, false);
	
	//source: https://dzone.com/articles/creating-your-own-html5
	
	//need to do this twice; one for the top color picker and one for the bot
	let preview1 = true; // can preview

	// create canvas and context objects
	let canvas1 = document.getElementById('pickerTop');
	let ctx1 = canvas1.getContext('2d');

	// drawing active image
	let image1 = new Image();
	image1.onload = function () {
		ctx1.drawImage(image1, 0, 0, image1.width, image1.height); // draw the image on the canvas
	}

	let imageSrc = "images/colorwheel.png";
	image1.src = imageSrc;

	$('#pickerTop').mousemove(function(e) { // mouse move handler
		if (preview1) {
			// get coordinates of current position
			let canvasOffset = $(canvas1).offset();
			let canvasX = Math.floor(e.pageX - canvasOffset.left);
			let canvasY = Math.floor(e.pageY - canvasOffset.top);

			// get current pixel
			let imageData = ctx1.getImageData(canvasX, canvasY, 1, 1);
			let pixel = imageData.data;

			// update preview color
			let pixelColor = "rgb("+pixel[0]+", "+pixel[1]+", "+pixel[2]+")";
			$('#previewTop').css('backgroundColor', pixelColor);

			// update controls
			$('#rVal1').val(pixel[0]);
			$('#gVal1').val(pixel[1]);
			$('#bVal1').val(pixel[2]);
			$('#rgbVal1').val(pixel[0]+','+pixel[1]+','+pixel[2]);

			var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
			$('#hexVal1').val('#' + ('0000' + dColor.toString(16)).substr(-6));
			topColor = ('0000' + dColor.toString(16)).substr(-6);
		}
	});
	$('#pickerTop').click((e) =>{ // click event handler to lock in color
		preview1 = !preview1;
		$("#colorpickerTop").css({'display': 'none'});
	});
	$('#previewTop').click((e) =>{ // preview click to make canvas appear
		$("#colorpickerBot").css({'display': 'none'});
		let curDisplay = $("#colorpickerTop").css("display");
		if (curDisplay === "block"){
			$("#colorpickerTop").css({'display': 'none'});
			preview1 = false;
		}else if (curDisplay === "none"){
			$("#colorpickerTop").css({'display': 'block'});	
			preview1 = true;			
		}
		});
		
	let preview2 = true; // can preview

	// create canvas and context objects
	let canvas2 = document.getElementById('pickerBot');
	let ctx2 = canvas2.getContext('2d');

	// drawing active image
	let image2 = new Image();
	image2.onload = function () {
		ctx2.drawImage(image2, 0, 0, image2.width, image2.height); // draw the image on the canvas
	}

	let imageSrc2 = "images/colorwheel.png";
	image2.src = imageSrc2;

	$('#pickerBot').mousemove(function(e) { // mouse move handler
		if (preview2) {
			// get coordinates of current position
			let canvasOffset = $(canvas2).offset();
			let canvasX = Math.floor(e.pageX - canvasOffset.left);
			let canvasY = Math.floor(e.pageY - canvasOffset.top);

			// get current pixel
			let imageData = ctx2.getImageData(canvasX, canvasY, 1, 1);
			let pixel = imageData.data;

			// update preview color
			let pixelColor = "rgb("+pixel[0]+", "+pixel[1]+", "+pixel[2]+")";
			$('#previewBot').css('backgroundColor', pixelColor);

			// update controls
			$('#rVal2').val(pixel[0]);
			$('#gVal2').val(pixel[1]);
			$('#bVal2').val(pixel[2]);
			$('#rgbVal2').val(pixel[0]+','+pixel[1]+','+pixel[2]);

			var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
			$('#hexVal2').val('#' + ('0000' + dColor.toString(16)).substr(-6));
			bottomColor = ('0000' + dColor.toString(16)).substr(-6);
		}
	});
	$('#pickerBot').click((e) =>{ // click event handler to lock in color
		preview2 = !preview2;
		$("#colorpickerBot").css({'display': 'none'});
	});
	$('#previewBot').click((e) =>{ // preview click to make canvas appear
		$("#colorpickerTop").css({'display': 'none'});
		let curDisplay = $("#colorpickerBot").css("display");
		if (curDisplay === "block"){
			$("#colorpickerBot").css({'display': 'none'});
			preview2 = false;
		}else if (curDisplay === "none"){
			$("#colorpickerBot").css({'display': 'block'});	
			preview2 = true;			
		}
	});
		
		
});

function displayName(file){
	if (file) $("#uploadedFile").text(file.name);
}

function stop(){
	cancelAnimationFrame(animationId);
	if (controls) controls.enabled = false;
	$("#audio").attr("src", "");
	
	$("#visuals").css({'display': 'none'});
	$("#overlay").css({'display': 'block'});
	
}

function toggleOptions(){
	let curDisplay = $("#optionButtons").css("display");
	if (curDisplay === "block"){
		$("#optionButtons").css({'display': 'none'});
		$("#optionsToggle").text("Show Options");
	}else if (curDisplay === "none"){
		$("#optionButtons").css({'display': 'block'});
		$("#optionsToggle").text("Hide Options");
	}
}

function toggleRotation(){
	rotation = !rotation;
}

function closeColors(){
	$("#colorSelection").css({'display': 'none'});
	topColor = "";
	bottomColor = "";
}

function toggleColors(){
	let curDisplay = $("#colorSelection").css("display");
	if (curDisplay === "block"){
		$("#colorSelection").css({'display': 'none'});
	}else if (curDisplay === "none"){
		$("#colorSelection").css({'display': 'block'});		
	}
}

function toggleAudio(){
	let curDisplay = $("#audio").css("display");
	if (curDisplay === "block"){
		$("#audio").css({'display': 'none'});
		$("#toggleAudio").text("Show Audio Player");
	}else if (curDisplay === "none"){
		$("#audio").css({'display': 'block'});	
		$("#toggleAudio").text("Hide Audio Player");		
	}
}

function changeColors(){
	
	if (!light) return;
	
	if (topColor === "") topColor = "000000";
	if (bottomColor === "") bottomColor = "ffffff";
	light.color.setHex("0x"+topColor);
	light.groundColor.setHex("0x"+bottomColor);
	
	$("#colorSelection").css({'display': 'none'});
}

function onWindowResize(){
	if (camera){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
	if (renderer) renderer.setSize( window.innerWidth, window.innerHeight );
}

function play(audio, analyser, ctx){
	$("#overlay").css({'display': 'none'});
	$("#visuals").css({'display': 'flex'});
	let selectedOption = $("#samples").val();
	let file = $("#audioFile")[0];
	let files = file.files;
	
	if (file && files.length > 0){
		
		//fileLabel.classList.add('normal');
	   // audio.classList.add('active');
		$("#audio").attr("src", URL.createObjectURL(files[0]));
		
	}else if (selectedOption){
		
		$("#audio").attr("src", "audio/" +selectedOption+".mp3");
	}else{
		//display error
		console.log("error, returning");
		stop();
		return;
	}
	
	
	ctx.resume();
	audio.load();
	audio.play();
	// frequencyBinCount tells you how many values you'll receive from the analyser
	var frequencyData = new Uint8Array(analyser.frequencyBinCount);
	
	let scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1500);
	camera.position.z = 150;
	camera.position.x = 5;
	camera.position.y = 70;
	controls = new THREE.OrbitControls( camera );
	
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setClearColor("#000000");
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	//we do this to remove the previous canvas (if we changed songs)
	$("#sceneDisplay")[0].children[0].replaceWith(renderer.domElement);
	
	//0xff0d00, 0x99ccff
	//0x000000, 0xffffff
	light = new THREE.HemisphereLight(0xff0d00, 0x99ccff, 1);
	scene.add(light);
	
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
		
		points[a] = {x, y, z};
    }
	
	//this is for an evenly distributed sphere
	//https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere
	let evenPoints = [];
	
	let rnd = -1 + Math.random() * 2;

	//it seems like the last few hundred frequencies are rarely reached in most songs
	//so instead of 1024, i'll cut it off at 800
    let offset = 2/800;
    let increment = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i <= 800; i++){
		let x, y, z;
        y = ((i * offset) - 1) + (offset / 2);
        r = Math.sqrt(1 - Math.pow(y,2))

        let phi = ((i + rnd) % 800) * increment

        x = Math.cos(phi) * r
        z = Math.sin(phi) * r
		
		x *= 50;
		y *= 50;
		z *= 50;

        evenPoints[i] = {x, y, z};
	}
	
	evenPoints.reverse();

  //inner sphere
    for (let a = 0; a < 800; a++){
	  
		let {x, y, z} = evenPoints[a];
		var parent = new THREE.Object3D();
		scene.add( parent );

		var stick = new THREE.Object3D();
		var point = new THREE.Vector3( x, y, z );
		stick.lookAt( point );
		parent.add( stick );

		var geometry = new THREE.CubeGeometry( 3, 3, 3, 1, 1, 1 );
		//var geometry = new THREE.SphereGeometry(2, 10, 10);
		let material = new THREE.MeshPhongMaterial({
		//color: 'skyblue'
		shininess: 50,
		//map: new THREE.TextureLoader().load('images/wood.png')
		
		});
		
		var mesh = new THREE.Mesh( geometry, material );
		let r = Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2));
		mesh.position.set( 0, 0, r );
		stick.add( mesh );
    }
  
	let texture;
	//outer sphere
	for (let a = 0; a < 1024; a++){
	  
		if (a%2 == 0){
			texture = 'images/two.png';
		}else{
			texture = 'images/one.PNG';
		}
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

		//var geometry = new THREE.CubeGeometry( 2, 2, 2, 2, 2, 2 );
		var geometry = new THREE.SphereGeometry(2, 10, 10);
		let material = new THREE.MeshPhongMaterial({
		//color: 'skyblue'
		map: new THREE.TextureLoader().load(texture)
		});
		
		var mesh = new THREE.Mesh( geometry, material );
		
		let r = Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2));
		mesh.position.set( 0, 0, r );
		stick.add( mesh );
	}
  
  
  

/*  
	console.log(scene.children.length);
	console.log(scene.children);
	console.log(scene.children[0]);
	console.log(scene.children[5].children[0]);
	
	console.log(typeof(scene.children[5]));
	*/
	
	let angle = -100;
	let radius = 170;
	
	var render = function () {
		animationId = requestAnimationFrame( render );
		analyser.getByteFrequencyData(frequencyData);
		controls.update();
	  
		let frequencyPointer = 0;
		for (let a = 2; a < scene.children.length; a++){
			
			let obj = scene.children[a];
			
			if (a < 802){
				if (obj instanceof THREE.Object3D){
					
						
						let objCube = obj.children[0].children[0];
						
						let val = 0.5 + frequencyData[frequencyPointer]/150;

						objCube.scale.set(val/3, val/3, val/3);
						obj.scale.set(val, val, val);
						
				}
			}else{
				
				
				if (frequencyData[frequencyPointer] > 100){
					obj.visible = true;
				}else{
					obj.visible = false;
				}
				
				/*
				let objCube = obj.children[0].children[0];
						
				let val = 0.5 + frequencyData[frequencyPointer]/10;
				objCube.scale.set(val, val, val);
				*/
			}
			
			frequencyPointer++;
			if (frequencyPointer == 1024) frequencyPointer = 0;
			
			if (rotation){
				camera.position.x = radius * Math.cos( angle );  
				camera.position.z = radius * Math.sin( angle );
				angle += 0.0000005;
			}
			
			
		}
		
		if (angle > 1000000) angle = 0;
	
		// Render the scene
		renderer.render(scene, camera);
	  
	};
	render();
	
	
}