function Tree(posX, posY)
{
  this.pos = createVector(posX, posY);
  this.size = 40;
  this.alive = true;
  this.health = 10;
  this.timeAlive = Math.floor(random(0,100));
  this.maxSize = 100;
  this.fertilePoint = this.maxSize/2;
  this.growPeriod = 300;
  this.range = 20000;
  this.id = makeid();

  this.grow = function()
  {
    if(this.size < this.maxSize)
      this.size++;
    if(this.health < this.size)
    {
      this.health+=this.size/10; 
    }
  }

  this.update = function()
  {
    this.timeAlive++;
    if(this.health <= 0)
      this.alive = false;
    else
    {
      if(this.timeAlive%this.growPeriod == 0){
        this.grow();
        if(this.fertilePoint < this.size && Math.random() > .5)
          this.reproduce();
        //this.health--;
      }
    }
  }

  this.reproduce = function()
  {
    var neighbor = this.findTargetKD(treeKDTree);
    if(neighbor)
    {
      var random = Math.sqrt(Math.random());
      var newTreePos = createVector(random*cos(2 * 3.1415 * Math.random()), random*sin(2 * 3.1415 * Math.random()));
      newTreePos.mult(90);
      newTreePos.x += this.pos.x; newTreePos.y += this.pos.y;
      if(newTreePos.x > width || newTreePos.x < 0 || newTreePos.y > height || newTreePos.y < 0)
        return;
      var closeTrees = treeKDTree.nearest({x:newTreePos.x, y:newTreePos.y}, 1, 1000);
      if(!closeTrees.length)
        this.produceTree(newTreePos);
    }
  }

  this.display= function()
  {
    fill("brown");
    rect(this.pos.x-this.size/6, this.pos.y - this.size, this.size/3, this.size);
    fill("green");
    triangle(this.pos.x - this.size/3, this.pos.y - this.size/3, this.pos.x + this.size/3, this.pos.y - this.size/3, this.pos.x, this.pos.y - this.size*2);
  }

  this.produceTree = function(pos)
  {
    //Do genetic work here
    treePopulation[treePopulation.length] =  new Tree(pos.x, pos.y);
  }

  this.findTargetKD = function(tree)
  {
    // Query the nearest *count* neighbours to a point, with an optional
    // maximal search distance.
    // Result is an array with *count* elements.
    // Each element is an array with two components: the searched point and
    // the distance to it.
    var temp = tree.nearest({x: this.pos.x, y: this.pos.y}, 2,this.range);
    if (temp.length > 1)
      return temp[1][0].itself;
  }
}