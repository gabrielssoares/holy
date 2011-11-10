(function($) {
	jQuery.loading = function(opts) {

		jQuery.ajaxSetup({
			loading : true
		});

		var bgOver = opts.overlay;
		if (!bgOver) {
			bgOver = '#000000'
		}
		
		var overOpacity = opts.opacity;
		if (!overOpacity) {
			overOpacity = '50'
		}
		
		if (!$('.loading').length) {
			$('body').append('<div class="loading"><div class="load"></div><div class="overlay"></div></div>');
		}
		
		$('.loading .load').center();

		var stack = 0;

		$('body').ajaxSend(function(evt, xhr, ajax) {
			if (!ajax.loading) {
				return;
			}
			if (ajax.loading === true) {
				if (stack < 0) {
					throw 'error: stack < 0: ' + stack;
				}
				stack++;
				if (stack == 1) {
					$('.loading').fadeIn('fast');
				}
				return;
			}
			$(ajax.loading).each(function() {
				var stack = $(this).data('loading-ajax-stack');
				if (!stack) {
					stack = 0;
				}
				if (stack < 0) {
					throw 'error: stack < 0: ' + stack;
				}
				stack++;
				if (stack == 1) {
					var div = $('<div class="loading"><div class="load"></div><div class="overlayInside"></div></div>');
					div.css('position', 'absolute');
					div.css('left', $(this).position().left);
					div.css('top', $(this).position().top);
					div.css('width', $(this).width());
					div.css('height', $(this).height());
					$('body').append(div);
					$(this).data('loading-ajax', div);
				}
				$(this).data('loading-ajax-stack', stack);
			});
		});
		$("body").ajaxComplete(function(evt, xhr, ajax) {
			if (!ajax.loading) {
				return;
			}
			if (ajax.loading === true) {
				if (stack <= 0) {
					throw 'error: stack <= 0: ' + stack;
				}
				if (stack == 1) {
					$('.loading').fadeOut('fast');
				}
				stack--;
				return;
			}
			$(ajax.loading).each(function() {
				var stack = $(this).data('loading-ajax-stack');
				if (!stack || stack <= 0) {
					throw 'error: !stack || stack <= 0: ' + stack;
				}
				if (stack == 1) {
					var div = $(this).data('loading-ajax');
					$(this).data('loading-ajax', null);
					$(this).data('loading-ajax-stack', 0);
					div.remove();
				} else {
					stack--;
					$(this).data('loading-ajax-stack', stack);
				}
			});
		});
	}
})(jQuery);
