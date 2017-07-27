//TODO: Selective KD tree update rates. 
//Rationalize variable speeds.
//Resources
//Reproduction
//Genetics

var treePopulation = [];
var harvesterPopulation = [];
var predatorPopulation = [];
var dead = [];
var resources = []; // add to loop

var distance = function(a, b){
  return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2);
  }
var harvesterKDTree = new kdTree([], distance, ["x","y"]);
var predatorKDTree = new kdTree([], distance, ["x","y"]);
var treeKDTree = new kdTree([], distance, ["x","y"]);
var deadKDTree = new kdTree([], distance, ["x","y"]);
var drawTimer = 0;


function setup() {
  createCanvas(1910, 940);
  //stroke(255);
  noStroke();
  fill(255);
  background(0);
  for(var i = 0; i < 50;++i)
  {
    treePopulation[i] = new Tree(random(width),random(height));
  }
  for(var j = 0; j < 30;++j)
  {
    harvesterPopulation[j] = new Harvester(random(width),random(height));
  }
  for(var k = 0; k < 10;++k)
  {
    predatorPopulation[k] = new Predator(random(width),random(height));
  }
  //ellipseMode(CENTER);

}
var populateKDTrees = function()
{
  harvesterKDTree = new kdTree([], distance, ["x","y"]);
  predatorKDTree = new kdTree([], distance, ["x","y"]);
  treeKDTree = new kdTree([], distance, ["x","y"]);
  deadKDTree = new kdTree([], distance, ["x","y"]);
  for(var i = 0; i < harvesterPopulation.length; ++i)
  {
    harvesterKDTree.insert({itself: harvesterPopulation[i], x:harvesterPopulation[i].pos.x, y:harvesterPopulation[i].pos.y});
  }
  for(var i = 0; i < predatorPopulation.length; ++i)
  {
    predatorKDTree.insert({itself: predatorPopulation[i], x:predatorPopulation[i].pos.x, y:predatorPopulation[i].pos.y});
  }
  for(var i = 0; i < treePopulation.length; ++i)
  {
    treeKDTree.insert({itself: treePopulation[i], x:treePopulation[i].pos.x, y:treePopulation[i].pos.y});
  }
  for(var i = 0; i < dead.length; ++i)
  {
    deadKDTree.insert({itself: dead[i], x:dead[i].pos.x, y:dead[i].pos.y});
  }
}
function draw() {
  background(0);

  //if(drawTimer % 100 == 0)
  populateKDTrees();
 

  for(var i = treePopulation.length - 1; i >= 0; --i)
  {
    treePopulation[i].update();
    treePopulation[i].display();
    if(!treePopulation[i].alive)
    {
       treePopulation.splice(i,1);
    }
  }
  
  for(var j = harvesterPopulation.length - 1; j >= 0; --j)
  {
    harvesterPopulation[j].update();
    harvesterPopulation[j].display();
    //harvesterPopulation[j].x = harvesterPopulation[j].pos.x;
    //harvesterPopulation[j].y = harvesterPopulation[j].pos.y;

    if(!harvesterPopulation[j].alive)
    {
       harvesterPopulation.splice(j,1);
    }
  }

  for(var k = predatorPopulation.length - 1; k >= 0; --k)
  {
    predatorPopulation[k].update();
    predatorPopulation[k].display();
    if(!predatorPopulation[k].alive)
    {
       predatorPopulation.splice(k,1);
    }
  }

  for(var l = dead.length - 1; l >= 0; --l)
  {
    dead[l].update();
    dead[l].display();
    if(!dead[l].exists)
    {
       dead.splice(l,1);
    }
  }
  
  ++drawTimer;
  // for(var l = resources.length - 1; l >= 0; --l)
  // {
  //   resources[l].update();
  //   resources[l].display();
  //   if(!resources[l].exists)
  //   {
  //      resources.splice(l,1);
  //   }
  // }
}

function mousePressed() {
  if(mouseButton == LEFT)
    treePopulation[treePopulation.length] =  new Tree(mouseX,mouseY);
  if(mouseButton == RIGHT)
    harvesterPopulation[harvesterPopulation.length] = new Harvester(mouseX,mouseY);
  //ellipse(mouseX, mouseY, 5, 5);
  // prevent default
  return false;
}

function keyPressed() {
  if (key == "P") {
    predatorPopulation[predatorPopulation.length] =  new Predator(mouseX,mouseY);
  }
}