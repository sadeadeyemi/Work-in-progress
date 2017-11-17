var actorChars = {
	  "@": Player,
	  /*">": HoriPlat,
	  "^": VertPlat,*/
	  "?": Enemy,
	  "x": Spikes
	  
  };
function Level(plan) {
  // Use the length of a single row to set the width of the level
  this.width = plan[0].length;
  // Use the number of rows to set the height
  this.height = plan.length;
  // Store the individual tiles in our own, separate array
  this.grid = [];
  this.actors = [];
  // Loop through each row in the plan, creating an array in our grid
  for (var y = 0; y < this.height; y++) {
    var line = plan[y], gridLine = [];

    // Loop through each array element in the inner array for the type of the tile
    for (var x = 0; x < this.width; x++) {
      // Get the type from that character in the string. It can be 'x', '!' or ' '
      // If the character is ' ', assign null.
      var ch = line[x], fieldType = null;
      // Use if and else to handle the two cases
	  //Player is an actor
      if (ch==='@') {
	   //this.player = document.getElementById("marioPic");
	   this.player = new Player(new Vector(x,y));
		this.actors.push(this.player);	
	  }else if (ch == "y") {
        fieldType = "wall";
      }else if (ch == "!"){
        fieldType = "lava";
      } else if (ch == "o") {  
		 this.actors.push(new Coin(new Vector(x,y)));
	  } else if (ch == ">") {	
			//fieldType = "wall";
		  this.actors.push(new HoriPlat(new Vector(x,y)));
	  } else if (ch == "^") {	  
		  this.actors.push(new VertPlat(new Vector(x,y)));
	  }else if (ch == "?") {  
		  this.actors.push(new Enemy(new Vector(x,y)));
	  }
      // "Push" the fieldType, which is a string, onto the gridLine array (at the end).
      gridLine.push(fieldType);
    }
    // Push the entire row onto the array of rows.
    this.grid.push(gridLine);
  }
}

//Level finished
Level.prototype.isFinished = function() {
	return this.status != null && this.finishDelay < 0;
};
  
function Vector(x, y) {
  this.x = x; this.y = y;
}

// Vector arithmetic: v_1 + v_2 = <a,b>+<c,d> = <a+c,b+d>
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

// Vector arithmetic: v_1 * factor = <a,b>*factor = <a*factor,b*factor>
Vector.prototype.times = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};

//player pic


// A Player has a size, speed and position.
function Player(pos) {
  this.pos = pos.plus(new Vector(0, -0.5));
  this.size = new Vector(0.8, 1.5);
  this.speed = new Vector(0, 0);
  
 /* window.onload = function() {
	var canvas =
	document.getElementById("marioPic");
	//var ctx = canvas.getContext("2d");
	var img = document.getElementById("marioPic");
	//ctx.drawImage(img, 0,0);
};*/
}
Player.prototype.type = "player";

//lava 
function Lava (pos) {
	this.pos = pos;
	this.size = new Vector(3, 5);
}
Lava.prototype.type= "lava";

Lava.prototype.act = function(step, level) {
  var newPos = this.pos.plus(this.speed.times(step));
  if (!level.obstacleAt(newPos, this.size))
    this.pos = newPos;
  else if (this.repeatPos)
    this.pos = this.repeatPos;
  else
    this.speed = this.speed.times(-1);
};

//coins
function Coin(pos) {
	this.basePos = this.pos = pos.plus(new Vector(.3, .2));
	this.size = new Vector (0.9, 0.9);
	this.jiggle = Math.random() * Math.PI * 2;
}
Coin.prototype.type = "coin";

Coin.prototype.act = function(step) {
	this.jiggle += step * jiggleSpeed;
	var jigglePos = Math.sin(this.jiggle) * jiggleDist;
	this.pos = this.basePos.plus(new Vector(0, jigglePos));
};
var jiggleSpeed = 6.9, jiggleDist = .42


