var ImageURL = './';

var ctx = null;
var side_ctx = null;

function init_game(){
	util.init();
	init_display();


	gamedata.moves = 1;
	gamedata.tiles = generate_tile_map_for_width_height(5,10);

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


var tileHeight = 48;
var tileVertOffset = (tileHeight - tileHeight/3);
var tileHeightRepeat = (tileVertOffset*2);
var tileWidth = 64;

function handle_mouse_click(e,canvas){
	
    function x() { return e.pageX-canvas.offset().left; };
    function y() { return e.pageY-canvas.offset().top; };

	var point = tile_at_coords(x(),y());

	if(gamedata.can_move()){
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
	var rise = tileHeight/3;
	var run = tileWidth/2;
	function slope(){ return rise/run};
	function flipped(y){ return y % tileHeightRepeat >= tileVertOffset };
	function is_slope_rising(x){  if(flipped(y))	return (x % tileWidth) <= tileWidth/2;
									else			return (x % tileWidth) > tileWidth/2;  };
	


	function y_offset(x){ 
		if( is_slope_rising(x) ){
			return (x % (tileWidth/2)) * slope();
		} else {
			return (tileWidth/2)*slope() - ((x % (tileWidth/2)) * slope());
		}
	};

	function notch() {
		if( (y % tileVertOffset) > y_offset(x)) return 1;
		else return 0;
	};
	
	function rectangular_row_for_y(){ return misc.truncate( y / tileVertOffset) };
	return  notch() + rectangular_row_for_y() - 1;
}

function column_given_x_and_row(x,row){
	function alt_x(){ return row%2 == 1 ? x - (tileWidth/2) : x; }; 
	return misc.truncate( alt_x() / tileWidth);
}


function display_game(data){

	display_tiles(data);
	display_sidebar(data);

	function display_tiles(data){
		$.each(data.tiles, function(outerindex,outervalue) {
		
		
			$.each(outervalue, function(index,value) { ctx.drawImage(util.images_cache[( value.imageName() )],index*tileWidth +(tileWidth/2)*((outerindex)%2) ,outerindex* tileVertOffset); /*console.log(index);*/  });
			
		 });
	}

	function display_sidebar(data){
		clear_canvas(side_ctx);
		side_ctx.fillRect(25,25,100,25);
		side_ctx.font = "bold 12px sans-serif";
		side_ctx.fillText("M: " + gamedata.moves, 25, 70);
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
