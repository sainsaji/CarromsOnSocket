//Class Imports
//import {Line} from './line.js';

//config
const framerate = 60;
//canvas 


//Array Objects
let holeArray = [];
let lineArray = [];
let dPanelArray = [];
let puckArray =[];

//Mouse Config
let mouseVelocity;

//Player Change
let midPointArray = [75,(400-75)];
let pos =0;

//strickerpos


class Line
{
    constructor(x1,y1,x2,y2,color)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2,
        this.y2 = y2;
        this.color = color;
    }
    display()
    {
        fill(this.color);
        line(this.x1,this.y1,this.x2,this.y2);
    }
}

class Disk
{
    constructor(x,y,size,color)
    {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    display()
    {
        fill(this.color);
        circle(this.x,this.y,this.size);
    }
}

class Pucks extends Disk
{
    constructor(x,y,size,color)
    {
        super(x,y,size,color);
    }
}

let disable = true;

class Stricker extends Disk
{
    constructor(x,y,size,color)
    {
        super(x,y,size,color); 
    }

    getCurrentXPos()
    {
        return this.x;
    }

    getCurrentYPos()
    {
        return this.y;
    }

    moveAlongMouse()
    {
        if(disable)
        {
            this.x = mouseX;
            this.y = mouseY;
            if(mouseX>=400)
            {
                this.x =400-(this.size/2);
                disable = false;
            }
            //left boundary
            if(mouseX<=(this.size)/2)
            {
                this.x = (this.size)/2;
            }
        }
        if(mouseX<400)
        {
            disable = true;
        }

        //Top Boundary
        if(this.y<(this.size)/2)
        {
            this.y = (this.size)/2;
        }

        //Bottom Boundary
        if(this.y>(400-(this.size)/2))
        {
            this.y = 400-((this.size)/2);
        }
      
    }
    

}

class Holes extends Disk
{
    constructor(x,y)
    {
        super(x,y,28,color(0,0,0)); 
    }

    
}

class DebugPanel
{
    x = 0;
    y = 0;
    prevX = 0;
    prevY = 0;
    velocity = 0;
    constructor()
    {

    }

    displayTitle(fontsize,fontname)
    {
        textSize(fontsize);
        textFont(fontname);
        text('Debug Panel', 550, 15);        
    }

    displayMousePos(fontsize,fontname)
    {
        textFont(fontname);
        textSize(fontsize);
        if((mouseX>=0 && mouseX<=400)&&(mouseY>=0 && mouseY<=400))
        {
            text("Mouse-X: "+mouseX, 420, 40);
            text("Mouse-Y: "+mouseY, 420, 60);
        }
        else
        {
            text("Mouse-X: NA",420, 40);
            text("Mouse-Y: NA",420, 60);
        }
        
    }

    squareMidPoint(cordinate,length)
    {
        return cordinate+(length/2);
    }

    displayFPS(fontsize,fontname)
    {
        fill(color('green'));
        textSize(fontsize);
        text(parseInt(frameRate()),this.squareMidPoint(750,25)-8, this.squareMidPoint(30,25)+4);
        noFill();
        square(750, 30, 25);
    }

    displayMouseVelocity(fontsize,fontname)
    {
        this.x = mouseX;
        this.y = mouseY;
        this.velocity = round((dist(this.x,this.y,this.prevX,this.prevY)/deltaTime)*1000);
        mouseVelocity = this.velocity;
        fill(color('black'));
        textSize(fontsize);
        textFont(fontname);
        text("Mouse-V: "+this.velocity, 420, 80);
        this.prevX = this.x;
        this.prevY = this.y;
    }

    displayStrickerPos(fontsize,fontname)
    {
        textFont(fontname);
        textSize(fontsize);
        text("Stricker-X: "+strickerDisk.x, 420, 100);
        text("Stricker-Y: "+strickerDisk.y, 420, 120);
    }
}



function createHoles(offset)
{
    for (let x of [offset, 400-offset]) {
        for (let y of [10, 400-offset]) {
          holeArray.push(new Holes(x, y));
        }
      }
}

function displayHoles()
{
    for(let i = 0;i<holeArray.length;i++)
    {
        let hole = holeArray[i];
        hole.display();
    }
}

function createLines(leftOffset)
{
    let white = color('white');
    //Top
    lineArray.push(new Line(leftOffset,leftOffset,400-leftOffset,leftOffset,white));
    //Bottom
    lineArray.push(new Line(leftOffset,400-leftOffset,400-leftOffset,400-leftOffset,white));
    //Left
    lineArray.push(new Line(leftOffset,leftOffset,leftOffset,400-leftOffset,white));
    //Right
    lineArray.push(new Line(400-leftOffset,leftOffset,400-leftOffset,400-leftOffset,white));
    //boundary
    lineArray.push(new Line(400,0,400,400,white));
}

function displayLines()
{
    for(let i = 0;i<lineArray.length;i++)
    {
        let line = lineArray[i];
        line.display();
    }
}



//Switch Player Action
function onSwitchButtonClicked()
{   
    strickerDisk.x = midPointArray[pos];
    console.log(pos);
    pos++;
    if(pos>1)
    {
        pos=0;
    }
}

//Create Pucks

function createPucks()
{
    puckArray.push(new Pucks(400/2,400/2,13,color('green')));
}

function displayPucks()
{
    for(let i = 0;i<puckArray.length;i++)
    {
        let puck = puckArray[i];
        puck.display();
    }
}
let switchPlayer;
function setup() 
    {
    //color config
    let white = color('white');
    createCanvas(800, 400);
    frameRate(frameRate);
    strickerDisk = new Stricker(400/2,400/2,20,white);
    createHoles(offset = 10);
    createLines(leftOffset = 75);
    createPucks();
    dPanelArray.push(new DebugPanel());
    //switch player button
    switchPlayer = createButton('Switch Player');
    switchPlayer.position(710, 80);
    switchPlayer.mousePressed(onSwitchButtonClicked);
    }

    
    
  
  function draw() 
  {
    background(220);
    displayLines();
    strickerDisk.display();
    strickerDisk.moveAlongMouse();
    displayHoles();
    displayPucks(); 
    dPanelArray[0].displayTitle(fontsize=20,fontname='Helvetica');
    dPanelArray[0].displayMousePos(fontsize=10,fontname='Helvetica');
    dPanelArray[0].displayFPS(fontsize=15);
    dPanelArray[0].displayMouseVelocity(fontsize=10,fontname='Helvetica');
    dPanelArray[0].displayStrickerPos(fontsize=10,fontname = 'Helvetica');  
  }