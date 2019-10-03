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
	        if ($('.tile.hassubnav').hasClass('active')) {
	        	$('.tile').removeClass('active')
	        	$('.tile').removeClass('open') 
	        	$('.hassubnav').removeClass('mobile-nav')
	        }

	    });


         
         $('.mobile li.but').on('click', function( ){

         	var boxIn = function( targetBox ) {
            box.addClass( 'is-hidden' );
            targetBox.removeClass( 'is-hidden' );

            //TweenMax.to( targetBox, 0.2, {autoAlpha: 1,className: '+=visible', ease:Power4.easeIn});

            if ((targetBox).is('.box04')) { 
                section04.init(); 
            }

            if ((targetBox).is('.box02')) {
            } else {
                $('.mobile .open').removeClass('open');
                $(".mobile header.header").removeClass('open');
                $(".mobile .anchor-nav").removeClass('open');
            }
        }

            var box = $( '.box' ); 
         	var boxID = $(this).attr("data-target");
         
          var currentbox = $('.box:not(.is-hidden)');
           var targetBox = $('.box#' + boxID);
          $(this).toggleClass('active');
          $(this).toggleClass('mobile-nav'); 
          TweenMax.to(currentbox, 0.2, {ease:Power4.easeOut, className: '-=visible', autoAlpha: 0,  onComplete: boxIn, onCompleteParams: [targetBox] });


        });     	    
	}
}

