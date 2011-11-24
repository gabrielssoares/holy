(function($) {

	var id = 1;
	$.idgen = function(p) {
		if (!p) {
			return (id++);
		}
		return ('' + p) + (id++);
	}

	$.fn.sendByFrame = function(url, callback) {
		var form = $(this).closest('form');
		if (url) {
			form.attr('action', url);
		}
		if (!callback) {
			callback = function() {
			};
		}
		var frame = $("<iframe />");
		var name = $.idgen('sendformbyframe-');
		frame.hide();
		frame.data('sendbyframe.callback', callback);
		frame.data('sendbyframe.form', form);
		form.attr('target', name);
		frame.attr('name', name);
		frame.load(function() {
			var frame = $(this);
			var callback = frame.data('sendbyframe.callback');
			var form = frame.data('sendbyframe.form');
			callback.call(form, frame);
			frame.delay(2000).fadeOut(2, function() {
				$(this).remove();
			});
		});
		frame.insertAfter(form);
		form.submit();
	}

	$.ajaxPrefilter(function(opts, original, xhr) {
		if (!opts.frame) {
			return;
		}
		xhr.abort();
		var form = $(opts.form);
		form.sendByFrame(opts.url, opts.complete);
	});

})(jQuery);
