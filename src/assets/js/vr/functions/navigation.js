var navigation = {
	init: function() {

		// var navigationHeight = $('#navigation').outerHeight();

		// $(window).on("scroll touchmove", function () {
		// 	var fixHeaderHeight = $('#intro').outerHeight() - navigationHeight;

		// 	if ($(window).scrollTop() >= fixHeaderHeight) {
		//        $('#navigation').addClass('fixed-header');
		//     }
		//     else {
		//        $('#navigation').removeClass('fixed-header');
		//     }
		// });
 
   

		// scrolling to top
		$('.header .logo').on('click', function(e){
		            var anchor = $(this);
		        $('html, body').stop().animate({
		          scrollTop: $(anchor.attr('href')).offset().top - 00
		        }, 500);
		    e.preventDefault();
		    return false;
		});

		// arrow-down scroll icon 
		$('.arrow-down, .progression-next').on('click', function(e){
		            var anchor = $(this);
		        $('html, body').stop().animate({
		          scrollTop: $(anchor.attr('href')).offset().top - 00
		        }, 500);
		    e.preventDefault();
		    return false;
		});

		/* Menu fade/in out on mobile */
	    $(".mobile  .open-button").click(function(e){

	        e.preventDefault();
	        $(this).toggleClass('open');
	        $("header.header").toggleClass('open');
	        $(".anchor-nav").toggleClass('open');
	        if ($('.tile').hasClass('active')) {
	        	$('.tile').removeClass('active')
	        	$('.tile').removeClass('open')
	        	$('.tile').removeClass('hidden')
	        }

	    });



		$('.mobile .hassubnav').on('click', function(e){
		   //      if (!$('.hassubnav').hasClass('active')) {
		   //      	console.log('add active')
					// $('.hassubnav').addClass('active');        	
		   //      } else if ($('.hassubnav').hasClass('active')) {
					// console.log('remove actcewoh')
					// $('.hassubnav').removeClass('active');        	

		   //      } 


			console.log('fgyiewgbjks')

			// $(this).addClass('active');
			$('.hassubnav').toggleClass('open');
			$('.hassubnav').addClass('active');
			$('.tile').toggleClass('hidden');
			$('.hassubnav').removeClass('hidden');

		});		


	    
	}
}