function Wall(pos, ch) {
	this.pos = pos;
	if (ch == ">") {
		this.speed = new Vector (2,0);
	}
}
//horizontal platform
function HoriPlat(pos) {
	this.pos = pos;
	this.size = new Vector (5,1);
	this.speed = new Vector (2,0);
	//this.basePos = this.pos=pos.plus(new Vector(.1,2));
	
HoriPlat.prototype.type = "horiPlat";

HoriPlat.prototype.act = function(step, level) {	
	
	var newPos = this.pos.plus(this.speed.times(step));
	if (!level.obstacleAt(newPos, this.size)){
		this.pos = newPos;
	}else if (this.repeatPos) {
		this.pos = this.repeatPos;
	}else {
		this.speed = this.speed.times(-1);
	}
	var horizontalPos = newPos * horizontalDist;
}
/*HoriPlat.prototype.obstacleAt = function(pos, size) {
  var xStart = Math.bottom(pos.x);
  var xEnd = Math.roof(pos.x + size.x);
  var yStart = Math.bottom(pos.y);
  var yEnd = Math.roof(pos.y + size.y);

  if (xStart < 0 || xEnd > this.width || yStart < 0)
    return "wall";
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var fieldType = this.grid[y][x];
      if (fieldType) return fieldType;
    }
  }
};*/


};
var horizontalSpeed =4, horizontalDist = 1



//vertical platform
function VertPlat (pos) {
	this.basePos = this.pos = pos.plus(new Vector(.3, .2));
	this.size = new Vector(5,1);
	this.vertical = Math.random() * Math.PI * 2;
	this.repeatPos = pos;
}
VertPlat.prototype.type = "vertPlat";

VertPlat.prototype.act = function(step) {
	this.vertical += step * verticalSpeed;
	var verticalPos = Math.sin(this.vertical) * verticalDist;
	this.pos = this.basePos.plus(new Vector(0, verticalPos));

	
};
var verticalSpeed =6.9, verticalDist = -.63

//enemy function	
function Enemy (pos) {
	this.basePos = this.pos = pos.plus(new Vector(.3, .2));
	this.size = new Vector (3,1);
	this.enemy = Math.random() * Math.PI * 2;
	this.repeatPos = pos;
}
Enemy.prototype.type = "enemy";

Enemy.prototype.act = function(step) {
	this.enemy += step * enemySpeed;
	var enemyPos = Math.sin(this.enemy) * enemyDist;
	this.pos = this.basePos.plus(new Vector(0, enemyPos));
};
var enemySpeed =6.9, enemyDist = -.63


//Spikes
function Spikes (pos) {
	this.pos = pos;
	this.size = new Vector (1,1);
}
Spikes.prototype.type = "spikes";


function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}

// Main display class. We keep track of the scroll window using it.
function DOMDisplay(parent, level) {

// this.wrap corresponds to a div created with class of "game"
  this.wrap = parent.appendChild(elt("div", "game"));
  this.level = level;

  // In this version, we only have a static background.
  this.wrap.appendChild(this.drawBackground());
  
  // Keep track of actors
  this.actorLayer = null;

  // Update the world based on player position
  this.drawFrame();
}

var scale = 15;

DOMDisplay.prototype.drawBackground = function() {
  var table = elt("table", "background");
  table.style.width = this.level.width * scale + "px";

  // Assign a class to new row element directly from the string from
  // each tile in grid
  this.level.grid.forEach(function(row) {
    var rowElt = table.appendChild(elt("tr"));
    rowElt.style.height = scale + "px";
    row.forEach(function(type) {
      rowElt.appendChild(elt("td", type));
    });
  });
  return table;
};


DOMDisplay.prototype.drawActors = function() {
  // Create a new container div for actor dom elements
  var wrap = elt("div");

  // Create a new element for each actor each frame
  this.level.actors.forEach(function(actor) {
    var rect = wrap.appendChild(elt("div",
                                    "actor " + actor.type));
    rect.style.width = actor.size.x * scale + "px";
    rect.style.height = actor.size.y * scale + "px";
    rect.style.left = actor.pos.x * scale + "px";
    rect.style.top = actor.pos.y * scale + "px";
  });
   return wrap;
};

