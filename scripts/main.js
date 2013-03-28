require.config({
    // require.js is trying to be 'helpful' by caching JS files between loads; don't let it.
    urlArgs: "v=" +  (new Date()).getTime(),
    
    shim: {
    	easel: {
    		exports: 'createjs'
    	}
    },
    paths: {
    	easel: '../external/easeljs-0.6.0.min'
    }
});

require(["jquery", "misc", "widget", "gameplay", "code", "util", "tile", "easel"], function($) {
    //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
    $(function() {
        $(document).ready(function() {
			init_game(); 
		});
    });
});
