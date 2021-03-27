/*
WELCOME TO MY CODE! HAVE A NICE DAY!
*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var clouds;
var mountains;
var collectables;
var canyons;
var flagpole;

var lives;
var platforms;
var enemies;
var game_score;


var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //GAME SOUND
    bgmSound = loadSound('assets/bgm.mp3')
    jumpSound = loadSound('assets/jump.wav');
    swordSound = loadSound('assets/sword.wav');
    fallSound = loadSound('assets/fall.wav');
    moneySound = loadSound('assets/money.wav')
    jumpSound.setVolume(0.1);
    swordSound.setVolume(0.1);
    fallSound.setVolume(0.1);
    bgmSound.setVolume(0.1);
    moneySound.setVolume(0.1);
}


function setup()
{
    bgmSound.loop();
	createCanvas(1024, 576);
    
    lives = 4;
    textSize(20);
    
    startGame();

}


function startGame()
{
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	scrollPos = 0;
	gameChar_world_x = gameChar_x - scrollPos;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

    //OBJECT POSITION
    clouds = [
            {pos_x: 100, pos_y: 200},
            {pos_x: 500, pos_y: 100},
            {pos_x: 1000, pos_y: 100}
            ];
    
    mountains = [
                {pos_x: 300, height: 400},
                {pos_x: 500, height: 200},
                {pos_x: 800, height: 200},
                {pos_x: 1000, height: 300},
                {pos_x: 1300, height: 400},
                {pos_x: 1500, height: 200},
                {pos_x: 1800, height: 200},
                {pos_x: 2000, height: 300}
                ];
    
    trees_x = [ 200,
                300,
                800,
                1200,
                -500
              ];

    
    collectables = [
                {x_pos: 100, y_pos: floorPos_y,size: 50, isFound: false},
                {x_pos: 1150, y_pos: floorPos_y,size: 30, isFound: false},
                {x_pos: -900, y_pos: floorPos_y,size: 40, isFound: false}
                    ];
        
    
    canyons = [
                {x_pos: 200, width: 120},
                {x_pos: 700, width: 400},
                {x_pos: 1200, width: 180},
              ];
    
    platforms =[];
    
    platforms.push(createPlatforms(680, floorPos_y -100,150));
    
    game_score = 0;
    
    flagpole = {x_pos: 1500, isReached: false, height:300};
    
    lives -= 1;
    
    enemies = [];
    enemies.push(new Enemy(100, floorPos_y -30, 1300));
}

function draw()
{
    //SKY
	background(100, 155, 255); 

    //GROUND
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4);
    
    push();
    translate(scrollPos,0)
    drawClouds();
    drawMountains();
    drawTrees();
    drawSun();
    
    for(var i = 0; i< platforms.length; i++)
        {
            platforms[i].draw();
        }

    for(var i = 0; i < collectables.length; i++)
        {
            if(!collectables[i].isFound)
                {
                    drawCollectable(collectables[i]);
                    checkCollectable(collectables[i]);
                }   
        }

    
    for(var i = 0; i < canyons.length; i++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }

    if(!checkFlagpole.isReached)
        {
            checkFlagpole(flagpole);
        }
    
        drawFlagpole(flagpole);
    
    //ENEMIES INERACTION
    for(var i = 0; i < enemies.length; i++)
         {
            enemies[i].draw();
                
            var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
                
            if(isContact)
                {
                    if(lives >0)
                        {
                            startGame();
                            break;
                        }
                }
         }
    
	   pop();
    
    
	drawGameChar();
    
    
    text("score: " + game_score, 20,20);
    text("lives: " + lives, 20,60);
    text("Use WASD to move", 220,20);
    
    //WIN OR LOSE CONDITION
    if(lives <= 0)
        {
            text("game over - press F5 to continue", width/2 - 100, height/2);
            return;
        }
    
    else if(flagpole.isReached)
        {
            text("level complete - press F5 to continue", width/2 - 100, height/2);
            return;
        }

    if(gameChar_y > height)
        {
            if(lives > 0 )startGame();
        }


    // Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{ 
			scrollPos -= 5;
		}
	}

	// Logic to make the game character rise and fall.
    
    if(gameChar_y < floorPos_y)
        {   
            var isContact = false;
            for(var i = 0; i < platforms.length; i++)
                {
                    if(platforms[i].CheckContact(gameChar_world_x, gameChar_y) == true)
                        {
                            isContact = true;
                            break;
                        }
                }
            if(isContact == false)
                {
                    gameChar_y += 2;
                    isFalling = true;
                }
        }
    
    else
        {
            isFalling = false;
        }
    
    if(isPlummeting)
        {
            gameChar_y += 5;
        }
    
	// Update real position of gameChar for collision detection. 
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    
    if(flagpole.isReached && key == ' ')
        {
            nextlevel();
        }
    else if(lives == 0 && key == ' ')
        {
            returnToStart();
        }
    
    if(keyCode == 65 || keyCode == 37)
        {
            isLeft = true;
        }
    
    if(keyCode == 68 || keyCode == 39)
        {
            isRight = true;
        }
    
    if (key == ' ' || keyCode == 87)
        {
            if(!isFalling)
                {
                    gameChar_y -=100;
                    jumpSound.play();
                }
        }

}

function keyReleased()
{
        if(keyCode == 65 || keyCode == 37)
        {
            isLeft = false;
        }
    
        if(keyCode == 68 || keyCode == 39)
        {
            isRight = false;
        }
    
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
    
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(192,192,192);
        ellipse(gameChar_x, gameChar_y - 55, 25,30);
        //body
        fill(255,0,0);
        rect(gameChar_x - 8,gameChar_y - 40 ,15,30);
        //limbs
        fill(0);
        rect(gameChar_x - 10,gameChar_y - 20,10,10);
        rect(gameChar_x + 5,gameChar_y - 10,10,10);
        ellipse(gameChar_x - 10 ,gameChar_y -40 ,10,10);
        ellipse(gameChar_x +10 ,gameChar_y -25 ,10,10);
       //eyes
        fill(255,255,255);
        ellipse(gameChar_x - 8 ,gameChar_y -55 ,10,10);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(192,192,192);
        ellipse(gameChar_x, gameChar_y - 55, 25,30);
        //body
        fill(255,0,0);
        rect(gameChar_x - 8,gameChar_y - 40 ,15,30);
        //limbs
        fill(0);
        rect(gameChar_x - 15,gameChar_y - 10,10,10);
        rect(gameChar_x ,gameChar_y - 20,10,10);
        ellipse(gameChar_x - 10 ,gameChar_y -25 ,10,10);
        ellipse(gameChar_x +10 ,gameChar_y -40 ,10,10);
       //eyes
        fill(255,255,255);
        ellipse(gameChar_x +8  ,gameChar_y -55 ,10,10);


	}
	else if(isLeft)
	{
		// add your walking left code
        //head
        fill(192,192,192);
        ellipse(gameChar_x, gameChar_y - 55, 25,30);
        //body
        fill(255,0,0);
        rect(gameChar_x - 8,gameChar_y - 40 ,15,30);
        //limbs
        fill(0);
        rect(gameChar_x - 10,gameChar_y - 10,10,10);
        rect(gameChar_x + 5,gameChar_y - 10,10,10);
        ellipse(gameChar_x - 10 ,gameChar_y -30 ,10,10);
        ellipse(gameChar_x +10 ,gameChar_y -25 ,10,10);
        //eyes
        fill(255,255,255);
        ellipse(gameChar_x - 8 ,gameChar_y -55 ,10,10);
	}
	else if(isRight)
	{
		// add your walking right code
        //head
        fill(192,192,192);
        ellipse(gameChar_x, gameChar_y - 55, 25,30);
        //body
        fill(255,0,0);
        rect(gameChar_x - 8,gameChar_y - 40 ,15,30);
        //limbs
        fill(0);
        rect(gameChar_x - 15,gameChar_y - 10,10,10);
        rect(gameChar_x ,gameChar_y - 10,10,10);
        ellipse(gameChar_x - 10 ,gameChar_y -25 ,10,10);
        ellipse(gameChar_x +10 ,gameChar_y -30 ,10,10);
       //eyes
        fill(255,255,255);
        ellipse(gameChar_x +8  ,gameChar_y -55 ,10,10);

	}
	else if(isFalling || isPlummeting)
	{  
		// add your jumping facing forwards code
        //head
        fill(192,192,192);
        ellipse(gameChar_x, gameChar_y - 55, 35);
        //body
        fill(255,0,0);
        rect(gameChar_x - 13,gameChar_y - 40 ,26,30);
        //limbs
        fill(0);
        rect(gameChar_x - 15,gameChar_y - 10,10,10);
        rect(gameChar_x + 5,gameChar_y - 25,10,10);
        ellipse(gameChar_x - 15 ,gameChar_y -45 ,10,10);
        ellipse(gameChar_x +15 ,gameChar_y -30 ,10,10);
        //eyes
        fill(255,255,255);
        ellipse(gameChar_x - 8 ,gameChar_y -55 ,10,10);
        ellipse(gameChar_x +8 ,gameChar_y -55 ,10,10);

	}
	else
	{
		// add your standing front facing code
        fill(192,192,192);
        ellipse(gameChar_x, gameChar_y - 55, 35);
        //body
        fill(255,0,0);
        rect(gameChar_x - 13,gameChar_y - 40 ,26,30);
        //limbs
        fill(0);
        rect(gameChar_x - 15,gameChar_y - 10,10,10);
        rect(gameChar_x + 5,gameChar_y - 10,10,10);
        ellipse(gameChar_x - 15 ,gameChar_y -30 ,10,10);
        ellipse(gameChar_x +15 ,gameChar_y -30 ,10,10);
        //eyes
        fill(255,255,255);
        ellipse(gameChar_x - 8 ,gameChar_y -55 ,10,10);
        ellipse(gameChar_x +8 ,gameChar_y -55 ,10,10);
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawSun()
{
    stroke(250,197,0);
    strokeWeight(5);
    fill(207,47,13);
    ellipse(80,100,50,50);
}
function drawClouds()
{
        for(var i = 0; i < clouds.length; i++)
        {
            fill(255);
            ellipse(clouds[i].pos_x, clouds[i].pos_y, 55,55);
            ellipse(clouds[i].pos_x + 25, clouds[i].pos_y, 35,35);
            ellipse(clouds[i].pos_x + 45, clouds[i].pos_y,25,25);
        }

}

// Function to draw mountains objects.
function drawMountains()
{
        for(var i = 0; i < mountains.length; i++)
        {
            fill(100);
            triangle(mountains[i].pos_x - mountains[i].height/2 , floorPos_y,
                    mountains[i].pos_x, floorPos_y - mountains[i].height,
                    mountains[i].pos_x + mountains[i].height/2, floorPos_y);
            fill(255,255,255);
              triangle(mountains[i].pos_x , floorPos_y,
                    mountains[i].pos_x, floorPos_y - mountains[i].height,
                    mountains[i].pos_x + mountains[i].height/2, floorPos_y);
        }
}

// Function to draw trees objects.
function drawTrees()
{
        for(var i =0; i< trees_x.length; i++)
        {
            fill(100,50,0);
            rect(75+trees_x[i],-200/2 + floorPos_y,50,200/2);
    
            //branches
            fill(0,100,0);
            triangle(trees_x[i] + 25, -200/2 + floorPos_y,
                    trees_x[i]+ 100, -200 + floorPos_y,
                    trees_x[i] + 175, -200/2 +floorPos_y);
            triangle(trees_x[i] , -200/4 + floorPos_y,
                    trees_x[i]+ 100, -200*3/4 + floorPos_y,
                    trees_x[i] + 200, -200/4 +floorPos_y);
            
        }
}

function drawCollectable(t_collectable)
{
    noFill();
    strokeWeight(6);
    stroke(200,185,0);
    ellipse(t_collectable.x_pos, floorPos_y - t_collectable.size * 0.4, t_collectable.size * 0.8, t_collectable.size * 0.8);
    fill(255,0,255);
    stroke(255);
    strokeWeight(1);
    quad(
        t_collectable.x_pos - t_collectable.size * 0.1, floorPos_y - t_collectable.size * 0.8,
        t_collectable.x_pos - t_collectable.size * 0.2, floorPos_y - t_collectable.size * 1.1,
        t_collectable.x_pos + t_collectable.size * 0.2, floorPos_y - t_collectable.size * 1.1,
         t_collectable.x_pos + t_collectable.size * 0.1, floorPos_y - t_collectable.size * 0.8);
    noStroke();
}


function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size)
        {
            moneySound.play();
            t_collectable.isFound = true;
            console.log('yay');
            game_score += 1;
        }
    
}


function drawCanyon(t_canyons)
{
    fill(50,50,0);
    rect(t_canyons.x_pos, floorPos_y, t_canyons.width, height - floorPos_y);
    fill(139,69,19);
    rect(t_canyons.x_pos-20, floorPos_y, 20, height - floorPos_y);
    fill(139,69,19);
    rect(t_canyons.x_pos+ t_canyons.width, floorPos_y, 20, height - floorPos_y);
}

function checkCanyon(t_canyons)
{
    if(gameChar_world_x < t_canyons.x_pos + t_canyons.width && 
       gameChar_world_x > t_canyons.x_pos &&
       gameChar_y >= floorPos_y)
            {
                fallSound.play();
                console.log('fall');
                isPlummeting = true;
            }
}


function drawFlagpole(t_flagpole)
{
    
    push();
    stroke(180);
    strokeWeight(10);
    line(t_flagpole.x_pos, floorPos_y,
         t_flagpole.x_pos, floorPos_y - flagpole.height);
    pop();
    
    if(t_flagpole.isReached)
        {
            fill(255,210,0);
            rect(t_flagpole.x_pos, floorPos_y - flagpole.height, 60,40);
        }
}

function checkFlagpole(t_flagpole)
    {
        if(dist(gameChar_world_x,0, flagpole.x_pos, 0) < 20)
            {
                t_flagpole.isReached = true;
            }

    }

function createPlatforms(x, y, length)
    {
        var p = {
            x: x,
            y: y,
            length: length,
            draw: function(){
                fill(128,0,0);
                stroke(210,105,30);
                rect(this.x, this.y, this.length, 20);
    },
            
        CheckContact: function(gc_x, gc_y)
            {
                if(gc_x > this.x && gc_x < this.x + this.length)
                    {
                        var d = this.y - gc_y;
                        if(d >= 0 && d < 5)
                            {
                            return true;
                            }
                        
                        return false;
                    }
            }   
                }
        return p;
    }

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 10;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
            {
                this.inc = -10;
            }
        else if(this.currentX < this.x)
            {
                this.inc = 10;
            }
    }
    
    this.draw = function()
    {
        this.update();
        fill(0,0,0)
        rect(this.currentX, this.y, 20, 20);
        triangle(this.currentX, this.y - 5,this.currentX, this.y +25,this.currentX -30, (this.y + floorPos_y)/2 - 2.5)
        triangle(this.currentX + 20, this.y - 5,this.currentX+20, this.y +25,this.currentX +50, (this.y + floorPos_y)/2 - 2.5)
    }
    
    this.checkContact = function(gc_x, gc_y)
        {
            var d = dist(gc_x, gc_y, this.currentX, this.y)
        
            if(d < 40)
                {
                    swordSound.play();
                    return true;
                }
        
            return false;
        }
}