DOMDisplay.prototype.drawPlayer = function() {
  // Create a new container div for actor dom elements
  var wrap = elt("div");

  var actor = this.level.player;
  var rect = wrap.appendChild(elt("div", 
									"actor " + actor.type));
  rect.style.width = actor.size.x * scale + "px";
  rect.style.height = actor.size.y * scale + "px";
  rect.style.left = actor.pos.x * scale + "px";
  rect.style.top = actor.pos.y * scale + "px";
  return wrap;
};

DOMDisplay.prototype.drawFrame = function() {
  if (this.actorLayer)
    this.wrap.removeChild(this.actorLayer);
  this.actorLayer = this.wrap.appendChild(this.drawActors());
  this.wrap.className = "game " + (this.level.status || "");
  this.scrollPlayerIntoView();
}; 

DOMDisplay.prototype.scrollPlayerIntoView = function() {
  var width = this.wrap.clientWidth;
  var height = this.wrap.clientHeight;

  // We want to keep player at least 1/3 away from side of screen
  var margin = width / 3;

  // The viewport
  var left = this.wrap.scrollLeft, right = left + width;
  var top = this.wrap.scrollTop, bottom = top + height;

  var player = this.level.player;
  // Change coordinates from the source to our scaled.
  var center = player.pos.plus(player.size.times(0.5))
                 .times(scale);

  if (center.x < left + margin)
    this.wrap.scrollLeft = center.x - margin;
  else if (center.x > right - margin)
    this.wrap.scrollLeft = center.x + margin - width;
  if (center.y < top + margin)
    this.wrap.scrollTop = center.y - margin;
  else if (center.y > bottom - margin)
    this.wrap.scrollTop = center.y + margin - height;
};

DOMDisplay.prototype.clear = function() {
  this.wrap.parentNode.removeChild(this.wrap);
};

// Return the first obstacle found given a size and position.
Level.prototype.obstacleAt = function(pos, size) {
  // left
  var xStart = Math.floor(pos.x);
  // right 
  var xEnd = Math.ceil(pos.x + size.x);
  // top 
  var yStart = Math.floor(pos.y);
  // Bottom 
  var yEnd = Math.ceil(pos.y + size.y);

  // Consider the sides and top and bottom of the level as walls
  if (xStart < 0 || xEnd > this.width || yStart < 0 || yEnd > this.height)
    return "wall";
	if (yEnd > this.height)
		return "lava";

  // Check each grid position starting at yStart, xStart
  // for a possible obstacle (non null value)
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var fieldType = this.grid[y][x];
      if (fieldType){ return fieldType;
	  }
    }
  }
};
// Collision detection for actors is handled separately from 
// tiles. 
Level.prototype.actorAt = function(actor) {
  // Loop over each actor in our actors list and compare the 
  // boundary boxes for overlaps.
  for (var i = 0; i < this.actors.length; i++) {
    var other = this.actors[i];
    // if the other actor isn't the acting actor
    if (other != actor &&
        actor.pos.x + actor.size.x > other.pos.x &&
        actor.pos.x < other.pos.x + other.size.x &&
        actor.pos.y + actor.size.y > other.pos.y &&
        actor.pos.y < other.pos.y + other.size.y)
      // check if the boundaries overlap by comparing all sides for
      // overlap and return the other actor if found
      return other;
  }
};

Level.prototype.animate = function(step, keys) {
  if (this.status !== null)
    this.finishDelay -= step;

  while (step > 0) {
    var thisStep = Math.min(step, maxStep);
    this.actors.forEach(function(actor) {
      actor.act(thisStep, this, keys);
    }, this);
    step -= thisStep;
  }
};

//Will
/*Actor.prototype.act = function(step, level) {
	var newPos = this.pos.plus(this.speed.times(step));
  if (!level.obstacleAt(newPos, this.size))
    this.pos = newPos;
  else if (this.repeatPos)
    this.pos = this.repeatPos;
  else
    this.speed = this.speed.times(-1);
};*/

var maxStep = 0.08;

var playerXSpeed = 4;

