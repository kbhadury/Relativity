//Control animation
var play = false;
var animateID;

//Data for Anna and Bob
anna_x = 500; //Default start pos
bob_x = 500;
var anna_len = 100;
var bob_len = 100;
var anna_speed = 0
var bob_speed = 0;

//Time in nanoseconds
var anna_times = [0, 0, 0];
var bob_times = [0, 0, 0];

var rest_time = 0;

//Fired when play/pause button is pressed
function togglePlay(button){
	if(play){ //If currently playing
		button.innerHTML = "Play";
		window.clearInterval(animateID);
	}else{
		button.innerHTML = "Pause";
		calculate();
		animateID = window.setInterval(draw, 50);
	}
	
	play = !play;
}

//Calculate the apparent lengths of Anna's and Bob's ships
function calculate(){
	var lorentz;
	
	//Anna's frame
	if(document.getElementById("annaRB").checked){
		anna_speed = 0;
		bob_speed = parseFloat(document.getElementById("bob_speed").value);
		
		lorentz = 1/Math.sqrt(1-(bob_speed*bob_speed));
		
		anna_len = parseFloat(document.getElementById("anna_len").value);
		bob_len = parseFloat(document.getElementById("bob_len").value) / lorentz;
		
		anna_times[0] = anna_times[1] = anna_times[2] = rest_time;
		
		bob_times[0] = lorentz*(rest_time - (bob_speed*10/3) * (bob_x - 500 - bob_len*0.5));
		bob_times[1] = lorentz*(rest_time - (bob_speed*10/3) * (bob_x - 500));
		bob_times[2] = lorentz*(rest_time - (bob_speed*10/3) * (bob_x - 500 + bob_len*0.5));
	
	//Bob's frame
	}else{
		anna_speed = parseFloat(document.getElementById("anna_speed").value);
		bob_speed = 0;
		
		lorentz = 1/Math.sqrt(1-(anna_speed*anna_speed));
		
		anna_len = parseFloat(document.getElementById("anna_len").value) / lorentz;
		bob_len = parseFloat(document.getElementById("bob_len").value);
	}
}

//Fired when radio buttons are updated
function changeFrame(radio){
	//Get corresponding IDs and names
	var selected_id = radio.id.slice(0, -2); //either "anna" or "bob"
	var other_id = (selected_id == "anna") ? "bob":"anna";
	
	var selected_speed_id = selected_id + "_speed";
	var other_speed_id = other_id + "_speed";
	
	var selected_name = String.fromCharCode(selected_id.charCodeAt(0) - 32) + selected_id.substring(1); //Make uppercase
	
	//Enable and set the other speed input box
	document.getElementById(other_speed_id).removeAttribute("disabled");
	document.getElementById(other_speed_id).value = -1*parseFloat(document.getElementById(selected_speed_id).value);
	
	//Force speed to equal 0 in selected frame
	document.getElementById(selected_speed_id).value = "0";
	document.getElementById(selected_speed_id).setAttribute("disabled", "disabled");
	
	document.getElementById("speed_text").innerHTML = "Set velocities relative to " + selected_name + " (in terms of c, can be +/-)";
	
	//Update values
	reset();
}

//Force values to be recalculated and displayed
function update(){
	calculate();
	draw();
}

//Reset animation
function reset(){
	window.clearInterval(animateID);
	document.getElementById("playpause").innerHTML = "Play";
	play = false;
	anna_x = 500;
	bob_x = 500;
	rest_time = 0;
	update();
}

