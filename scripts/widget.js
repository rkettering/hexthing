var widget_bordered = {

definitions: {
	window: {
		upper_right: {x: 0, y: 0, w: 32, h: 32, imageName: 'images/border.png'},
		upper_left: {x: 96, y: 0, w: 32, h: 32, imageName: 'images/border.png'},
		lower_left: {x: 96, y: 96, w: 32, h: 32, imageName: 'images/border.png'},
		lower_right: {x: 0, y: 96, w: 32, h: 32, imageName: 'images/border.png'},
	
		top: {x: 32, y: 0, w: 64, h: 32, imageName: 'images/border.png'},
		bottom: {x: 32, y: 96, w: 64, h: 32, imageName: 'images/border.png'},
		right: {x: 96, y: 32, w: 32, h: 64, imageName: 'images/border.png'},
		left: {x: 0, y: 32, w: 32, h: 64, imageName: 'images/border.png'},
		
		background_pattern: {w: 64, h: 64, imageName: 'images/border_fill.png', _store: null, offset: 8},
		
	},
},

register_images: function() {
	var imageList = [];
	$.each(this.definitions, function(index, value) {
		$.each(value, function(index, value) {
			if( $.inArray(value.imageName, imageList) === -1) { imageList.push( value.imageName ); };
		});
	});
	//console.dir(imageList);
	$.each(imageList, function(index, value) {
		util.require_image_before_next_draw(value);
	});
},


draw_at: function(ctx, def, x, y, w, h) {
//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
	ctx.drawImage(util.images_cache[def.imageName], 
	def.x,def.y,def.w,def.h,
	  x,y,w,h);
},

draw_corners: function(ctx, wd, x,y,w,h){
	this.draw_at(ctx, wd.upper_right, x, y, wd.upper_right.w, wd.upper_right.h);
	this.draw_at(ctx, wd.upper_left, x + w - wd.upper_left.w, y, wd.upper_left.w, wd.upper_left.h);
	this.draw_at(ctx, wd.lower_left, x + w - wd.lower_left.w, y + h - wd.lower_left.h, wd.lower_left.w, wd.lower_left.h);
	this.draw_at(ctx, wd.lower_right, x, y + h - wd.lower_right.h, wd.lower_right.w, wd.lower_right.h);
},

draw_sides: function(ctx, wd, x,y,w,h){
	this.draw_at(ctx, wd.top, x + wd.upper_right.w, y, w - wd.upper_right.w - wd.upper_left.w, wd.top.h);
	this.draw_at(ctx, wd.right, x + w - wd.upper_right.w, y + wd.upper_right.h, wd.right.w, h - wd.upper_right.h - wd.lower_right.h);
	this.draw_at(ctx, wd.bottom, x + wd.upper_right.w, y + h - wd.bottom.h, w - wd.upper_right.w - wd.upper_left.w, wd.top.h);
	this.draw_at(ctx, wd.left, x, y + wd.upper_left.h, wd.left.w, h - wd.upper_left.h - wd.lower_left.h);
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

draw: function(ctx, widget_type, x, y, w, h) {
	this.draw_background(ctx, widget_type, x, y, w, h);
	this.draw_corners(ctx, widget_type, x, y, w, h);
	this.draw_sides(ctx, widget_type, x, y, w, h);
},

}