var gamedata = null;
gamedata = new Object();

function init_gamedata() {
	gamedata.tileHeight = 48;
	gamedata.tileVertOffset = (gamedata.tileHeight - gamedata.tileHeight/3);
	gamedata.tileHeightRepeat = (gamedata.tileVertOffset*2);
	gamedata.tileWidth = 64;

	gamedata.num_players = 2;
	gamedata.current_player = 0;

	gamedata.moves = 2;
	gamedata.tiles_terrain = generate_tile_map_for_width_height(5,10,null);
	
	gamedata.tiles_buildings = generate_tile_map_for_width_height(5,10,'empty');
}

gamedata.load_graphics = function () {
	util.require_image_before_next_draw('images/green.png');
	util.require_image_before_next_draw('images/teal.png');
	util.require_image_before_next_draw('images/indigo.png');
	util.require_image_before_next_draw('images/house1.png');
	util.require_image_before_next_draw('images/house2.png');
}

gamedata.add_moves = function (count) {
	gamedata.moves += count;
}

gamedata.can_move = function () {
	return gamedata.moves > 0;
}


gamedata.act_on_tile = function(x, y) {
	if(gamedata.current_player === 1){
		gamedata.tiles_buildings[x][y]._tileType = 'house1.png';
	}else{
		gamedata.tiles_buildings[x][y]._tileType = 'house2.png';
	}
	gamedata.add_moves( -1 );
}

gamedata.display_tiles = function (tileMatrix){
		function x_draw_location( xindex, yindex){
			return xindex*gamedata.tileWidth +(gamedata.tileWidth/2)*((yindex)%2);
		};
		function y_draw_location( xindex, yindex){
			return yindex* gamedata.tileVertOffset;
		};
		
		$.each(tileMatrix, function(outerindex,outervalue) {
		
		
			$.each(outervalue, function(index,value) { 

				value.draw_tile(ctx, x_draw_location(index,outerindex),y_draw_location(index,outerindex));
			 });
			
});
}


gamedata.end_turn = function() {
	gamedata.moves = 2;
	gamedata.current_player = (gamedata.current_player + 1)%gamedata.num_players;
}
