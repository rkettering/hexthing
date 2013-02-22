var gamedata = null;
gamedata = new Object();

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

gamedata.end_turn = function() {
	gamedata.moves = 2;
}
