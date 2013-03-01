function generate_tile_map_for_width_height( width, height, is_empty) {
	var theArray = [];
	
	for(var i = 0; i != height; i++){
		var array_row = [];
		
		for(var j = 0; j != width; j++){
			var newTile = Object.create(tile);
			if(is_empty === 'empty'){
				//do nothing
			} else {
				newTile.set_tileType();
			}
			array_row.push(newTile);
		}
		theArray.push(array_row);
		
	}
	return theArray;
}


var tile = {
	tile_types_possible:  ['teal','green'],
	
	get_rand_tile: function() { return tile.tile_types_possible[ misc.dice(tile.tile_types_possible.length) -1] },
	
	_tileType: null,
	set_tileType: function() {
		this._tileType = tile.get_rand_tile();
	},
	tileType: function() { 
		return this._tileType;
	},
	
	
	imageName: function() { 
		if(this.tileType() != null){
			return this.imageNameForType(this.tileType());
		} else {	
	 		return null; 
		}
	},
	imageNameForType: function( type ){
			return 'images/' + type + '.png';		
	},
	
	draw_tile: function(ctxt,x,y) {
		if(this.imageName() != null) {
			ctxt.drawImage(util.images_cache[(this.imageName())],x,y);
		}
	},
	draw_tile_type: function(ctxt,x,y,type) {
			ctxt.drawImage(util.images_cache[( this.imageNameForType(type) )],x,y);
	},
		
	building_types: {
				house1: {
					points: 1,
				},
				house2: {
					points: 2,
				},
				indigo: {
					points: 0,
				},
	},
};
