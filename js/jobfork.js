(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);

(function(){
    var title = "Hey fellow Australian Developer!";
	var message = "You should checkout <strong><a href='http://jobfork.com.au/?utm_source=lukencode&utm_medium=flash&utm_campaign=blogs' target='_blank'>JobFork.com.au</a></strong> - a job board for the best developers and dev jobs in Australia";
	
	function showAlert() {
		//todo check close cookie
		
		if(!$.cookie('jobfork_closed')) {		
			var bar = "<div class='messagebar'><span class='title'>" + title + "</span><span class='message'>" + message + "</span><a class='close-message'>X</a></div>";
			$("body").prepend(bar);
			
			bindAlertEvents();
		}
	}
	
	function bindAlertEvents() {
		$(".close-message").click(function () {
			$.cookie('jobfork_closed', 'true', { expires: 60, path: '/' });
			
			$(this).parent().animate({
				height: 0,
				opacity:0
			}, 150);
			$("body").animate({
				"paddingTop" :0
			}, 150);
		});

		$(".messagebar").animate({
			height: 30,
			opacity:100
		}, 150);

	}
	
	function getCountry() {
		if($.cookie('country')) {
			if($.cookie('country') === "AU") 
				showAlert();
		} else {
			$.getJSON( "http://smart-ip.net/geoip-json?callback=?",
				function(data){
					$.cookie('country', data.countryCode, { expires: 30, path: '/' });
				
					if(data.countryCode === "AU") 
						showAlert();
				}
			);
		}
	}
	
	$(function(){
		getCountry();
	});
	
})();