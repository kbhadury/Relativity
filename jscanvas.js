//Control drawing
var shipcanvas, clkcanvas;
var shipctx, clkctx;
var digitalClk = true;
var SHIP_CANVAS_WIDTH = 1000;
var SHIP_CANVAS_HEIGHT = 200;
var CLK_CANVAS_WIDTH = 400;
var CLK_CANVAS_HEIGHT = 200;

//Control animation
var play = false;
var animateID;

//Data for Anna and Bob, set to defaults
var anna_x = 500;
var bob_x = 500;
var anna_len = 100;
var bob_len = 100;
var anna_speed = 0
var bob_speed = 0;
var lorentz = 0;
var cur_frame = "anna";

//Times in nanoseconds
var anna_times = [0, 0, 0];
var bob_times = [0, 0, 0];

//Current time in rest frame
var rest_time = 0;

//Set up canvas and context variables
function init(){
	shipcanvas = document.getElementById("shipcanvas");
	shipctx = shipcanvas.getContext('2d');
	
	clkcanvas = document.getElementById("clkcanvas");
	clkctx = clkcanvas.getContext('2d');
	
	draw();
}

//Check if data entered is within the appropriate bounds
function isInputValid(){
	var as = Math.abs(parseFloat(document.getElementById("anna_speed").value));
	var bs = Math.abs(parseFloat(document.getElementById("bob_speed").value));
	var al = parseFloat(document.getElementById("anna_len").value);
	var bl = parseFloat(document.getElementById("bob_len").value);
	
	if(as > 0.99 || bs > 0.99 || al < 1 || bl < 1){
		alert("Speeds must be between -0.99 and 0.99, lengths must be greater than 1");
		return false;
	}
	
	return true;
}

//Enable input boxes (except for current frame's speed)
function enableInput(){
	//Temporarily enable all
	document.getElementById("anna_speed").removeAttribute("disabled");
	document.getElementById("bob_speed").removeAttribute("disabled");
	document.getElementById("anna_len").removeAttribute("disabled");
	document.getElementById("bob_len").removeAttribute("disabled");
	//Disable cur frame speed
	document.getElementById(cur_frame + "_speed").setAttribute("disabled", "disabled");
}

//Disable all input boxes
function disableInput(){
	document.getElementById("anna_speed").setAttribute("disabled", "disabled");
	document.getElementById("bob_speed").setAttribute("disabled", "disabled");
	document.getElementById("anna_len").setAttribute("disabled", "disabled");
	document.getElementById("bob_len").setAttribute("disabled", "disabled");
}

//Fired when play/pause button is pressed
function togglePlay(button){
	if(play){ //Currently playing, user wants to pause animation
		button.innerHTML = "Play";
		window.clearInterval(animateID);
		document.getElementById("step").removeAttribute("disabled");
		document.getElementById("update").removeAttribute("disabled");
		play = !play;
	} else { //Currently paused, user wants to play animation
		if(!isInputValid()) return;
		disableInput();
		document.getElementById("reset").removeAttribute("disabled");
		document.getElementById("step").setAttribute("disabled", "disabled");
		document.getElementById("update").setAttribute("disabled", "disabled");
		
		button.innerHTML = "Pause";
		calculateLengths();
		calculateTimes();
		animateID = window.setInterval(animate, 50);
		play = !play;
	}
}

//Fired when frame radio buttons are updated
function changeFrame(radio){
	//Get corresponding IDs and names
	var selected_id = radio.id.slice(0, -2); //either "anna" or "bob"
	var other_id = (selected_id == "anna") ? "bob":"anna";
	cur_frame = selected_id;
	
	var selected_speed_id = selected_id + "_speed";
	var other_speed_id = other_id + "_speed";
	
	var selected_name = String.fromCharCode(selected_id.charCodeAt(0) - 32) + selected_id.substring(1); //Make uppercase
	
	//Enable and set the other speed input box
	document.getElementById(other_speed_id).removeAttribute("disabled");
	document.getElementById(other_speed_id).value = -1*parseFloat(document.getElementById(selected_speed_id).value);
	
	//Force speed to equal 0 in selected frame
	document.getElementById(selected_speed_id).value = "0";
	document.getElementById(selected_speed_id).setAttribute("disabled", "disabled");
	
	document.getElementById("speed_text").innerHTML = "Set velocities relative to " + selected_name + " (in terms of c)";
	
	//Update values
	if(isInputValid()) reset();
}

//Fired when clock style radio buttons are updated
function changeClkStyle(radio){
	if(radio.id == "analog") digitalClk = false;
	else digitalClk = true;
	
	//Redraw
	draw();
}

//Set speeds, calculate lorentz, and determine the apparent lengths of Anna's and Bob's ships
function calculateLengths(){	
	//Anna's frame
	if(document.getElementById("annaRB").checked){
		anna_speed = 0;
		bob_speed = parseFloat(document.getElementById("bob_speed").value);
		
		lorentz = 1/Math.sqrt(1-(bob_speed*bob_speed));
		
		anna_len = parseFloat(document.getElementById("anna_len").value);
		bob_len = parseFloat(document.getElementById("bob_len").value) / lorentz;
		
	//Bob's frame
	} else {
		anna_speed = parseFloat(document.getElementById("anna_speed").value);
		bob_speed = 0;
		
		lorentz = 1/Math.sqrt(1-(anna_speed*anna_speed));
		
		anna_len = parseFloat(document.getElementById("anna_len").value) / lorentz;
		bob_len = parseFloat(document.getElementById("bob_len").value);
	}
}

