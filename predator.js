//TODO: Add better wandering. Use density function/visited areas.
//Damage effectiveness
//Variables > Magic numbers. 

function Predator(posX, posY){
  this.weight = .5;
  this.speed = 10;
  this.maxHealth = this.weight * 100;
  this.health = this.maxHealth; //50
  this.inventory = [];
  this.target = 1;
  this.width = this.weight * 50;
  this.height = this.weight * 50;
  this.timeAlive = Math.floor(random(0,100));
  this.alive = true;
  this.kills = 0;
  this.sprint = .4;
  this.normalSpeed = 0.2;
  this.walkSpeed = .1;
  this.hunger = 0;
  this.range = 50000;
  this.wandir = createVector(0,0);
  this.pos = createVector(posX, posY);
  this.dir = createVector(0,0);
  
  //TODO ADD RANGE - Linear search not optimal kdTree improves speed.
  //Not in use.
  this.findTargetLinear = function(population)
  {
      var closestDistance = 10000000000;
      var closestThing = null;
      var dist = 0;
      for(var i = 0;i<population.length;++i)
      {
        dist = this.distSqrd(population[i]);
        if(dist < closestDistance)
        {
          closestThing = population[i];
          closestDistance = dist;
        }
      }
      return closestThing;
  }

  this.traverse = function(target, speedModifier)
  {
      this.dir.set(target.pos.x - this.pos.x, target.pos.y - this.pos.y);
      this.dir.normalize();
      this.dir.mult(this.speed * speedModifier);
      this.pos.add(this.dir);
  }
  
  this.attack = function(organism)
  {
    if (this.distSqrd(organism) > this.width*this.width)
    {
      this.traverse(organism, this.sprint);
    }
    else
    {
      if(this.timeAlive % 10 == 0)
      {
        organism.health--; 
        if(organism.health <=0)
        {
          this.kills++;
          this.target = null;
        }
      }
    }
  }

  this.eat = function(consumable)
  {
    if (this.distSqrd(consumable) > this.width*this.width)
    {
      this.traverse(consumable, this.normalSpeed);
    }
    else
    {
      consumable.size -= 10;
      if(this.health < this.maxHealth)
        this.health+=10;
      this.hunger = 0;
      this.dir.set(0,0);
    }
  }

  //TODO think of a way to never use this function again.
  //Completely change the way wandering works.
  this.wander = function(modifier)
  {
    if(!this.target && this.timeAlive % 100 == 0){
      this.wandir.set(random(width) - this.pos.x, random(height) - this.pos.y);
      this.wandir.normalize();
      this.wandir.mult(this.speed * modifier);
    }
    else if(!this.target)
      this.pos.add(this.wandir);
  }

  this.die = function()
  {
    this.alive = false;
    dead[dead.length] = new Corpse(this.pos.x,this.pos.y,this.width,"Predator");
  }
  
  this.distSqrd = function(obj)
  {
    return abs((obj.pos.x - this.pos.x)*(obj.pos.x - this.pos.x)) + abs((obj.pos.y - this.pos.y)*(obj.pos.y - this.pos.y)); 
  }

  this.display = function()
  {
    fill("red");
    ellipse(this.pos.x,this.pos.y,this.width,this.height);
  }

  this.visualizeTarget = function(target)
  {
    stroke(255);
    line(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
    noStroke();
  }


  this.update = function()
  {
  this.timeAlive++;
  this.hunger++;
  if(this.health <= 0)
  {
     this.die();
  }
  else
  {
    
    if(this.hunger > 300)
    {
      this.updateTarget();
      if(this.target && this.target.exists)
      {
        this.visualizeTarget(this.target);
        this.eat(this.target);
      }
      else if(this.target && this.target.alive)
      {
        this.visualizeTarget(this.target);
        this.attack(this.target);
      }
      else
      {
        this.wander(this.sprint)
      }
    }
    else
    {
      //there is a better way to deal with targetting. This works for now though.
      this.target = null;
      this.wander(this.walkSpeed);
    }
  }

  if(this.hunger > 1000 && this.timeAlive % 100 == 0)
    this.health--;
  else if (this.timeAlive % 1000 == 0 && this.health < this.maxHealth)
    this.health++;
  }

  //TODO make this better
  this.updateTarget = function()
  {
    if(this.target && this.target.exists)
    {
      return;
    }
    else
    {
      var temp =  this.findTargetKD(deadKDTree);
      if(temp && temp.exists)
      {
        this.target = temp;
        return;
      }
    }
    if(this.target && this.target.alive)
    {
      return;
    }
    else
    {
      var temp = this.findTargetKD(harvesterKDTree);
      if (temp && temp.alive)
      {
        this.target =  temp;
        return;
      }
    }
    this.target = null;
  }

  this.distance = function(a, b){
    return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2);
  }

  this.findTargetKD = function(tree)
  {
    var temp = tree.nearest({x: this.pos.x, y: this.pos.y},1,this.range);
    if (temp.length != 0){
      return temp[0][0].itself;
    }
    else
      return null;
  }
}