function draw(){
	//Set up canvases and contexts
	var shipcanvas = document.getElementById("shipcanvas");
	var shipctx = shipcanvas.getContext('2d');
	
	var clkcanvas = document.getElementById("clkcanvas");
	var clkctx = clkcanvas.getContext('2d');
	
	//Reset canvases
	shipctx.clearRect(0, 0, 1000, 250);
	clkctx.clearRect(0, 0, 500, 250);
	
	shipctx.fillStyle = 'rgb(200, 200, 200)';
	shipctx.fillRect(0, 0, 1000, 250);
	
	clkctx.fillStyle = 'rgb(51, 153, 102)';
	clkctx.fillRect(0, 0, 500, 250);
	
	//background(ctx);
	
	//Set up fonts
	shipctx.font = '10px sans-serif';
	shipctx.textBaseline = 'top';
	grid(shipctx, 1000, 250, 50);
	
	clkctx.font = "24px serif";
	clkctx.textAlign = 'center';
	clkctx.textBaseline = 'middle';
	
	//Draw ships
	//Anna
	shipctx.fillStyle = 'rgba(200, 0, 0, 0.4)';
	shipctx.strokeStyle = 'rgb(200, 0, 0)';
	spaceship(shipctx, anna_x, 50, 40, anna_len);
	
	//Bob
	shipctx.fillStyle = 'rgba(0, 0, 200, 0.4)';
	shipctx.strokeStyle = 'rgb(0, 0, 200)';
	spaceship(shipctx, bob_x, 150, 40, bob_len);
	
	//Draw clocks
	//Anna
	clkctx.fillStyle = 'rgb(240, 240, 240)';
	clkctx.strokeStyle = 'rgb(200, 0, 0)';
	clock(clkctx, 125, 50, parseInt(anna_times[0]));
	clock(clkctx, 250, 50, parseInt(anna_times[1]));
	clock(clkctx, 375, 50, parseInt(anna_times[2]));
	
	//Bob
	clkctx.fillStyle = 'rgb(240, 240, 240)';
	clkctx.strokeStyle = 'rgb(0, 0, 200)';
	clock(clkctx, 125, 150, parseInt(bob_times[0]));
	clock(clkctx, 250, 150, parseInt(bob_times[1]));
	clock(clkctx, 375, 150, parseInt(bob_times[2]));
	
	rest_time += 50; //1ms in sim = 1ns in real world
	
	anna_x += 15*anna_speed;
	bob_x += 15*bob_speed;
}

function background(ctx){
	var gradient1 = ctx.createRadialGradient(100, 75, 5, 95, 80, 20);
	gradient1.addColorStop(0, '#FF9900');
	gradient1.addColorStop(0.9, '#FFEBCC');
	gradient1.addColorStop(1, 'rgba(255, 235, 204, 0)');
	
	var gradient2 = ctx.createRadialGradient(410, 210, 10, 415, 205, 30);
	gradient2.addColorStop(0, '#0099CC');
	gradient2.addColorStop(0.9, '#CCF2FF');
	gradient2.addColorStop(1, 'rgba(204, 242, 255, 0)');
	
	ctx.fillStyle = gradient1;
	ctx.fillRect(0, 0, 1000, 250);
	ctx.fillStyle = gradient2;
	ctx.fillRect(0, 0, 1000, 250);
}

//Draw a spaceship centered at x, y
function spaceship(ctx, x, y, height, length){	
	ctx.beginPath();
	ctx.moveTo(x - (length*0.5), y - (height*0.5));
	ctx.lineTo(x + (length*0.25), y - (height*0.5));
	ctx.lineTo(x + (length*0.5), y);
	ctx.lineTo(x + (length*0.25), y + (height*0.5));
	ctx.lineTo(x - (length*0.5), y + (height*0.5));
	ctx.closePath();
	
	ctx.fill();
	ctx.lineWidth = 4;
	ctx.stroke();
	ctx.lineWidth = 1;
}

//Draw a clock centered at x,y that reads display param
//Default dimensions are 100x50
function clock(ctx, x, y, display){
	ctx.fillRect(x-50, y-25, 100, 50);
	ctx.lineWidth = 4;
	ctx.strokeRect(x-50, y-25, 100, 50);
	ctx.lineWidth = 1;
	
	origfill = ctx.fillStyle;
	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.fillText(display, x, y)
	ctx.fillStyle = origfill;
}

//Draw bg grid with labels
function grid(ctx, width, height, step){	
	ctx.strokeStyle = 'rgb(0, 0, 0)';
	ctx.fillStyle = 'rgb(0, 0, 0)';
	
	ctx.beginPath();
	
	//Draw vertical lines
	
	for(x = 0; x < width; x += step){
		ctx.moveTo(x, 0);
		ctx.lineTo(x, height);
	}
	
	//Draw horizontal lines
	for(y = 0; y < height; y += step){
		ctx.moveTo(0, y);
		ctx.lineTo(width, y);
	}
	
	ctx.stroke();
	
	//Add numbers	
	for(x = 0; x < width; x += step){
		ctx.fillText(x, x+1, 0);
	}
	
	for(y = step; y < height; y += step){
		ctx.fillText(y, 0, y+1);
	}
}