var ImageURL = './';

var ctx = null;
var side_ctx = null;

function init_game(){
	util.init();
	init_display();

	init_gamedata();

	ctx = $('#main_canvas')[0].getContext("2d");
	$('#main_canvas').click( function(e){ handle_mouse_click(e,$('#main_canvas'))});

	var sidebar = Object();
	sidebar.canvas = $('<canvas class="sidebar_canvas" width="' + 250 + '" height="' + 350 + '"></canvas>');

	$('body').append(sidebar.canvas);
		sidebar.canvas.css({
			'position': 'absolute',
			'left': '500px',
			'background-color':'#b0c4de'
		});
	side_ctx = $('.sidebar_canvas')[0].getContext('2d');
	$('.sidebar_canvas').click( function(e){ handle_sidebar_mouse_click(e,$('.sidebar_canvas'))});
	
	
	if(util.ready_to_draw()){
		display_game(get_data());
	}
}
	
function get_data(){

	return gamedata;
}


function on_ready_to_draw()
{
	display_game(get_data());
}

function init_display(){
	gamedata.load_graphics();
}



function handle_mouse_click(e,canvas){
	
    function x() { return e.pageX-canvas.offset().left; };
    function y() { return e.pageY-canvas.offset().top; };

	var point = tile_at_coords(x(),y());

	if(gamedata.can_move()){
		console.log('clicking on tile');
		gamedata.act_on_tile(point[0], point[1]);
	}

	display_game(get_data());
}

function handle_sidebar_mouse_click(e,canvas){

    function x() { return e.pageX-canvas.offset().left; };
    function y() { return e.pageY-canvas.offset().top; };

	if( x() > 25 && x() < 125 && y() > 25 && y() < 50){
		gamedata.end_turn();
		display_game(get_data());
	}
}

function tile_at_coords(x, y){
	//console.log("row = " + row_given(x,y));
	//console.log("column = " + column_given_x_and_row(x,row_given(x,y)));
	
	var point = [];
	point.push(row_given(x,y));
	point.push(column_given_x_and_row(x,row_given(x,y)));
	return point;
}



function row_given(x,y){
	//boost the row by one if we're on a peak jutting up from the row below
	var rise = gamedata.tileHeight/3;
	var run = gamedata.tileWidth/2;
	function slope(){ return rise/run};
	function flipped(y){ return y % gamedata.tileHeightRepeat >= gamedata.tileVertOffset };
	function is_slope_rising(x){  if(flipped(y))	return (x % gamedata.tileWidth) <= gamedata.tileWidth/2;
									else			return (x % gamedata.tileWidth) > gamedata.tileWidth/2;  };
	


	function y_offset(x){ 
		if( is_slope_rising(x) ){
			return (x % (gamedata.tileWidth/2)) * slope();
		} else {
			return (gamedata.tileWidth/2)*slope() - ((x % (gamedata.tileWidth/2)) * slope());
		}
	};

	function notch() {
		if( (y % gamedata.tileVertOffset) > y_offset(x)) return 1;
		else return 0;
	};
	
	function rectangular_row_for_y(){ return misc.truncate( y / gamedata.tileVertOffset) };
	return  notch() + rectangular_row_for_y() - 1;
}

function column_given_x_and_row(x,row){
	function alt_x(){ return row%2 == 1 ? x - (gamedata.tileWidth/2) : x; }; 
	return misc.truncate( alt_x() / gamedata.tileWidth);
}


function display_game(data){
	gamedata.display_tiles(data.tiles_terrain);
	gamedata.display_tiles(data.tiles_buildings[gamedata.current_player]);
	display_sidebar(data);



	function display_sidebar(data){
		clear_canvas(side_ctx);
		widget_bordered.draw(side_ctx, widget_bordered.definitions.window, 0, 0, side_ctx.canvas.width, side_ctx.canvas.height);
		side_ctx.fillRect(25,25,100,25);
		
		side_ctx.font = "bold 12px sans-serif";
		side_ctx.fillText("Moves: " + gamedata.moves, 25, 70);
		
		side_ctx.fillText("Player: " + (gamedata.current_player+1), 25, 90);
		side_ctx.fillText("Points: " + (gamedata.calculate_points()), 25, 110);
	}
}

function clear_canvas(_ctx) {
	// Store the current transformation matrix
	_ctx.save();

	// Use the identity matrix while clearing the canvas
	_ctx.setTransform(1, 0, 0, 1, 0, 0);
	_ctx.clearRect(0, 0, _ctx.canvas.width, _ctx.canvas.height);

	// Restore the transform
	_ctx.restore();
}

function show_build_options_dialog_for_tile(x,y) {
		var dialog = $('<div id="choices_dialog"></div>');
		$('body').append(dialog);
			
		var build_options = {
			2: 'house1',
			1: 'house2',
			0: 'indigo',
		};
		
		var option_height = 64;
		dialog.css({
			'top': 100 + 'px',
			'left': 100 + 'px',
			'width': 300 + 'px',
			'height': (option_height * build_options.length) + 'px',
			'position': 'absolute',
			'background-color':'#b0c4ff'
		});

		/*	dialog.click(function() {
				console.log('dialog_clicked');
				gamedata.build_on_tile(x,y);
			});*/

		
		function draw_individual_building_option(ctx, y, building) {
			ctx.fillText("Building: " + building, (64+12), y+32);
			tile.draw_tile_type(ctx, 8, y + 8, building);
		}
		
		var canvas = null;
		$.each(build_options, function (index,value) {
				canvas = $('<canvas class="building_choice dialog_option" width="' + 300 + '" height="' + option_height + '"></canvas>');
					draw_individual_building_option(canvas.get(0).getContext('2d'), 0, value);

			canvas.click(function() {
				gamedata.build_on_tile(x,y, this);
			}.bind(value));
			
			$('#choices_dialog').append(canvas);
		});
		
}