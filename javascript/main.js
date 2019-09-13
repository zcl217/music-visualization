let renderer, camera, controls, light;
let animationId, scene, analyser, frequencyData, angle, radius;
let rotation = false;
let topColor = "";
let bottomColor = "";

$(document).ready(function() {
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
	let audio = $("#audio")[0];
	
	let ctx = new AudioContext();
	let audioSrc = ctx.createMediaElementSource(audio);
	analyser = ctx.createAnalyser();
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

	createColorWheelEvents();		
});

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
	
	initializeVariables();
	
	generateSpheres(scene);
	
	render();	
}
