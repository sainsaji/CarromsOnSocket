//Class Imports
//import {Line} from './line.js';

//config
const framerate = 60;
//canvas 


//Array Objects
let holeArray = [];
let lineArray = [];
let dPanelArray = [];

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

class Stricker extends Disk
{
    constructor(x,y,size,color)
    {
        super(x,y,size,color); 
    }

    moveAlongMouse()
    {
      this.x = mouseX;
      this.y = mouseY;
    }

    snapToMouseClick()
    {
        
    }
    snapToLine()
    {
        if(this.x==holeArray[3].x)
        {
            this.x = x;
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
    constructor()
    {

    }

    displayTitle()
    {
        textFont('Helvetica');
        text('Debug Panel', 600, 15);
    }

    displayMousePos()
    {
        textFont('Helvetica');
        text("Mouse-X: "+mouseX, 420, 40);
        text("Mouse-Y: "+mouseY, 420, 60);
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
    lineArray.push(new Line(leftOffset,leftOffset,400-leftOffset,leftOffset,white));
    lineArray.push(new Line(leftOffset,400-leftOffset,400-leftOffset,400-leftOffset,white));
    lineArray.push(new Line(leftOffset,leftOffset,leftOffset,400-leftOffset,white));
    lineArray.push(new Line(400-leftOffset,leftOffset,400-leftOffset,400-leftOffset,white));
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



function setup() 
    {
    //color config
    let white = color('white');
    createCanvas(800, 400);
    frameRate(frameRate);
    console.log("Running on"+frameRate()+" fps");
    strickerDisk = new Stricker(400/2,400/2,20,white);
    createHoles(offset = 10);
    createLines(leftOffset = 75);
    dPanelArray.push(new DebugPanel())
    }
  
  function draw() 
  {
    background(220);
    displayLines();
    strickerDisk.display();
    //strickerDisk.moveAlongMouse();
    displayHoles();
    dPanelArray[0].displayTitle();
    dPanelArray[0].displayMousePos();
  }