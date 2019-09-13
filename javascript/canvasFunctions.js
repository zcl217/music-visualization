function createColorWheelEvents(){
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

			let dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
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

			let dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
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
}

function displayName(file){
	if (file) $("#uploadedFile").text(file.name);
}

function stop(){
	cancelAnimationFrame(animationId);
	if (controls) controls.enabled = false;
	$("#audio").attr("src", "");
	
	$("#visuals").css({'display': 'none'});
	$("#overlay").css({'display': 'flex'});
	
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


function initializeVariables(){
	// frequencyBinCount tells you how many values you'll receive from the analyser
	frequencyData = new Uint8Array(analyser.frequencyBinCount);
	
	scene = new THREE.Scene();
	
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
	
	light = new THREE.HemisphereLight(0xff0d00, 0x99ccff, 1);
	scene.add(light);
	
	angle = -100;
	radius = 170;
}

function generateSpheres(scene){
	
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
		let parent = new THREE.Object3D();
		scene.add( parent );

		let stick = new THREE.Object3D();
		let point = new THREE.Vector3( x, y, z );
		stick.lookAt( point );
		parent.add( stick );

		let geometry = new THREE.CubeGeometry( 3, 3, 3, 1, 1, 1 );
		let material = new THREE.MeshPhongMaterial({
			shininess: 50,
		});
		
		let mesh = new THREE.Mesh( geometry, material );
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
		let parent = new THREE.Object3D();
		scene.add( parent );

		let stick = new THREE.Object3D();
		let point = new THREE.Vector3( x, y, z );
		stick.lookAt( point );
		parent.add( stick );

		//let geometry = new THREE.CubeGeometry( 2, 2, 2, 2, 2, 2 );
		let geometry = new THREE.SphereGeometry(2, 10, 10);
		let material = new THREE.MeshPhongMaterial({
		//color: 'skyblue'
		map: new THREE.TextureLoader().load(texture)
		});
		
		let mesh = new THREE.Mesh( geometry, material );
		
		let r = Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2));
		mesh.position.set( 0, 0, r );
		stick.add( mesh );
	}
}

function render(){
	animationId = requestAnimationFrame( render );
	analyser.getByteFrequencyData(frequencyData);
	controls.update();
  
	let frequencyPointer = 0;
	
	//place the shapes of both the inner and outer spheres
	for (let a = 2; a < scene.children.length; a++){
		let obj = scene.children[a];
		
		//inner sphere shapes
		if (a < 802){
			if (obj instanceof THREE.Object3D){		
					let objCube = obj.children[0].children[0];
					let val = 0.5 + frequencyData[frequencyPointer]/150;

					objCube.scale.set(val/3, val/3, val/3);
					obj.scale.set(val, val, val);	
			}
		//outer sphere shapes		
		}else{
			if (frequencyData[frequencyPointer] > 100){
				obj.visible = true;
			}else{
				obj.visible = false;
			}
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
}