// Bastien Sarolea
// Multi Dimensional Poisson Disc Sampling
// From the basic mono dimensional Poisson Disc Sampling from Daniel Shiffman
// Daniel Shiffman
// Code for this video: https://youtu.be/flQgnCUxHlw (edited for multi dimensions)

var r = 10;
var k = 100;  
var grid = [];
var w = r / Math.sqrt(2);
var active = [];
var unactive = [];
var cols, rows;
var ordered = [];
var MULTIDIMENSIONAL_NUMBER = 6;

function setup() {
    createCanvas(400, 400);
    background(0);
    strokeWeight(10);
    colorMode(HSB);

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
    
    var sample = { pos: posW, weight:floor(random(1,3))};
    grid[i + j * cols] = sample;
    active.push(sample);
    frameRate(1000);
}

function draw() {
    background(255);
    if (active.length > 0) {
        var randIndex = floor(random(active.length));
        var curActiveSample = active[randIndex];
        var curPos = active[randIndex].pos;
        var found = false; 

        for(var n=0; n<k ; n++){
            var pos = p5.Vector.random2D();
            var weight = floor(random(1,MULTIDIMENSIONAL_NUMBER+1));
            var m = random(1*r, (MULTIDIMENSIONAL_NUMBER)*r); // here we choose the next disc weight/size randomly from 1 to max size
            pos.setMag(m);
            pos.add(curActiveSample.pos);
            var sample = {pos : pos, weight : weight};
            var col = floor(sample.pos.x / w);
            var row = floor(sample.pos.y / w);

            if (
                col > -1 &&
                row > -1 &&
                col < cols &&
                row < rows &&
                !grid[col + row * cols]
            ) {
                var ok = true;
                for (var i = -MULTIDIMENSIONAL_NUMBER; i <= MULTIDIMENSIONAL_NUMBER; i++) {
                    for (var j = -MULTIDIMENSIONAL_NUMBER; j <= MULTIDIMENSIONAL_NUMBER; j++) {
                        var index = col + i + (row + j) * cols;
                        var neighbor = grid[index];
                        if (neighbor) {
                            var d = p5.Vector.dist(sample.pos, neighbor.pos);
                            var maxWeight = (sample.weight > neighbor.weight)? sample.weight : neighbor.weight;
                            if(d <  maxWeight * r){
                                ok = false;
                            }
                        }
                    }
                }
                if (ok) {
                    found = true;
                    grid[col + row * cols] = {pos: sample.pos, weight: sample.weight};
                    active.push({pos: sample.pos, weight: sample.weight});
                    // Should we break?
                    //break;
                }
            }

            
        }
        
        if (!found) {
            unactive.push(active[0]);
            active.splice(0, 1);
        }
    }


    for (var i = 0; i < active.length; i++) {
        stroke(0, 0, 0);
        strokeWeight(2);
        point(active[i].pos.x, active[i].pos.y);
    }
    for(var i=0; i<=MULTIDIMENSIONAL_NUMBER; i++){
        stroke(i*10, i*50, i*50); 
        strokeWeight(i*10);
        for(var j=0;j<unactive.length;j++){
            if(unactive[j].weight==i){
                point(unactive[j].pos.x, unactive[j].pos.y);
            }    
        }
    }

    console.log(active.length);
}
