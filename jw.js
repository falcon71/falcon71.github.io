var islands = [
  { name: 'Isla Matanceros', cages:[
    {name: 'Cage1', dinos:[]}
  ] },
  { name: 'Isla Muerta', cages:[
    {name: 'Cage1', dinos:[]}
  ] },
  { name: 'Isla Tacano' , cages:[
    {name: 'Cage1', dinos:[]}
  ] },
  { name: 'Isla Pena', cages:[
    {name: 'Cage1', dinos:[]}
  ] },
  { name: 'Isla Sorna', cages:[
    {name: 'Cage1', dinos:[]}
  ] },
  { name: 'Isla Nublar', cages:[
    {name: 'Cage1', dinos:[]}
  ] },
]
	
var species = [
  {name: 'Ankylosaurus',        type:'Armored Herbivore', isCarnivore:true,   baseStar:60,  basePrice:315000,   comfort:60, socialMin:0, socialMax:4,   popMin:0, popMax:8,   grass:49,   forest:49},
  {name: 'Apatosaurus',         type:'Giant Herbivore',   isCarnivore:false,  baseStar:96,  basePrice:675066,   comfort:45, socialMin:3, socialMax:7,   popMin:0, popMax:22,  grass:153,  forest:142},
  {name: 'Archaeornithomimus',  type:'Small Herbivore',   isCarnivore:false,  baseStar:11,  basePrice:70000,    comfort:15, socialMin:0, socialMax:16,  popMin:0, popMax:21,  grass:48,   forest:16},
  {name: 'Brachiosaurus',       type:'Giant Herbivore',   isCarnivore:false,  baseStar:113, basePrice:686352,   comfort:50, socialMin:1, socialMax:5,   popMin:0, popMax:25,  grass:210,  forest:210},
  {name: 'Camarasaurus',        type:'Giant Herbivore',   isCarnivore:false,  baseStar:99,  basePrice:513351,   comfort:45, socialMin:2, socialMax:7,   popMin:0, popMax:23,  grass:147,  forest:248},
  {name: 'Ceratosaurus',        type:'Large Carnivore',   isCarnivore:true,   baseStar:102, basePrice:550000,   comfort:55, socialMin:0, socialMax:3,   popMin:0, popMax:20,  grass:177,  forest:44},
  {name: 'Crichtonsaurus',      type:'Armored Herbivore', isCarnivore:false,  baseStar:57,  basePrice:290000,   comfort:55, socialMin:0, socialMax:5,   popMin:0, popMax:8,   grass:73,   forest:25},
  {name: 'Chasmosaurus',        type:'Armored Herbivore', isCarnivore:false,  baseStar:34,  basePrice:250000,   comfort:45, socialMin:3, socialMax:5,   popMin:3, popMax:11,  grass:71,   forest:26},
  {name: 'Chungkingosaurus',    type:'Armored Herbivore', isCarnivore:false,  baseStar:42,  basePrice:275000,   comfort:50, socialMin:2, socialMax:12,  popMin:2, popMax:18,  grass:120,  forest:97},
  {name: 'Corythosaurus',       type:'Medium Herbivore',  isCarnivore:false,  baseStar:22,  basePrice:145000,   comfort:20, socialMin:2, socialMax:13,  popMin:2, popMax:24,  grass:66,   forest:40},
  {name: 'Deinonychus',         type:'Small Carnivore',   isCarnivore:true,   baseStar:72,  basePrice:458214,	  comfort:75, socialMin:3, socialMax:8,   popMin:0, popMax:18,  grass:125,	forest:74},
  {name: 'Dilophosaurus',       type:'Small Carnivore',   isCarnivore:true,   baseStar:58,  basePrice:380200,   comfort:70, socialMin:1, socialMax:12,  popMin:0, popMax:22,  grass:98,   forest:98},
  {name: 'Diplodocus',          type:'Giant Herbivore',   isCarnivore:false,  baseStar:98,  basePrice:546982,   comfort:40, socialMin:1, socialMax:8,   popMin:0, popMax:24,  grass:198,  forest:101},
  {name: 'Dracorex',            type:'Small Herbivore',   isCarnivore:false,  baseStar:32,  basePrice:150000,   comfort:25, socialMin:2, socialMax:8,   popMin:2, popMax:12,  grass:77,   forest:47},
  {name: 'Edmontosaurus',       type:'Medium Herbivore',  isCarnivore:false,  baseStar:23,  basePrice:170000,   comfort:20, socialMin:1, socialMax:15,  popMin:1, popMax:25,  grass:80,   forest:54},
  {name: 'Gallimimus',          type:'Small Herbivore',   isCarnivore:false,  baseStar:9,   basePrice:80000,    comfort:15, socialMin:0, socialMax:18,  popMin:0, popMax:23,  grass:37,   forest:14},
  {name: 'Giganotosaurus',      type:'Large Carnivore',   isCarnivore:true,   baseStar:80,  basePrice:0,        comfort:80, socialMin:0, socialMax:2,   popMin:0, popMax:14,  grass:186,  forest:44},
  {name: 'Gigantspinosaurus',   type:'Armored Herbivore', isCarnivore:false,  baseStar:35,  basePrice:37000,    comfort:55, socialMin:4, socialMax:10,  popMin:4, popMax:16,  grass:103,  forest:92},
  {name: 'Huayangosaurus',      type:'Armored Herbivore', isCarnivore:false,  baseStar:26,  basePrice:210000,   comfort:50, socialMin:1, socialMax:13,  popMin:1, popMax:20,  grass:113,  forest:104},
  {name: 'Indominus Rex',       type:'Large Carnivore',   isCarnivore:true,   baseStar:273, basePrice:2516000,  comfort:90, socialMin:0, socialMax:1,   popMin:0, popMax:10,  grass:231,  forest:75},
  {name: 'Kentrosaurus',        type:'Armored Herbivore', isCarnivore:true,   baseStar:29,  basePrice:0,        comfort:55, socialMin:3, socialMax:11,  popMin:3, popMax:17,  grass:131,  forest:108},
  {name: 'Maiasaura',           type:'Medium Herbivore',  isCarnivore:false,  baseStar:28,  basePrice:165000,   comfort:25, socialMin:4, socialMax:12,  popMin:4, popMax:23,  grass:76,   forest:62},
  {name: 'Majungasaurus',       type:'Large Carnivore',   isCarnivore:true,   baseStar:104, basePrice:0,        comfort:60, socialMin:0, socialMax:2,   popMin:0, popMax:16,  grass:181,  forest:45},
  {name: 'Mamenchisaurus',      type:'Giant Herbivore',   isCarnivore:false,  baseStar:121, basePrice:0,        comfort:0,  socialMin:2, socialMax:4,   popMin:0, popMax:25,  grass:154,  forest:254},
  {name: 'Metriacanthosaurus',  type:'Large Carnivore',   isCarnivore:true,   baseStar:84,  basePrice:873000,   comfort:0,  socialMin:0, socialMax:2,   popMin:0, popMax:18,  grass:154,  forest:73},
  {name: 'Muttaburrasaurus',    type:'Medium Herbivore',  isCarnivore:false,  baseStar:28,  basePrice:225000,   comfort:30, socialMin:6, socialMax:12,  popMin:6, popMax:20,  grass:72,   forest:59},
  {name: 'Nodosaurus',          type:'Armored Herbivore', isCarnivore:false,  baseStar:42,  basePrice:0,        comfort:55, socialMin:0, socialMax:7,   popMin:0, popMax:4,   grass:28,   forest:26},
  {name: 'Pachycephalosaurus',  type:'Small Herbivore',   isCarnivore:false,  baseStar:34,  basePrice:195000,   comfort:25, socialMin:3, socialMax:6,   popMin:3, popMax:10,  grass:105,  forest:50},
  {name: 'Parasaurolophus',     type:'Medium Herbivore',  isCarnivore:false,  baseStar:30,  basePrice:180000,   comfort:30, socialMin:4, socialMax:14,  popMin:4, popMax:21,  grass:76,   forest:52},
  {name: 'Pentaceratops',       type:'Armored Herbivore', isCarnivore:false,  baseStar:38,  basePrice:350000,   comfort:45, socialMin:3, socialMax:5,   popMin:3, popMax:9,   grass:78,   forest:29},
  {name: 'Polacanthus',         type:'Armored Herbivore', isCarnivore:false,  baseStar:48,  basePrice:258499,   comfort:60, socialMin:0, socialMax:3,   popMin:0, popMax:6,   grass:77,   forest:4},
  {name: 'Sauropelta',          type:'Armored Herbivore', isCarnivore:false,  baseStar:54,  basePrice:280757,   comfort:55, socialMin:0, socialMax:2,   popMin:0, popMax:4,   grass:98,   forest:3},
  {name: 'Spinosaurus',         type:'Large Carnivore',   isCarnivore:true,   baseStar:217, basePrice:2009196,  comfort:70, socialMin:0, socialMax:2,   popMin:0, popMax:13,  grass:223,  forest:54},
  {name: 'Stegosaurus',         type:'Armored Herbivore', isCarnivore:false,  baseStar:40,  basePrice:320000,   comfort:55, socialMin:5, socialMax:9,   popMin:5, popMax:15,  grass:137,  forest:111},
  {name: 'Styracosaurus',       type:'Armored Herbivore', isCarnivore:false,  baseStar:41,  basePrice:315000,   comfort:45, socialMin:2, socialMax:5,   popMin:2, popMax:14,  grass:66,   forest:25},
  {name: 'Struthiomimus',       type:'Small Herbivore',   isCarnivore:false,  baseStar:9,   basePrice:30000,    comfort:10, socialMin:0, socialMax:20,  popMin:0, popMax:25,  grass:25,   forest:12},
  {name: 'Suchomimus',          type:'Large Carnivore',   isCarnivore:true,   baseStar:96,  basePrice:1228000,  comfort:65, socialMin:0, socialMax:2,   popMin:0, popMax:16,  grass:182,  forest:46},
  {name: 'Torosaurus',          type:'Armored Herbivore', isCarnivore:false,  baseStar:45,  basePrice:340000,   comfort:45, socialMin:2, socialMax:5,   popMin:2, popMax:13,  grass:67,   forest:30	},
  {name: 'Triceratops',         type:'Armored Herbivore', isCarnivore:false,  baseStar:39,  basePrice:230000,   comfort:40, socialMin:1, socialMax:6,   popMin:1, popMax:16,  grass:92,   forest:47},
  {name: 'Tsintaosaurus',       type:'Medium Herbivore',  isCarnivore:false,  baseStar:31,  basePrice:200000,   comfort:25, socialMin:4, socialMax:15,  popMin:4, popMax:22,  grass:85,   forest:52},
  {name: 'Tyrannosaurus Rex',   type:'Large Carnivore',   isCarnivore:true,   baseStar:234, basePrice:1964000,  comfort:85, socialMin:0, socialMax:1,   popMin:0, popMax:15,  grass:211,  forest:52},
  {name: 'Velociraptor',        type:'Small Carnivore',   isCarnivore:true,   baseStar:74,  basePrice:373000,   comfort:80, socialMin:2, socialMax:6,   popMin:0, popMax:20,  grass:148,  forest:52}
];

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
    addCage: function(event) {
      var cage = {
        name: 'Cage' + (this.$data.currentIsland.cages.length + 1),
        dinos: []
      };
      this.$data.currentIsland.cages.push(cage);
      this.$data.currentCage = cage;

    },
    removeCage: function(event) {
      var index = this.$data.currentIsland.cages.indexOf(this.$data.currentCage);
      this.$data.currentIsland.cages.splice(index, 1);
      this.$data.currentCage = this.$data.currentIsland.cages[0];

    },

    addDino: function(event) {
      this.$data.currentCage.dinos.push({
        target: 0,
        count: 0,
        species: species[0]
      });
    },

    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    isInRange(count, min, max) {
      return count >= min && count <= max;
    },
    docClose: function handler(event) {
	  var jsonIslands = JSON.stringify(this.$data.islands);
	  window.localStorage.setItem('islands', jsonIslands);
    }
  },
  watch: {
    currentIsland: function(val) {
      this.currentCage = val.cages[0];
    }
  },
  computed: {
    currentCageTarget: function() {
      return this.currentCage.dinos.reduce(function(total, dino) {
        return total + Number(dino.target);
      }, 0);
    },

    currentCageCount: function() {
      return this.currentCage.dinos.reduce(function(total, dino) {
        return total + Number(dino.count);
      }, 0);
    },

    currentCageType: function() {
      return this.currentCage.dinos.find(function(dino) {
        return dino.species.isCarnivore && dino.target > 0;
      }) ? 'Carnivore' : 'Herbivore';
    },

    currentCagePopMin: function() {
      return this.currentCage.dinos.reduce(function(popMin, dino) {
        return (popMin > dino.species.popMin || dino.target == 0) ? popMin : dino.species.popMin
      }, 0);
    },

    currentCagePopMax: function() {
      return this.currentCage.dinos.reduce(function(popMax, dino) {
        return ((popMax < dino.species.popMax && popMax > 0) || dino.target == 0) ? popMax : dino.species.popMax
      }, 0);
    },

    currentCageGrass: function() {
      return this.currentCage.dinos.reduce(function(grass, dino) {
        return (grass > dino.species.grass || dino.target == 0) ? grass : dino.species.grass
      }, 0);
    },

    currentCageForest: function() {
      return this.currentCage.dinos.reduce(function(forest, dino) {
        return (forest > dino.species.forest || dino.target == 0) ? forest : dino.species.forest
      }, 0);
    },

    currentCageTotalArea: function() {
      return this.currentCageGrass + this.currentCageForest;
    },
    currentCagePrice: function() {
      return this.currentCage.dinos.reduce(function(total, dino) {
        return total + dino.target * Number(dino.species.basePrice);
      }, 0);
    },
    currentCageRating: function() {
      return this.currentCage.dinos.reduce(function(total, dino) {
        return total + dino.target * Number(dino.species.baseStar);
      }, 0);
    }
  },

  created() {
    window.addEventListener('beforeunload', this.docClose)
	var saved = window.localStorage.getItem('islands');
    if (saved != null) {
      var islands = JSON.parse(saved);
      this.$data.islands = islands;
      this.$data.currentIsland = this.$data.islands[0];
    }
  },
});