//Calculate everyone's clocks.  Assumes lorentz has already been calculated
function calculateTimes(){
	scale_factor = 10/3;  //Speed already in terms of c, so we divide by 3e8 and multiply by 1e9 for nanoseconds
	//Anna's frame
	if(document.getElementById("annaRB").checked){
		anna_times[0] = anna_times[1] = anna_times[2] = rest_time;
		
		bob_times[0] = lorentz*(rest_time - (bob_speed*scale_factor) * (bob_x - 500 - bob_len*0.5));
		bob_times[1] = lorentz*(rest_time - (bob_speed*scale_factor) * (bob_x - 500));
		bob_times[2] = lorentz*(rest_time - (bob_speed*scale_factor) * (bob_x - 500 + bob_len*0.5));
		
	//Bob's frame
	} else {
		bob_times[0] = bob_times[1] = bob_times[2] = rest_time;
		
		anna_times[0] = lorentz*(rest_time - (anna_speed*scale_factor) * (anna_x - 500 - anna_len*0.5));
		anna_times[1] = lorentz*(rest_time - (anna_speed*scale_factor) * (anna_x - 500));
		anna_times[2] = lorentz*(rest_time - (anna_speed*scale_factor) * (anna_x - 500 + anna_len*0.5));
	}
}

//Force values to be recalculated and displayed
function update(){
	if(!isInputValid()) return;
	calculateLengths();
	calculateTimes();
	draw();
}

//Reset animation and enable inputs
function reset(){
	window.clearInterval(animateID);
	document.getElementById("playpause").innerHTML = "Play";
	play = false;
	anna_x = 500;
	bob_x = 500;
	rest_time = 0;
	update();
	
	enableInput();
	document.getElementById("step").removeAttribute("disabled");
	document.getElementById("update").removeAttribute("disabled");
	document.getElementById("reset").setAttribute("disabled", "disabled");
}

//Draw, update values, and recalculate for next iteration
function step(){
	if(!isInputValid()) return;
	disableInput();
	document.getElementById("reset").removeAttribute("disabled");
	
	calculateLengths();
	rest_time += 50; //1 ms in sim = 1 ns in real world
	anna_x += 15*anna_speed;
	bob_x += 15*bob_speed;
	calculateTimes();
	draw();
}

//Clone of step() but without input checking, used by play() function
function animate(){
	rest_time += 50; //1 ms in sim = 1 ns in real world
	anna_x += 15*anna_speed;
	bob_x += 15*bob_speed;
	calculateTimes(); //play() already calculates lengths
	draw();
}

//Draw grid, ships, clocks
function draw(){	
	//Reset canvases
	shipctx.clearRect(0, 0, SHIP_CANVAS_WIDTH, SHIP_CANVAS_HEIGHT);
	clkctx.clearRect(0, 0, CLK_CANVAS_WIDTH, CLK_CANVAS_WIDTH);
	
	shipctx.fillStyle = 'rgb(200, 200, 200)';
	shipctx.fillRect(0, 0, SHIP_CANVAS_WIDTH, SHIP_CANVAS_WIDTH);
	
	clkctx.fillStyle = 'rgb(200, 200, 200)';
	clkctx.fillRect(0, 0, CLK_CANVAS_WIDTH, CLK_CANVAS_HEIGHT);
	
	//Set up fonts
	shipctx.font = '10px sans-serif';
	shipctx.textBaseline = 'top';
	
	clkctx.font = "20px sans-serif";
	clkctx.textAlign = 'center';
	clkctx.textBaseline = 'middle';
	
	//Draw ship grid and clock labels
	grid(shipctx, SHIP_CANVAS_WIDTH, SHIP_CANVAS_HEIGHT, 50);
	clkctx.fillStyle = 'rgb(0, 0, 0)';
	clkctx.fillText("Rear", 100, 100);
	clkctx.fillText("Middle", 200, 100);
	clkctx.fillText("Front", 300, 100);
	
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
	clock(clkctx, 100, 50, parseInt(anna_times[0]));
	clock(clkctx, 200, 50, parseInt(anna_times[1]));
	clock(clkctx, 300, 50, parseInt(anna_times[2]));
	
	//Bob
	clkctx.fillStyle = 'rgb(240, 240, 240)';
	clkctx.strokeStyle = 'rgb(0, 0, 200)';
	clock(clkctx, 100, 150, parseInt(bob_times[0]));
	clock(clkctx, 200, 150, parseInt(bob_times[1]));
	clock(clkctx, 300, 150, parseInt(bob_times[2]));
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
//Default dimensions are 100x50 for digital and radius 40 for analog
function clock(ctx, x, y, display){
	if(digitalClk){
		//Draw boxes
		ctx.fillRect(x-50, y-25, 100, 50);
		ctx.lineWidth = 4;
		ctx.strokeRect(x-50, y-25, 100, 50);
		ctx.lineWidth = 1;
		
		//Draw text
		origfill = ctx.fillStyle;
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillText(display, x, y)
		ctx.fillStyle = origfill;
	} else {
		//Draw circles
		ctx.beginPath();
		ctx.arc(x, y, 40, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.lineWidth = 4;
		ctx.stroke();
		ctx.lineWidth = 1;
		
		//Draw 1000ns marker
		origfill = ctx.fillStyle;
		ctx.fillStyle = 'rgb(100, 100, 100)';
		ctx.fillText("1000ns", x, y);
		ctx.fillStyle = origfill;
		
		//Draw hand
		display = display % 1000; //One rev around clock = 1000 time units
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(2 * Math.PI * display / 1000);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, -30);
		ctx.stroke();
		ctx.restore();
	}
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
