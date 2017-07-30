

function Corpse(posX, posY, size, type)
{
  this.pos = createVector(posX, posY);
  this.type = type;
  this.size = size;
  this.drawStyle = 0; //set with type
  this.exists = true;
  this.timeExisting = 0;
  
  this.decompose = function()
  {
    this.size--;
  }

  this.update = function()
  {
    this.timeExisting++;
    if(this.size <= 0)
      this.exists = false;
    else
    {
      if(this.timeExisting%100 == 0){
        this.decompose();
      }
    }
  }
  this.display= function()
  {
    fill("brown");
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
  this.remove = function()
  {

  } 
}