(function($) {
	$.fn.dropDown = function(opts) {
		$(this).addClass('dropdown');
		$(this).find('li:has(ul) > a').append(' <span>&raquo;</span>');
		opts = opts || {};
		var effect = opts.effect || 'slideToggle';
		var delay = opts.delay == 0 ? 0 : opts.delay || 'fast';
		$(this).delegate('li', 'hover', function(){
			if (delay) {
				$(this).children('ul')[effect](delay).delay(100);
			} else {
				$(this).children('ul')[effect]().delay(100);
			}
		});
	}
}(jQuery));
