function generate_tile_map_for_width_height( width, height) {
	var theArray = [];
	
	for(var i = 0; i != height; i++){
		var array_row = [];
		
		for(var j = 0; j != width; j++){
			var newTile = Object.create(tile);
			newTile.tileType();
			array_row.push(newTile);
		}
		theArray.push(array_row);
		
	}
	return theArray;
}


var tile = {
	tile_types_possible:  ['teal.png','green.png'],
	
	get_rand_tile: function() { return tile.tile_types_possible[ misc.dice(tile.tile_types_possible.length) -1] },
	
	_tileType: null,
	tileType: function() { 
			if(this._tileType === null) {this._tileType = tile.get_rand_tile();}
			 return this._tileType;
	},
	
	
	imageName: function() { return 'images/' + this.tileType(); },
	
};
