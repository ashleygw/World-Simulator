function Tree(posX, posY)
{
  this.pos = createVector(posX, posY);
  this.size = 40;
  this.alive = true;
  this.health = 10;
  this.timeAlive = 0;
  this.maxSize = 100;
  
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
      if(this.timeAlive%100 == 0){
        this.grow();
        //this.health--;
      }
    }
  }
  this.display= function()
  {
    fill("brown");
    rect(this.pos.x-this.size/6, this.pos.y - this.size, this.size/3, this.size);
    fill("green");
    triangle(this.pos.x - this.size/3, this.pos.y - this.size/3, this.pos.x + this.size/3, this.pos.y - this.size/3, this.pos.x, this.pos.y - this.size*2);
  } 
}