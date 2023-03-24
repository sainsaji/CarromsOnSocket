/*
^ configuration variables
*/
const frameRate = 60;


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

//slider config
var sliderRelease = false;

//drag angle config
var angleActivate = false;
var storedAngle;

//strickerpos
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

let disable = false;

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
        if(disable==false)
        {
            this.x = mouseX;
            this.y = mouseY;
            if(mouseX>=400)
            {
                this.x =400-(this.size/2);
            }
            //left boundary
            if(mouseX<=(this.size)/2)
            {
                this.x = (this.size)/2;
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
        if(mouseX>400&&mouseY>400)
        {
            disable = true;
        }
    }
}

let angle = 0;
class DragAngle
{
    constructor(color)
    {
        this.color = color;
    }

    displayDragAngle()
    {
        if(angleActivate)
        {
            fill(this.color);
            // Calculate the midpoint of the line
            let midX = (strickerDisk.x + strickerDisk.x) / 2;
            let midY = ((strickerDisk.y+20) + (strickerDisk.y-20)) / 2;
            // Rotate the line around its midpoint
            push();
            translate(midX, midY);
            rotate(angle);
            line(strickerDisk.x - midX, (strickerDisk.y+20)- midY, strickerDisk.x - midX, (strickerDisk.y-20) - midY);
            fill(color('purple'));
            circle(strickerDisk.x - midX, (strickerDisk.y-20) - midY,10);
            pop();
            // Increment the angle
            let customMouseX = constrain(mouseX, 0, 400);
            
            angle = map(customMouseX, 0, width/2, PI/2, -PI/2);
            sliderRelease = false;
        }
        if(!angleActivate)
        {
            fill(this.color);
            // Calculate the midpoint of the line
            let midX = (strickerDisk.x + strickerDisk.x) / 2;
            let midY = ((strickerDisk.y+20) + (strickerDisk.y-20)) / 2;
            // Rotate the line around its midpoint
            push();
            translate(midX, midY);
            rotate(storedAngle);
            line(strickerDisk.x - midX, (strickerDisk.y+20)- midY, strickerDisk.x - midX, (strickerDisk.y-20) - midY);
            fill(color('purple'));
            circle(strickerDisk.x - midX, (strickerDisk.y-20) - midY,10);
            pop();
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

function mapRange(value, a, b, c, d) 
{
    return (value - a) * (d - c) / (b - a) + c;
}


class Slider 
{
    
    constructor(x,y,x1,y1,width,height,color)
    {
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
        this.width = width;
        this.height = height;
        this.color = color;
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
        this.squareDragged = false;
    }

    displaySlider()
    {
        fill(this.color)
        rect(this.x,this.y,this.width,this.height);
    }

    displaySliderSquare()
    {
        fill(color('green'));
        square(this.x1,this.y1,20);
    }

    mousePressed() 
    {
        if (mouseX >= this.x1 && mouseX <= this.x1 + 20 && mouseY >= this.y1 && mouseY <= this.y1 + 20) 
        {
          this.mouseOffsetX = mouseX - this.x1;
          this.mouseOffsetY = mouseY - this.y1;
          this.squareDragged = true;
        }
        if(this.squareDragged)
        {
            angleActivate = false;
        }
    }
      
      mouseDragged() 
      {
        if (this.squareDragged) 
        {
            this.x1 = mouseX - this.mouseOffsetX;
            if(this.x1<=this.x)
            {
                this.x1 = this.x;
            }
            if(this.x1>=(400-75-20))
            {
                this.x1 = 400-75-20;
            }
            strickerDisk.x = this.x1+10;
        }
      }
      
      mouseReleased() 
        {
            if (this.squareDragged) 
            {
            this.squareDragged = false;
            sliderRelease = true;
            angleActivate = true;
            }
            
        }
}

class PowerCircle
{
    constructor()
    {
        this.colors = {
            green: color('green'),
            yellow: color('yellow'),
            red: color('red')
        }
    }

    displayPowerCircle()
    {
        var powVal = mapRange(sliderB.getPowerVal(),0,100,0,80);
        noFill();
        if(powVal>=0&&powVal<=25)
        {
            stroke(this.colors.green);
        }
        else if(powVal>25&&powVal<=50)
        {
            stroke(this.colors.yellow);
        }
        else
        {
            stroke(this.colors.red);
        }
        circle(strickerDisk.x,strickerDisk.y,strickerDisk.size+powVal);
        stroke('black');
    }
}

class PowerSlider extends Slider
{
    constructor(x,y,x1,y1,width,height,color)
    {
        super(x,y,x1,y1,width,height,color);
        this.powerval = 0;
    }
    displaySliderSquare()
    {
        fill(color('red'));
        square(this.x1,this.y1,20);
    }
    mousePressed() 
    {
        if (mouseX >= this.x1 && mouseX <= this.x1 + 20 && mouseY >= this.y1 && mouseY <= this.y1 + 20) 
        {
          this.mouseOffsetX = mouseX - this.x1;
          this.mouseOffsetY = mouseY - this.y1;
          this.squareDragged = true;
        }
    }
      
      mouseDragged() 
      {
        if (this.squareDragged) 
        {
            this.x1 = mouseX - this.mouseOffsetX;
            if(this.x1<=this.x)
            {
                this.x1 = this.x;
            }
            if(this.x1>=(400-75-20))
            {
                this.x1 = 400-75-20;
            } 
        }
      }
      
      mouseReleased() 
        {
            if (this.squareDragged) 
            {
            this.squareDragged = false;
            }
            
        }
    getPowerVal()
    {
        this.powerval = mapRange(this.x1,75,305,0,100);
        return this.powerval;
    }

}
class BooleanLights
{

    green = color('green');
    constructor(x,y,radius)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        // this.red = color('red');
        // this.green = color('green');
        this.colors ={
            red: color('red'),
            green: color('green')
        }
    }
    drawLights(booleanVal)
    {
        fill(this.colors[booleanVal? 'green':'red']);
        circle(this.x,this.y,this.radius);
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
        this.b1 = new BooleanLights(500,236,5);
        this.b2 = new BooleanLights(500,253,5);
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

    displayDragAngle()
    {
        text("Drag Angle: "+mapRange(angle,-1.57,+1.57,0,180), 420, 140);
    }

    displayPowerVal()
    {
        text("Power Value: "+sliderB.getPowerVal(), 420, 160);
    }
    booleanStateDisplay()
    {
        noFill();
        rect(420,220,375,150);  
        this.b1.drawLights(sliderRelease);
        this.b2.drawLights(angleActivate);
        fill(color('black'))
        text("Slider Release ", 425, 240);
        text("Angle Activate ", 425, 256);
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
    strickerDisk.y = midPointArray[pos];
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




function setup() 
    {
    //color config
    let white = color('white');
    let blue = color('blue');
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
    //Slider Controls
    sliderA = new Slider(75,360,75,360-5,(400-(75*2)),10,color('blue'));
    sliderB = new PowerSlider(75,380,75,360+15,(400-(75*2)),10,color('purple'));
    dragAngle = new DragAngle(color('green'));
    powerCircle = new PowerCircle();
    }

    
    
  
  function draw() 
  {
    background(220);
    displayLines();
    strickerDisk.display();
    //strickerDisk.moveAlongMouse();
    displayHoles();
    displayPucks(); 
    dPanelArray[0].displayTitle(fontsize=20,fontname='Helvetica');
    dPanelArray[0].displayMousePos(fontsize=10,fontname='Helvetica');
    dPanelArray[0].displayFPS(fontsize=15);
    dPanelArray[0].displayMouseVelocity(fontsize=10,fontname='Helvetica');
    dPanelArray[0].displayStrickerPos(fontsize=10,fontname = 'Helvetica');  
    dPanelArray[0].displayDragAngle();  
    dPanelArray[0].booleanStateDisplay();
    dPanelArray[0].displayPowerVal();
    sliderA.displaySlider();
    sliderB.displaySlider();
    sliderA.displaySliderSquare();
    sliderB.displaySliderSquare();
    dragAngle.displayDragAngle();
    powerCircle.displayPowerCircle();
  }

  
  function mousePressed()
  {
    sliderA.mousePressed();
    sliderB.mousePressed();
    storedAngle = angle;
    console.log(storedAngle);
    angleActivate = false;
  }

  function mouseReleased()
  {
    sliderA.mouseReleased();
    sliderB.mouseReleased();
  }

  function mouseDragged()
  {
    sliderA.mouseDragged();
    sliderB.mouseDragged();
  }