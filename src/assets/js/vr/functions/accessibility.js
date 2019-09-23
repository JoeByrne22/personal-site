var accessibility = {

	elms: {
		skip: $('.skip')
	},

	//  Skip navigation functionality for tab navigation
	skipNav: function() {
		accessibility.elms.skip.click(function(){
			var skipTo='#'+this.href.split('#')[1];
			$(skipTo).attr('tabindex', -1).on('blur focusout', function () {
				$(this).removeAttr('tabindex');
			}).focus();
		});
	},

	init: function() {
		accessibility.skipNav();
	}
};