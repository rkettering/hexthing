require.config({
    urlArgs: "v=" +  (new Date()).getTime()
    // require.js is trying to be 'helpful' by caching JS files between loads; don't let it.
});

require(["jquery", "misc", "gameplay", "code", "util", "tile"], function($) {
    //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
    $(function() {
        $(document).ready(function() {
			init_game(); 
		});
    });
});
