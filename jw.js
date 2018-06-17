var islands = [
	  { name: 'Isla Matanceros', id: 'Matanceros', cages:[
		{name: 'Cage', dinos:[]}
	  ] },
	  { name: 'Isla Muerta', id: 'Muerta' , cages:[
		{name: 'Cage', dinos:[]}
	  ] },
	  { name: 'Isla Tacano', id: 'Tacano' , cages:[
		{name: 'Cage', dinos:[]}
	  ] },
	  { name: 'Isla Pena', id: 'Pena' , cages:[
		{name: 'Cage', dinos:[]}
	  ] },
	  { name: 'Isla Sorna', id: 'Sorna' , cages:[
		{name: 'Cage', dinos:[]}
	  ] },
	  { name: 'Isla Nublar', id: 'Nublar' , cages:[
		{name: 'Cage', dinos:[]}
	  ] },
	]
	
var species = [
		{id: '1', name: 'Tyrannosaurus Rex', type:'Large Carnivore', isCarnivore:true, baseStar:234, basePrice:1964000, comfort:85, socialMin: 0, socialMax: 1, popMin: 0, popMax: 15, grass: 211, forest: 52},
		{id: '2', name: 'Velociraptor',      type:'Small Carnivore', isCarnivore:true, baseStar:74, basePrice:373000, comfort:80, socialMin: 2, socialMax: 6, popMin: 0, popMax: 20, grass: 148, forest: 52},
		{id: '3', name: 'Ankylosaurus',      type:'Armored Herbivore', isCarnivore:false, baseStar:60, basePrice:315000, comfort:60, socialMin: 0, socialMax: 4, popMin: 0, popMax: 8, grass: 49, forest: 49}
	]
		
		
new Vue({
	el: '#app',
	data: {
		currentCage: null,
		islands: islands,
		currentIsland: islands[0],
		currentCage: islands[0].cages[0],
		species: species
	},
	methods: {
		addCage: function (event) {
			var cage = {name: 'Cage' + (this.$data.currentIsland.cages.length + 1), dinos:[]};
			this.$data.currentIsland.cages.push(cage);
			this.$data.currentCage = cage;

		},
		removeCage: function (event) {
			var index = this.$data.currentIsland.cages.indexOf(this.$data.currentCage);
			this.$data.currentIsland.cages.splice(index, 1);
			this.$data.currentCage = this.$data.currentIsland.cages[0];

		},
		
		addDino: function (event) {
			this.$data.islands =  JSON.parse(prompt("Please enter your name", "Harry Potter"));
			this.$data.currentIsland= this.$data.islands[0];
			
		 //this.$data.currentCage.dinos.push({target: 0, count: 0, species: species[0]});
		  //console.log(JSON.stringify(this.$data.islands));
		  

		},

		formatPrice(value) {
			let val = (value/1).toFixed(0).replace('.', ',')
			return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
		},

		isInRange(count, min, max) {
			return count >= min && count <= max;
		},
		docClose: function handler(event) {
			document.cookie = "username=John Doe";
			alert('close');
		}
  },
  watch: {
	  currentIsland: function (val) {
		  this.currentCage = val.cages[0];
		}
  },
  computed: {
    currentCageTarget: function () {
      return this.currentCage.dinos.reduce(function (total, dino) {
                return total + Number(dino.target);
            }, 0);
    },
	
    currentCageCount: function () {
      return this.currentCage.dinos.reduce(function (total, dino) {
                return total + Number(dino.count);
            }, 0);
    },
	
    currentCageType: function () {
      return this.currentCage.dinos.find(function(dino) {
		  return dino.species.isCarnivore;
		}) ? 'Carnivore' : 'Herbivore';
    },
	
    currentCagePopMin: function () {
		
      return this.currentCage.dinos.reduce(function (popMin, dino) {
                return (popMin > dino.species.popMin) ? popMin : dino.species.popMin
            }, 0);
    },
	
    currentCagePopMax: function () {		
      return this.currentCage.dinos.reduce(function (popMax, dino) {
                return (popMax < dino.species.popMax && popMax > 0) ? popMax : dino.species.popMax
            }, 0);
    },
	
    currentCageGrass: function () {		
      return this.currentCage.dinos.reduce(function (grass, dino) {
                return (grass > dino.species.grass) ? grass : dino.species.grass
            }, 0);
    },
	
    currentCageForest: function () {		
      return this.currentCage.dinos.reduce(function (forest, dino) {
                return (forest > dino.species.forest) ? forest : dino.species.forest
            }, 0);
    },
	
    currentCageTotalArea: function () {
      return this.currentCageGrass + this.currentCageForest;
    },
    currentCagePrice: function () {
      return this.currentCage.dinos.reduce(function (total, dino) {
                return total + dino.target * Number(dino.species.basePrice);
            }, 0);
    },
    currentCageRating: function () {
      return this.currentCage.dinos.reduce(function (total, dino) {
                return total + dino.target * Number(dino.species.baseStar);
            }, 0);
    }
  },
  
  created() {
        window.addEventListener('beforeunload', this.docClose)  
  },
  });
