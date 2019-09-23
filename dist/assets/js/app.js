// define jQuery
jQuery(function($){

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
var introAnimation = {
  init: function() {

  // 	var controller = new ScrollMagic.Controller();

 
		// // LOAD VIDEO AND LOOP IT 
		// var	intro = $("#intro"), 
		// 	Content = $("#intro .content"),
		// 	header = $(".header"),
		// 	navigation = $("#navigation"),
		// 	tiles = $("#navigation .tile");
	 
		// var introTl = new TimelineLite({paused: true})

	 // 	TweenMax.set(tiles, {autoAlpha:0,x:-30, })

		//   introTl
		// 	//.to(intro, 0.1, 	{className: '-=active'})  
		// 	.to(Content, 0.4, 	{autoAlpha:1, ease: Cubic.easeOut})
		// 	.staggerTo(tiles, 1.7, {x:0, autoAlpha:1, ease: Cubic.easeOut}, 0.4)
		//   introTl.play();
	 


		// var introBCG = new TimelineMax();

		// introBCG 
		// 	.to($('#intro .bcg'), 1.4, {y: '20%', scale:1.1, ease:Power1.easeOut}, '-=0.2') 

		// var introScene = new ScrollMagic.Scene({
		// 	triggerElement: '#intro', 
		// 	triggerHook: 0,
		// 	duration: "100%"
		// })
		// .setTween(introBCG)
		// .addTo(controller);

 
 
	 
	}
}

var loader = {
	init: function() {
		  //number of loaded images for preloader progress 
		  var loadedCount = 0; //current number of images loaded
		  var imagesToLoad = $('.bcg').length; //number of slides with .bcg container
		  var loadingProgress = 0; //timeline progress - starts at 0

		  $('.bcg').imagesLoaded({
		    background: true
		  }).progress(function(instance, image) {
		    loadProgress();
		  });

		  function loadProgress(imgLoad, image) {
		    //one more image has been loaded
		    loadedCount++;

		    loadingProgress = (loadedCount / imagesToLoad);

		    //console.log(loadingProgress);

		    // GSAP timeline for our progress bar
		    TweenLite.to(progressTl, 0.7, {
		      progress: loadingProgress,
		      ease: Linear.easeNone
		    });

		  }

		  
		  //progress animation instance. the instance's time is irrelevant, can be anything but 0 to void  immediate render
		  var progressTl = new TimelineMax({
		    paused: true,
		    onUpdate: progressUpdate,
		    onComplete: loadComplete
		  });

		  progressTl
		  //tween the progress bar width
		    .to($('.progress span'), 1, {
		    width: 100,
		    ease: Linear.easeNone
		  });

		  //as the progress bar witdh updates and grows we put the precentage loaded in the screen
		  function progressUpdate() {
		    //the percentage loaded based on the tween's progress
		    loadingProgress = Math.round(progressTl.progress() * 100);
		    //we put the percentage in the screen
		    $(".txt-perc").text(loadingProgress + '%');

		  } 

		function loadComplete() { 
			introAnimation.init();  


			var preloaderOutTl = new TimelineMax(); 
			preloaderOutTl
			.to($('.progress'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn})
			.to($('.txt-perc'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn}, 0.1)
			.set($('body'), {className: '-=is-loading'})
			.set($('body'), {className: '+=is-loaded'})
			.to($('#preloader'), 0.7, {autoAlpha: 0, ease:Power4.easeInOut})
			.set($('#preloader'), {className: '+=is-hidden'})
			.fromTo($('#intro .content'), 1.5, {y: -20, autoAlpha: 1}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0.2') 
			.fromTo($('#intro .bcg'), 1.5, {y:'0%', scale:1.05, autoAlpha: 0}, {y:'0', scale:1, autoAlpha: 1, ease:Power1.easeOut}, 1)
 			return preloaderOutTl;
		} 
	}

}
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


var scrollMagic = {
	init: function() {
 

 
	}
}

var section04 = {
  init: function() { 


    var controller = new ScrollMagic.Controller();
     TweenMax.set("#box04 .heading h1", {scale:0.8, autoAlpha:1, ease: Linear.easeNone})
     TweenMax.set("#box04 .side-left", {force3D:true, y: '90%',  ease: Linear.easeNone})
     TweenMax.set("#box04 .side-right", {force3D:true, y:' -90%',  ease: Linear.easeNone})
     TweenMax.set("#box04 .contact-container", {autoAlpha:0, ease: Linear.easeNone})

   
      var hero05 = new TimelineMax ({ })
          hero05  
          .to("#box04 .heading h1", 7,  {scale:1, autoAlpha:1, ease: Linear.easeNone})
          .to("#box04 .side-left", 8.8,  {y:'-100%', ease: Linear.easeNone}, 2)
          .to("#box04 .side-right", 8.8, {y: '100%', ease: Linear.easeNone}, 2) 
          .to("#box04 .heading h1", 0.8, {autoAlpha:0, ease: Linear.easeNone},8.8)
          .to("#box04 .contact-container", 9, {autoAlpha:1, ease: Linear.easeNone},8.8)
    

 

      var scene05 = new ScrollMagic.Scene({
        triggerElement: ".box04", 
        triggerHook:0,
        duration: '300%'
      })
     	.on("enter", function(){
        //hero05.play(); 
      })

      .setPin('.box04')
      .setTween(hero05)
      .addTo(controller);

      var boxLink = $( '.but' );
      var boxID = $(this).attr("data-target");
      var targetBox = $('.box#' + boxID);


      boxLink.click( function(e) {
        e.preventDefault();

        if ((targetBox).is('.box01')) { 
          scene05 = scene05.destroy(true);
        }
        else if ((targetBox).is('.box02')) { 
          scene05 = scene05.destroy(true);
        }
        else if ((targetBox).is('.box03')) { 
          scene05 = scene05.destroy(true);
        }

      })

       

  }
}

var tabs = {
    init: function() {

        //general click tabs event

        var boxLink = $( '.but' );
        var box = $( '.box' );

        boxLink.click( function() {
        	$('#but1').removeClass('active');
        	$('html,body').animate({scrollTop: $("body").offset().top - 0}, 'slow');

            var boxID = $(this).attr("data-target");
            var currentbox = $('.box:not(.is-hidden)');
            var targetBox = $('.box#' + boxID);

            if (!$(this).hasClass('active'))    {
                boxLink.removeClass('active');
                $(this).addClass('active');

                TweenMax.to(currentbox, 0.2, {ease:Power4.easeOut, className: '-=visible', autoAlpha: 0,  onComplete: boxIn, onCompleteParams: [targetBox] });
                
            } 

            return false;
        });

        var boxIn = function( targetBox ) {
            box.addClass( 'is-hidden' );
            targetBox.removeClass( 'is-hidden' );
 
            TweenMax.to( targetBox, 0.2, {autoAlpha: 1,className: '+=visible', ease:Power4.easeIn});

                if ((targetBox).is('.box04')) { 

                    section04.init(); 
                }

                 
        }
 

        //SECTION02 tabs for subnav
        ////////////////


        var articleLink = $('.btnarticle');
        var article = $('.article');

        articleLink.click( function() {
            $('#but1').removeClass('active');
            $('html,body').animate({scrollTop: $(".article-container").offset().top - 0}, 'slow');

            var boxID = $(this).attr("data-target");
            var currentarticle = $('.article:not(.is-hidden)');
            var targetArticle = $('.article#' + boxID);

            if (!$(this).hasClass('active'))    {
                articleLink.removeClass('active');
                $(this).addClass('active');

                TweenMax.to(currentarticle, 0.2, {ease:Power4.easeOut,className: '-=visible', autoAlpha: 0,  onComplete: articleIn, onCompleteParams: [targetArticle] });
            } 

            return false;
        });

        var articleIn = function( targetArticle ) {
            article.addClass( 'is-hidden' );
            targetArticle.removeClass( 'is-hidden' );

            TweenMax.to( targetArticle, 0.2, {autoAlpha: 1,className: '+=visible', ease:Power4.easeIn});
        }
    }
 

}
 
//  ***********************
//  $$ Document ready
//  ***********************
$(function() {

	window.windowWidth = window.innerWidth;
	window.windowHeight = window.innerHeight;

	window.isiPhone = navigator.userAgent.toLowerCase().indexOf('iphone');
	window.isiPad = navigator.userAgent.toLowerCase().indexOf('ipad');
	window.isiPod = navigator.userAgent.toLowerCase().indexOf('ipod');
	window.isAndroid = function(){ return /Android/i.test(navigator.userAgent); }
	window.getAndroidVersion = function(ua) {
		ua = (ua || navigator.userAgent).toLowerCase();
		var match = ua.match(/android\s([0-9\.]*)/);
		return match ? match[1] : false;
	};


	if ( window.isiPhone > 0 || window.isiPad > 0 || window.isiPod > 0 ) {
		window.isIOS = true;
	} else {
		window.isIOS = false;
	}

	window.tablet = 640;
	window.tabletWide = 800;
	window.desktop = 1024;

	window.isTouch = false;
	if (('ontouchstart' in document.documentElement) || Modernizr.touchevents) {window.isTouch = true}
	// isTouch = true;

	if (isTouch || Modernizr.touchevents) {
		$('html').addClass('touch');
	}

	// Detect IE11 and Add Modernizer-like Class to HTML Element
	if ( $.browser.msie && $.browser.version <= 11 )
		$( 'html' ).addClass( 'lt-ie12' );

	/// Detect Desktop/Mobile and Add Modernizer-like Class to HTML Element
	if ( $.browser.desktop )
		$( 'html' ).addClass( 'desktop' );
	else if ( $.browser.mobile )
		$( 'html' ).addClass( 'mobile' );

	if (window.isAndroid())
		$( 'html' ).addClass( 'android' )

	if (parseInt(getAndroidVersion(), 10) == 6)
		$( 'html' ).addClass( 'android6' )

	// Add functions here
	
	accessibility.init();
	loader.init(); 
	scrollMagic.init(); 
	tabs.init();
	navigation.init(); 
});
});// jQuery end
// no writting in this file
//# sourceMappingURL=app.js.map