Player.prototype.moveX = function(step, level, keys) {
  this.speed.x = 0;
  if (keys.left) this.speed.x -= playerXSpeed;
  if (keys.right) this.speed.x += playerXSpeed;

  var motion = new Vector(this.speed.x * step, 0);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);

  if (obstacle)
	  level.playerHit(obstacle);
  // Move if there's not a wall there.
  else
	this.pos = newPos;
};


var gravity = 18;
var jumpSpeed = 13;
var playerYSpeed = 11;

Player.prototype.moveY = function(step, level, keys) {
  // Accelerate player downward (always)
  this.speed.y += step * gravity;
  var motion = new Vector(0, this.speed.y * step);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  // The floor is also an obstacle -- only allow players to 
  // jump if they are touching some obstacle.
  if (obstacle) {
	  level.playerHit(obstacle);
    if (keys.up && this.speed.y > 0)
      this.speed.y = -jumpSpeed;
    else
      this.speed.y = 0;
  } else {
    this.pos = newPos;
  }
};

Player.prototype.act = function(step, level, keys) {
  this.moveX(step, level, keys);
  this.moveY(step, level, keys);
  var otherActor = level.actorAt(this);
  if (otherActor)
    level.playerHit(otherActor.type, otherActor);
  if (level.status == "gameOver") {
    this.pos.y += step;
    this.size.y -= step;
  }
};
Level.prototype.playerHit = function(type, actor) {
  //hit lava
  if (type == "lava" && this.status == null) {
    this.status = "gameOver";
    this.finishDelay = 1;
  }/*else if (type == "horiPlat" && this.status == null) {
		return obstacle;
  }*/else if (type == "enemy" && this.status == null) {
	  this.status = "gameOver";
	  this.finishDelay = 1;
  } else if (type == "spikes" && this.status == null) {
	  this.status = "gameOver";
	  this.finishDelay = 1;
  } else if (type == "coin") {
    this.actors = this.actors.filter(function(other) {
      return other != actor; 
    });
  
	if (!this.actors.some(function(actor) {
		return actor.type == "coin";
		})) {
		this.status = "won"
		this.finishDelay = 1;
	}
  }
};



Level.prototype.isFinished = function() {
  return this.status != null && this.finishDelay < 0;
};
// Arrow key codes for readibility
var arrowCodes = {37: "left", 38: "up", 39: "right", 40: "down"};


// Translate the codes pressed from a key event
function trackKeys(codes) {
  var pressed = Object.create(null);

  // alters the current "pressed" array which is returned from this function. 
  // The "pressed" variable persists even after this function terminates
  // That is why we needed to assign it using "Object.create()" as 
  // otherwise it would be garbage collected

  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      // If the event is keydown, set down to true. Else set to false.
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      // We don't want the key press to scroll the browser window, 
      // This stops the event from continuing to be processed
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}

// frameFunc is a function called each frame with the parameter "step"
// step is the amount of time since the last call used for animation
function runAnimation(frameFunc) {
  var lastTime = null;
  function frame(time) {
    var stop = false;
    if (lastTime !== null) {
      // Set a maximum frame step of 100 milliseconds to prevent
      // having big jumps
      var timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop)
      requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// This assigns the array that will be updated anytime the player
// presses an arrow key. We can access it from anywhere.
var arrows = trackKeys(arrowCodes);
// Organize a single level and begin animation
function runLevel(level, Display, andThen) {
  var display = new Display(document.body, level);
  runAnimation(function(step) {
    // Allow the viewer to scroll the level
    level.animate(step, arrows);
    display.drawFrame(step);
	if (level.isFinished()) {
      display.clear();
      if (andThen)
        andThen(level.status);
      return false;
    }
  });
}

function runGame(plans, Display) {

  function startLevel(n) {
    // Create a new level using the nth element of array plans
    // Pass in a reference to Display function, DOMDisplay (in index.html).
    runLevel(new Level(plans[n]), Display, function(status) {
		if (status== 'gameOver')
			startLevel(n);
		else if (n < plans.length -1)
			startLevel(n+1);
		else 
			alert("You win!");
	});
  }
  startLevel(0);
}
