var navigation = {
	init: function() {



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
	        	//$('.tile').removeClass('active')
	        	$('.tile').removeClass('open') 
	        	$('.hassubnav').removeClass('mobile-nav')
	        }

	    });

	    var mobileNavBtn = $('.mobile li.but')
         
         mobileNavBtn.on('click', function(){

         	var boxIn = function( targetBox ) {
	            box.addClass( 'is-hidden' );
	            targetBox.removeClass( 'is-hidden' );
	

            TweenMax.to( targetBox, 0.2, {autoAlpha: 1, className: '+=visible', ease:Power4.easeIn});

          
        }

            var box = $( '.box' ); 
         	var boxID = $(this).attr("data-target");
         
           var currentbox = $('.box:not(.is-hidden)');
           var targetBox = $('.box#' + boxID);

            mobileNavBtn.removeClass('active');
            $(this).addClass('active');
            mobileNavBtn.removeClass('mobile-nav');
            $(this).addClass('mobile-nav');
            console.log('febwhafvejwkqfewq')
            if ($(this).hasClass('hassubnav')) {
            	console.log('nottodat bub')
            	$(this).removeClass('acti')
            } else {
	            $('#navigation').removeClass('open')
	            $('.open-button').removeClass('open')
            }

  
          TweenMax.to(currentbox, 0.2, {ease:Power4.easeOut, className: '-=visible', autoAlpha: 0,  onComplete: boxIn, onCompleteParams: [targetBox] });


        });     	    
	}
}

