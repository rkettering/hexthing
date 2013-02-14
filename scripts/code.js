var ImageURL = './';
var gamedata = null;
var ctx = null;

function init_game(){
	util.init();
	init_display();

	gamedata = new Object();
	gamedata.tiles = generate_tile_map_for_width_height(5,10);

	ctx = $('#main_canvas')[0].getContext("2d");
	$('#main_canvas').click( function(e){ handle_mouse_click(e,$('#main_canvas'))});
	
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
	util.require_image_before_next_draw('images/green.png');
	util.require_image_before_next_draw('images/teal.png');
	util.require_image_before_next_draw('images/indigo.png');
}


var tileHeight = 48;
var tileVertOffset = (tileHeight - tileHeight/3);
var tileHeightRepeat = (tileVertOffset*2);
var tileWidth = 64;

function handle_mouse_click(e,canvas){
	
    function x() { return e.pageX-canvas.offset().left; };
    function y() { return e.pageY-canvas.offset().top; };

	var point = tile_at_coords(x(),y());
	gamedata.tiles[point[0]][point[1]]._tileType = 'indigo.png';
	//console.log(gamedata.tiles[point[0]][point[1]]);
	display_game(get_data());

	//console.log("x = " + x());
	//console.log("y = " + y());
}

function tile_at_coords(x, y){
	//get_data().tiles[0].length);
	//var rowLength = 5;
	
	//console.log("row = " + row_given(x,y));
	//console.log("column = " + column_given_x_and_row(x,row_given(x,y)));
	//function rowX() { return Math.floor(x/tileWidth); };
	
	var point = [];
	point.push(row_given(x,y));
	point.push(column_given_x_and_row(x,row_given(x,y)));
	return point;
}

function flipped(y){ return y % tileHeightRepeat >= tileVertOffset };

function row_given(x,y){
	//boost the row by one if we're on a peak jutting up from the row below
	var rise = tileHeight/3;
	var run = tileWidth/2;
	function slope(){ return rise/run};
	function is_slope_rising(x){  if(flipped(y))	return (x % tileWidth) <= tileWidth/2;
									else			return (x % tileWidth) > tileWidth/2;  };
	
	function slope_sign(x){  return misc.sign((x % tileWidth) - tileWidth/2)  };

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

	function display_tiles(data){
		$.each(data.tiles, function(outerindex,outervalue) {
		
		
			$.each(outervalue, function(index,value) { ctx.drawImage(util.images_cache[( value.imageName() )],index*tileWidth +(tileWidth/2)*((outerindex)%2) ,outerindex* tileVertOffset); /*console.log(index);*/  });
			
		 });
	}

}