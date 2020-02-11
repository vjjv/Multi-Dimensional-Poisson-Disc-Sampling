// Bastien Sarolea
// Multi Dimensional Poisson Disc Sampling
// From the basic mono dimensional Poisson Disc Sampling from Daniel Shiffman
// Daniel Shiffman
// Code for this video: https://youtu.be/flQgnCUxHlw (edited for multi dimensions)

var r = 10;
var k = 30;  
var grid = [];
var w = r / Math.sqrt(2);
var active = [];
var discLog = [];
var unactive = [];
var cols, rows;
var ordered = [];
var tryed = [];
var MULTIDIMENSIONAL_NUMBER = 6;
var SPAWNING_DISTANCE = MULTIDIMENSIONAL_NUMBER*2;
var SEARCHING_DISTANCE = SPAWNING_DISTANCE+1;
var DRAWING_SIZE = 5;
var play=true;
var firsttime=true;

function setup() {
    createCanvas(400, 400);
    background(0);
    strokeWeight(10);
    colorMode(HSB);
    background(255);
    

    cols = floor(width / w);
    rows = floor(height / w);
    for (var i = 0; i < cols * rows; i++) { 
        grid[i] = undefined;
    }

    var x = random(width);
    var y = random(height);
    var j = floor(y / w);
    var i = floor(x / w);
    var posW = createVector(x, y);
    if(firsttime){
        var sample = { pos: posW, weight:floor(random(1,MULTIDIMENSIONAL_NUMBER+1))};
        grid[i + j * cols] = sample;
        active.push(sample);
        firsttime=false;
    }
    
    frameRate(30);
    //noLoop();
}



function mousePressed() {
    loop();
  }
  
  function mouseReleased() {
    noLoop();
  }

function isValid(sample, col, row){
    discLog.push({text:'w:'+sample.weight+'\np:'+col+';'+row, x: sample.pos.x, y: sample.pos.y})
    for (var i = -SEARCHING_DISTANCE; i <= SEARCHING_DISTANCE; i++) {
        for (var j = -SEARCHING_DISTANCE; j <= SEARCHING_DISTANCE; j++) {
            var index = col + i + (row + j) * cols;
            /*console.log('debug clo i row j',floor(sample.pos.x/w), floor(sample.pos.y/w),col+i, row+j)
            stroke(255,0,0)
            strokeWeight(.1)
            line(sample.pos.x, sample.pos.y, (col+i)*w+w/2, (row+j)*w+w/2)*/
            
            var neighbor = grid[index];
            if (neighbor) {
                var d = p5.Vector.dist(sample.pos, neighbor.pos);
                var maxWeight = (sample.weight > neighbor.weight)? sample.weight : neighbor.weight;
                var minWeight = (sample.weight < neighbor.weight)? sample.weight : neighbor.weight;
                var totaleDist = sample.weight*r + neighbor.weight*r;
                // if(d < (maxWeight)*r){
                if(d < sample.weight*r + neighbor.weight*r ){
                    tryed.push(sample);
                    return false;//ok = false;
                    // discLog.push({text:floor(d)+'>'+totaleDist+'\ns:'+sample.weight+'\nn:'+neighbor.weight, x: sample.pos.x, y: sample.pos.y, toX: neighbor.pos.x, toY: neighbor.pos.y})
                }
            }
            
            
        }
    }
    return true;
}

