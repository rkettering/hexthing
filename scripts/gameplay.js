var gamedata = null;
gamedata = new Object();

gamedata.tileHeight = 48;
gamedata.tileVertOffset = (gamedata.tileHeight - gamedata.tileHeight/3);
gamedata.tileHeightRepeat = (gamedata.tileVertOffset*2);
gamedata.tileWidth = 64;


gamedata.load_graphics = function () {
	util.require_image_before_next_draw('images/green.png');
	util.require_image_before_next_draw('images/teal.png');
	util.require_image_before_next_draw('images/indigo.png');
}

gamedata.add_moves = function (count) {
	gamedata.moves += count;
}

gamedata.can_move = function () {
	return gamedata.moves > 0;
}


gamedata.act_on_tile = function(x, y) {
	gamedata.tiles[x][y]._tileType = 'indigo.png';
	gamedata.add_moves( -1 );
}

gamedata.display_tiles = function (data){
		$.each(data.tiles, function(outerindex,outervalue) {
		
		
			$.each(outervalue, function(index,value) { ctx.drawImage(util.images_cache[( value.imageName() )],index*gamedata.tileWidth +(gamedata.tileWidth/2)*((outerindex)%2) ,outerindex* gamedata.tileVertOffset); /*console.log(index);*/  });
			
});
}


gamedata.end_turn = function() {
	gamedata.moves = 2;
}
