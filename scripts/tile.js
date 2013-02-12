function generate_tile_map_for_width_height( width, height) {
	
}

function Tile () {
	tileType:	'';
}

//var myTile = new Tile;

Tile.prototype = {
	tile_types_possible: ['teal.png','green.png'],
	
	get_rand_tile: function() { return this.tile_types_possible[ misc.dice(this.tile_types_possible.length) -1] },
}