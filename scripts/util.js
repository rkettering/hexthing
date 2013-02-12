var global_num_outstanding_ajax_requests = 0;
var global_consecutive_ajax_errors = 0;

var util = {

get_cookie_value: function(key) {
	var cookies = document.cookie.split(';');
	for(var n = 0; n != cookies.length; ++n) {
		var key_val = cookies[n].split('=');
		for(var m = 0; m != key_val.length; ++m) {
			key_val[m] = key_val[m].replace(' ', '');
		}

		if(key_val[0] == key) {
			return key_val[1];
		}
	}

	return '';
},

send_ajax: function(msg) {
	++global_num_outstanding_ajax_requests;

	var current_time = new Date();
	var started_loading = current_time.getTime();

	msg['debug_session'] = parseInt(util.get_cookie_value('session'));
	console.log('set session: ' + msg['debug_session']);

	//This is the call we make to send a message to the server.
	jQuery.ajax({
	 url: 'http://theargentlark.com:23458/dark-chess-ajax',
	 dataType: 'json',
	 type: 'post',
	 data: jQuery.toJSON(msg),

	 success: function(msg) {
	   //This is the code that gets run once the server responds with
	   //a message. 

		global_consecutive_ajax_errors = 0;
	 	$('#disconnect_dialog').remove();

		var current_time = new Date();
		var finished_loading = current_time.getTime();
		console.log('received message ' + msg.type + ' in response to ' + this.type + ' in ' + (finished_loading - this.time) + 'ms');
	   handle_message(msg);
	   if(--global_num_outstanding_ajax_requests == 0) {
			util.send_ajax({type: "request_updates"});
	   }
	 }.bind({time: started_loading, type: msg.type}),

	 error: function(data, textStatus, response) {
	   //This code will get called if there was an error communicating
	   //with the server.
	   console.log('error: ' + textStatus + ' -- ' + jQuery.toJSON(data) + ' -- ' + response);


	   if(--global_num_outstanding_ajax_requests > 0) {
			  return;
	   }

	   ++global_consecutive_ajax_errors;

		if(global_consecutive_ajax_errors > 5) {
		   $('#disconnect_dialog').remove();

			var dialog = $('<div id="disconnect_dialog"><center><h1 id="disconnect_label">Disconnected (' + global_consecutive_ajax_errors + ' reconnect attempts...)</h1></center></div>');
			dialog.css({
				width: window.innerWidth + 'px',
				height: window.innerHeight + 'px'
			});

			$('body').append(dialog);
		}


		window.setTimeout(function() {
			util.send_ajax({type: "request_state"});
		}, 1000);
	 }
	});
},

init: function() {
	//Make sure that bind() exists -- some browsers don't have it.
    if (!Function.prototype.bind) {  
		//some browsers don't have bind defined, so provide a definition here.
      
      Function.prototype.bind = function (oThis) {  
      
        if (typeof this !== "function") // closest thing possible to the ECMAScript 5 internal IsCallable function  
          throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable");  
      
        var aArgs = Array.prototype.slice.call(arguments, 1),   
            fToBind = this,   
            fNOP = function () {},  
            fBound = function () {  
              return fToBind.apply(this instanceof fNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));      
            };  
      
        fNOP.prototype = this.prototype;  
        fBound.prototype = new fNOP();  
      
        return fBound;  
      
      };  
    }
},

images_cache: {},
images_loading: {},
image_loading_errors: {},

global_files_needed_to_start_game: {},
global_files_needed_to_draw: [],

ready_to_draw: function() {
	return util.global_files_needed_to_draw.length == 0;
},

require_image_before_next_draw: function(key) {
	if(util.images_cache[key] || util.images_loading[key]) {
		return;
	}

	util.global_files_needed_to_draw.push(key);
	util.load_cached_image(key);
},

load_cached_image: function(key) {
	if(util.images_cache[key] != null || util.images_loading[key] != null) {
		return;
	}

	util.images_loading[key] = true;

	var img = new Image();
	img.key = key;
	img.src = ImageURL + img.key;
	var current_time = new Date();
	img.started_loading = current_time.getTime();
	img.onload = function() {
		util.images_cache[this.key] = this;
		util.on_file_completed_download(this.key);


		var current_time = new Date();
		console.log('loaded ' + img.key + ' in ' + (current_time.getTime() - img.started_loading) + 'ms');
	}.bind(img);

	img.onerror = function() {
		console.log('error loading image: ' + this.src);
		util.image_loading_errors[this.src]++;
		if(util.image_loading_errors[this.src] < 10) {
			util.load_cached_image(this.key);
		}
	}.bind(this);

},

on_file_completed_download: function(fname) {
	var has_keys = 0;
	for(var key in util.global_files_needed_to_start_game) { has_keys++; }
	if(has_keys != 0) {
		delete util.global_files_needed_to_start_game[fname];
		has_keys = 0;
		for(var key in util.global_files_needed_to_start_game) { has_keys = 1; }
		if(has_keys == 0) {
			on_files_preloaded();
		}
	}

	if(util.global_files_needed_to_draw.length > 0) {
		while(util.global_files_needed_to_draw.length > 0 && util.images_cache[util.global_files_needed_to_draw[0]]) {
			util.global_files_needed_to_draw.shift();
		}

		if(util.global_files_needed_to_draw.length == 0) {
			on_ready_to_draw();
		}
	}
},

preload_image: function(key) {
	util.load_cached_image(key);
	util.global_files_needed_to_start_game[key] = 1;
},

preload_images: function(images) {
	for(var n = 0; n != images.length; ++n) {
		util.preload_image(images[n]);
	}
},

};