var widget_bordered = {

definitions: {
	window: {
		upper_right: { srcRect: { x: 0, y: 0, width: 32, height: 32}, imageName: 'images/border.png', _cache: null},
		upper_left: { srcRect: { x: 96, y: 0, width: 32, height: 32}, imageName: 'images/border.png', _cache: null},
		lower_left: { srcRect: { x: 96, y: 96, width: 32, height: 32}, imageName: 'images/border.png', _cache: null},
		lower_right: { srcRect: { x: 0, y: 96, width: 32, height: 32}, imageName: 'images/border.png', _cache: null},
	
		top: { srcRect: { x: 32, y: 0, width: 64, height: 32}, imageName: 'images/border.png', _cache: null},
		bottom: { srcRect: { x: 32, y: 96, width: 64, height: 32}, imageName: 'images/border.png', _cache: null},
		right: { srcRect: { x: 96, y: 32, width: 32, height: 64}, imageName: 'images/border.png', _cache: null},
		left: { srcRect: { x: 0, y: 32, width: 32, height: 64}, imageName: 'images/border.png', _cache: null},
		
		background_pattern: {w: 64, h: 64, imageName: 'images/border_fill.png', _store: null, offset: 8},
	},
	button: {
		upper_right: { srcRect: { x: 0, y: 0, width: 8, height: 8}, imageName: 'images/button.png', _cache: null},
		upper_left: { srcRect: { x: 24, y: 0, width: 8, height: 8}, imageName: 'images/button.png', _cache: null},
		lower_left: { srcRect: { x: 24, y: 24, width: 8, height: 8}, imageName: 'images/button.png', _cache: null},
		lower_right: { srcRect: { x: 0, y: 24, width: 8, height: 8}, imageName: 'images/button.png', _cache: null},
	
		top: { srcRect: { x: 8, y: 0, width: 16, height: 8}, imageName: 'images/button.png', _cache: null},
		bottom: { srcRect: { x: 8, y: 24, width: 16, height: 8}, imageName: 'images/button.png', _cache: null},
		right: { srcRect: { x: 24, y: 8, width: 8, height: 16}, imageName: 'images/button.png', _cache: null},
		left: { srcRect: { x: 0, y: 8, width: 8, height: 16}, imageName: 'images/button.png', _cache: null},
		
		background_pattern: {w: 32, h: 32, imageName: 'images/button_fill.png', _store: null, offset: 8},
	},
},

register_images: function() {
	var imageList = [];
	$.each(this.definitions, function(index, widget_definition) {
		$.each(widget_definition, function(index, value) {
			if( ("imageName" in value) && ("srcRect" in value) ){
				if( $.inArray(value.imageName, imageList) === -1) { imageList.push( value.imageName ); };
			};
		});
	});
		
	$.each(imageList, function(index, value) {
		util.require_image_before_next_draw(value);
	});
},

initialize_bitmaps: function() {
	$.each(this.definitions, function(index, widget_definition) {
		$.each(widget_definition, function(index, value) {
			if( ("imageName" in value) && ("srcRect" in value) ){
				
				var bitmap = new createjs.Bitmap( value.imageName );
				bitmap.sourceRect = value.srcRect;
				value._cache = bitmap;
				console.dir(value._cache);
			};
		});
	});
},

draw_at: function(stage, def, x, y, w, h) {
	/*var widget = def._cache;
	stage.addChild( widget );
	widget.x = x;
	widget.y = y;*/

	var graphic = new createjs.Graphics();
	graphic.beginBitmapFill( util.images_cache[def.imageName], 'repeat');
	graphic.rect(x,y,w,h);
	graphic.endFill();

	var widget_piece = new createjs.Shape(graphic);
	stage.addChild( widget_piece );

},

draw_corners: function(stage, wd, x,y,w,h){
	this.draw_at(stage, wd.upper_right, x, y, wd.upper_right.srcRect.width, wd.upper_right.srcRect.height);
	this.draw_at(stage, wd.upper_left, x + w - wd.upper_left.srcRect.width, y, wd.upper_left.srcRect.width, wd.upper_left.srcRect.height);
	this.draw_at(stage, wd.lower_left, x + w - wd.lower_left.srcRect.width, y + h - wd.lower_left.srcRect.height, wd.lower_left.srcRect.width, wd.lower_left.srcRect.height);
	this.draw_at(stage, wd.lower_right, x, y + h - wd.lower_right.srcRect.height, wd.lower_right.srcRect.width, wd.lower_right.srcRect.height);
},

draw_sides: function(stage, wd, x,y,w,h){
	this.draw_at(stage, wd.top, x + wd.upper_right.srcRect.width, y, w - wd.upper_right.srcRect.width - wd.upper_left.srcRect.width, wd.top.srcRect.height);
	this.draw_at(stage, wd.right, x + w - wd.upper_right.srcRect.width, y + wd.upper_right.srcRect.height, wd.right.srcRect.width, h - wd.upper_right.srcRect.height - wd.lower_right.srcRect.height);
	this.draw_at(stage, wd.bottom, x + wd.upper_right.srcRect.width, y + h - wd.bottom.srcRect.height, w - wd.upper_right.srcRect.width - wd.upper_left.srcRect.width, wd.top.srcRect.height);
	this.draw_at(stage, wd.left, x, y + wd.upper_left.srcRect.height, wd.left.srcRect.width, h - wd.upper_left.srcRect.height - wd.lower_left.srcRect.height);
},

draw_background: function(ctx, wd, x,y,w,h){
	if(wd.background_pattern._store == undefined){
		wd.background_pattern._store = ctx.createPattern(util.images_cache[wd.background_pattern.imageName],'repeat');
	};
	var	old_fillStyle = ctx.fillStyle;
	ctx.fillStyle = wd.background_pattern._store;
	ctx.fillRect(x+wd.background_pattern.offset,y+wd.background_pattern.offset,w-2*wd.background_pattern.offset,h-2*wd.background_pattern.offset);
	ctx.fillStyle = old_fillStyle;
},

draw: function(stage, widget_type, x, y, w, h) {
	//this.draw_background(ctx, widget_type, x, y, w, h);
	this.draw_corners(stage, widget_type, x, y, w, h);
	this.draw_sides(stage, widget_type, x, y, w, h);
    stage.update();
},

}