function Population(m, num) {

  this.population;                   // Array to hold the current population
  this.matingPool;                   // ArrayList which we will use for our "mating pool"
  this.generations = 0;              // Number of generations
  this.finished = false;             // Are we finished evolving?
  this.mutationRate = m;             
  //this.perfectScore = 1;

  this.population = [];
  for (var i = 0; i < num; i++) {
    this.population[i] = new DNA(this.target.length);
  }
    this.matingPool = [];

  // Fill our fitness array with a value for every member of the population
  this.calcFitness = function() {
    for (var i = 0; i < this.population.length; i++) {
      this.population[i].calcFitness(target);
    }
  }
  this.calcFitness();

  // Generate a mating pool
  this.naturalSelection = function() {
    // Clear the ArrayList
    //this.matingPool = [];

    // Based on fitness, each member will get added to the mating pool a certain number of times
    // a higher fitness = more entries to mating pool = more likely to be picked as a parent
    // a lower fitness = fewer entries to mating pool = less likely to be picked as a parent
    for (var i = 0; i < this.population.length; i++) {
      
      var fitness = map(this.population[i].fitness,0,maxFitness,0,1);
      var n = floor(fitness * 100);  // Arbitrary multiplier, we can also use monte carlo method
      for (var j = 0; j < n; j++) {              // and pick two random numbers
        this.matingPool.push(this.population[i]);
      }
    }
  }

  // Create a new generation
  this.generate = function() {
    
    var maxFitness = 0;
    for (var i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > maxFitness) {
        maxFitness = this.population[i].fitness;
      }
    }
    
    // Refill the population with children from the mating pool
    var newPopulation = [];
    for (var i = 0; i < this.population.length; i++) {
      //var a = floor(random(this.matingPool.length));
      //var b = floor(random(this.matingPool.length));
      var partnerA = this.acceptReject(maxFitness);
      var partnerB = this.acceptReject(maxFitness);
      var child = partnerA.crossover(partnerB);
      child.mutate(this.mutationRate);
      newPopulation[i] = child;
    }
    this.population = newPopulation;
    this.generations++;
  }
  this.acceptReject = function(maxVal)
  {
    var besafe = 0;
    while(true){
      var index = floor(random(this.population.length));
      var partner = this.population[index];
      var r = random(maxVal);
      if(r < partner.fitness)
      {
        return partner;
      }
      besafe++;
      if(besafe> 1000)
      {
        return null;
      }
    }
  }


  this.getBest = function() {
    return this.best;
  }

  // Compute the current "most fit" member of the population
  this.evaluate = function() {
    var worldrecord = 0.0;
    var index = 0;
    for (var i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > worldrecord) {
        index = i;
        worldrecord = this.population[i].fitness;
      }
    }

    this.best = this.population[index].getPhrase();
    if (worldrecord >= this.perfectScore) {
      this.finished = true;
    }
  }

  this.isFinished = function() {
    return this.finished;
  }

  this.getGenerations = function() {
    return this.generations;
  }

  // Compute average fitness for the population
  this.getAverageFitness = function() {
    var total = 0;
    for (var i = 0; i < this.population.length; i++) {
      total += this.population[i].fitness;
    }
    return total / (this.population.length);
  }

  this.allPhrases = function() {
    var everything = "";
    
    var displayLimit = min(this.population.length,50);
    
    
    for (var i = 0; i < displayLimit; i++) {
      everything += this.population[i].getPhrase() + "<br>";
    }
    return everything;
  }
}