function draw() {
    //noLoop();
    //setTimeout(()=>{noLoop();},500)
    if (active.length > 0) {
        var randIndex = floor(random(active.length));
        var curActiveSample = active[0]//active[randIndex];
        var curPos = active[randIndex].pos;
        var found = false; 

        for(var n=0; n<k ; n++){
            var pos = p5.Vector.random2D();
            var sampleWeight = floor(random(1,MULTIDIMENSIONAL_NUMBER+1));
            var m = random( curActiveSample.weight * r + sampleWeight *r , SPAWNING_DISTANCE* r); // here we choose the next disc weight/size randomly from 1 to max size
            /*if(n>k/1000){
                sampleWeight=1;
                m = random( curActiveSample.weight * r , SPAWNING_DISTANCE* r);
            }*/
            
            pos.setMag(m);
            pos.add(curActiveSample.pos);
            var sample = {pos : pos, weight : sampleWeight};
            var col = floor(sample.pos.x / w);
            var row = floor(sample.pos.y / w);
            console.log('floorx? ', sample.pos.x, '/',w,'=',floor(sample.pos.x / w))
            console.log('floory? ', sample.pos.y, '/',w,'=',floor(sample.pos.y / w))

            if (
                col > -1 &&
                row > -1 &&
                col < cols &&
                row < rows &&
                !grid[col + row * cols]
            ) {
                var ok = true;
                if(isValid(sample, col, row)){
                    found = true;
                    grid[col + row * cols] = sample;
                    active.push(sample);
                    // Should we break?
                    break;
                }

                
            }

            
        }
        
        if (!found) {
            unactive.push(active[0]);
            active.splice(0, 1);
        }
    }
    
    for (var i = 0; i < tryed.length; i++) {
        stroke(90);
        strokeWeight(0.5);
        circle(tryed[i].pos.x, tryed[i].pos.y, tryed[i].weight*r*2);
        point(tryed[i].pos.x, tryed[i].pos.y);
    } 
    for (var i = 0; i < active.length; i++) {
        stroke(60);
        strokeWeight(1);
        circle(active[i].pos.x, active[i].pos.y, active[i].weight*r*2);
        point(active[i].pos.x, active[i].pos.y);
    }
    for(var i=0; i<=MULTIDIMENSIONAL_NUMBER; i++){
        stroke(i*10, i*50, i*50); 
        strokeWeight(i);
        for(var j=0;j<unactive.length;j++){
            if(unactive[j].weight==i){
                circle(unactive[j].pos.x, unactive[j].pos.y, unactive[j].weight*r*2);
                point(unactive[j].pos.x, unactive[j].pos.y);
            }    
        }
    }
    /*for (var i = 0; i < discLog.length; i++) {
            stroke(255,0,0)
            strokeWeight(0.1)
            line(discLog[i].x,discLog[i].y,discLog[i].toX,discLog[i].toY)
            stroke(100)
            textSize(10)
            text(discLog[i].text,discLog[i].x,discLog[i].y);
            //discLog.splice(i-1,1);
    } */

    // for(var j=0;j<unactive.length;j++){
    //     switch (unactive[j].weight) {
    //         case 1:
    //             stroke(unactive[j].weight*10, unactive[j].weight*50, unactive[j].weight*50);
    //             strokeWeight(6);
    //             point(unactive[j].pos.x, unactive[j].pos.y);
    //         break;
    //         case 2:
    //             stroke(unactive[j].weight*10, unactive[j].weight*50, unactive[j].weight*50);
    //             strokeWeight(7.5);
    //             point(unactive[j].pos.x, unactive[j].pos.y);
    //         break;
    //         case 3:
    //             stroke(unactive[j].weight*10, unactive[j].weight*50, unactive[j].weight*50);
    //             strokeWeight(8);
    //             point(unactive[j].pos.x, unactive[j].pos.y);
    //         break;
    //         case 4:
    //             stroke(unactive[j].weight*10, unactive[j].weight*50, unactive[j].weight*50);
    //             strokeWeight(18);
    //             point(unactive[j].pos.x, unactive[j].pos.y);
    //         break;
    //         case 5:
    //             stroke(unactive[j].weight*10, unactive[j].weight*50, unactive[j].weight*50);
    //             strokeWeight(21);
    //             point(unactive[j].pos.x, unactive[j].pos.y);
    //         break;
    //         case 6:
    //             stroke(unactive[j].weight*10, unactive[j].weight*50, unactive[j].weight*50);
    //             strokeWeight(25);
    //             point(unactive[j].pos.x, unactive[j].pos.y);
    //         break;
        
        
    //         default:
    //             break;
    //     }
        // for(var j=0;j<unactive.length;j++){
        //     switch (unactive[j].weight) {
        //         case 1:
        //             stroke(unactive[j].weight*10, unactive[j].weight*50, unactive[j].weight*50);
        //             strokeWeight(3);
        //             point(unactive[j].pos.x, unactive[j].pos.y);
        //         break;
        //         case 2:
        //             stroke(unactive[j].weight*10, unactive[j].weight*50, unactive[j].weight*50);
        //             strokeWeight(10);
        //             point(unactive[j].pos.x, unactive[j].pos.y);
        //         break;
        //         case 3:
        //             stroke(unactive[j].weight*10, unactive[j].weight*50, unactive[j].weight*50);
        //             strokeWeight(15);
        //             point(unactive[j].pos.x, unactive[j].pos.y);
        //         break;
        //         case 4:
        //             stroke(unactive[j].weight*10, unactive[j].weight*50, unactive[j].weight*50);
        //             strokeWeight(20);
        //             point(unactive[j].pos.x, unactive[j].pos.y);
        //         break;
        //         case 5:
        //             stroke(unactive[j].weight*10, unactive[j].weight*50, unactive[j].weight*50);
        //             strokeWeight(25);
        //             point(unactive[j].pos.x, unactive[j].pos.y);
        //         break;
        //         case 6:
        //             stroke(unactive[j].weight*10, unactive[j].weight*50, unactive[j].weight*50);
        //             strokeWeight(30);
        //             point(unactive[j].pos.x, unactive[j].pos.y);
        //         break;
            
            
        //         default:
        //             break;
        //     }
        //}

    console.log('active length',active.length);
    for (var x = 0; x < width; x += w) {
		for (var y = 0; y < height; y += w) {
			stroke(90);
			strokeWeight(.05);
			line(x, 0, x, height);
			line(0, y, width, y);
		}
	}
    
}
