(function($) {
	$.holyavenger = {
		parseEngine : function(xmlDoc, context) {
			if (typeof (xmlDoc) == 'string') {
				xmlDoc = $.parseXML(xmlDoc);
			}
			if (!context) {
				context = {};
			}
			if (!context.hvars) {
				context.hvars = {};
			}
			var tags = $(xmlDoc).find('engine > *');
			$.each(tags, function(idx, tag) {
				var parser = $.holyavenger.parsers[tag.nodeName];
				if (parser) {
					parser(tag, context);
				} else {
					throw 'Parser for <' + tag.nodeName + '> not found.'
				}
			});
		},
		parsers : {},
		addParsers : function(_parsers) {
			jQuery.extend($.holyavenger.parsers, _parsers);
		},
		parseAction : function(action, context) {
			action = $(action);
			var selector = action.attr('id') ? '#' + action.attr('id') : action
					.attr('selector');
			if (action.attr('target')) {
				selector = eval(action.attr('target'));
			}
			if (!selector) {
				throw "<action> requires id or selector attribute";
			}
			if (!action.attr('append')) {
				$(selector).html('');
			}
			var text = $.holyavenger.readText(action);
			$(selector).append(text);
		},
		parseScript : function(script, context) {
			var text = $(script).text();
			text = [ 'var func = function () {', text, '}; func;' ].join('');
			var func = eval(text);
			func = $.proxy(func, context);
			$(func);
		},
		parseText : function(text, context) {
			var xml = $(text);
			var text = $.holyavenger.readText(xml);
			var name = xml.attr('name');
			context.hvars[name] = text;
		},
		readText : function(element) {
			var ret = [];
			$.each($(element).contents(), function(idx, child) {
				ret.push($.holyavenger.readChildrenText(child));
			});
			return ret.join('');
		},
		readChildrenText : function(element) {
			var ret = [];
			if (element.nodeType == 1) {
				// It is element
				ret.push('<', element.nodeName);
				var attrs = element.attributes;
				for ( var i = 0; i < attrs.length; i++) {
					var attr = attrs.item(i);
					ret.push(' ', attr.name, '="', attr.value, '"');
				}
				ret.push(">");
				ret.push($.holyavenger.readText(element));
				ret.push("</", element.nodeName, ">");
			} else if (element.nodeType == 3 || element.nodeType == 4) {
				// It is text or cdata
				ret.push(element.data);
			}
			return ret.join('');
		}
	};

	$.holyavenger.addParsers({
		'action' : $.holyavenger.parseAction,
		'script' : $.holyavenger.parseScript,
		'text' : $.holyavenger.parseText
	});

	$.ajaxSetup({
		converters : {
			'xml holyavenger' : true,
			'xml holy' : true
		}
	});

	$.ajaxPrefilter(function(options, originalOpts, jqXHR) {
		var dataType = originalOpts.dataType;
		if (dataType && (dataType === 'holy' || dataType === 'holyavenger')) {
			var callback = options.success;
			var holyCallback = function(doc) {
				var context = this;
				$.holyavenger.parseEngine(doc, context);
				if (callback) {
					callback = $.proxy(callback, context);
					callback(arguments);
				}
			};
			options.success = holyCallback;
			return 'xml';
		}
	});

	$.holy = function(url, context) {
		$.ajax({
			url : url,
			dataType : 'holy',
			context : context
		});
	}

	$.executeHoly = function(template, context) {
		return $.holyavenger.parseEngine(template, context);
	}

})(jQuery);