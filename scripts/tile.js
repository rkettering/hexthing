function generate_tile_map_for_width_height( width, height) {
	var theArray = [];
	
	for(var i = 0; i != height; i++){
		var array_row = [];
		
		for(var j = 0; j != width; j++){
			array_row.push(Tile.get_rand_tile());
		}
		theArray.push(array_row);
		
	}
	return theArray;
}




var Tile = { };

Tile.tile_types_possible = ['teal.png','green.png'];
Tile.tileType = tileType =	'';
Tile.get_rand_tile = function() { return this.tile_types_possible[ misc.dice(this.tile_types_possible.length) -1] };
Tile.imageName = function() { return 'images/' + this.tileType; };

var myTile = Object.create(Tile);
