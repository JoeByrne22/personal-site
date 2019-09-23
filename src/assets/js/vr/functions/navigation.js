var navigation = {
	init: function() {

		var navigationHeight = $('#navigation').outerHeight();

		$(window).on("scroll touchmove", function () {
			var fixHeaderHeight = $('#intro').outerHeight() - navigationHeight;

			if ($(window).scrollTop() >= fixHeaderHeight) {
		       $('#navigation').addClass('fixed-header');
		    }
		    else {
		       $('#navigation').removeClass('fixed-header');
		    }
		});
 
   

		// scrolling to top
		$('.header .logo').on('click', function(e){
		            var anchor = $(this);
		        $('html, body').stop().animate({
		          scrollTop: $(anchor.attr('href')).offset().top - 00
		        }, 500);
		    e.preventDefault();
		    return false;
		});
 


		/* Menu fade/in out on mobile */
	    $(".open-button").click(function(e){
	        e.preventDefault();
	        $(this).toggleClass('open');
	        $("header.header").toggleClass('open');
	        $(".anchor-nav").toggleClass('open');
	    });



	    $(".progression-next").click(function() {
	    	console.log('hfeuwgifq')

	    })


	    
	}
}

