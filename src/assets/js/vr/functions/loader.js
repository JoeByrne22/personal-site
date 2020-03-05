var loader = {
	init: function() {

		console.log('loader')
	// 	  //number of loaded images for preloader progress 
	// 	  var loadedCount = 0; //current number of images loaded
	// 	  var imagesToLoad = $('.bcg').length; //number of slides with .bcg container
	// 	  var loadingProgress = 0; //timeline progress - starts at 0

	// 	  $('.bcg').imagesLoaded({
	// 	    background: true
	// 	  }).progress(function(instance, image) {
	// 	    loadProgress();
	// 	  });

	// 	  function loadProgress(imgLoad, image) {
	// 	    //one more image has been loaded
	// 	    loadedCount++;

	// 	    loadingProgress = (loadedCount / imagesToLoad);

	// 	    //console.log(loadingProgress);

	// 	    // GSAP timeline for our progress bar
	// 	    TweenLite.to(progressTl, 0.7, {
	// 	      progress: loadingProgress,
	// 	      ease: Linear.easeNone
	// 	    });

	// 	  }

		  
	// 	  //progress animation instance. the instance's time is irrelevant, can be anything but 0 to void  immediate render
	// 	  var progressTl = new TimelineMax({
	// 	    paused: true,
	// 	    onUpdate: progressUpdate,
	// 	    onComplete: loadComplete
	// 	  });

	// 	  progressTl
	// 	  //tween the progress bar width
	// 	    .to($('.progress span'), 1, {
	// 	    width: 100,
	// 	    ease: Linear.easeNone
	// 	  });

	// 	  //as the progress bar witdh updates and grows we put the precentage loaded in the screen
	// 	  function progressUpdate() {
	// 	    //the percentage loaded based on the tween's progress
	// 	    loadingProgress = Math.round(progressTl.progress() * 100);
	// 	    //we put the percentage in the screen
	// 	    $(".txt-perc").text(loadingProgress + '%');

	// 	  } 

	// 	function loadComplete() { 

	// 		var preloaderOutTl = new TimelineMax(); 
	// 		preloaderOutTl
	// 		.to($('.progress'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn})
	// 		.to($('.txt-perc'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn}, 0.1)
	// 		.set($('body'), {className: '-=is-loading'})
	// 		.set($('body'), {className: '+=is-loaded'})
	// 		.to($('#preloader'), 0.7, {autoAlpha: 0, ease:Power4.easeInOut})
	// 		.set($('#preloader'), {className: '+=is-hidden'})	


	// 		.fromTo($('#third'), 1, {autoAlpha: 0}, {autoAlpha: 1, ease:Power4.easeIn}) 
	// 		.fromTo($('#second'), 2, {autoAlpha: 0}, {autoAlpha: 1, ease:Power4.easeIn}) 
	// 		.fromTo($('#first'), 3, {autoAlpha: 0}, {autoAlpha: 1, ease:Power4.easeIn}) 

			
	// 		.to($('.header'), 0.5, {autoAlpha: 1, ease:Power1.easeOut})
	// 		.to($('.content-sections'), 0.5, {autoAlpha: 1, ease:Power1.easeOut}) 
	// 		.to($('#intro'), 0.5, {autoAlpha: 0, ease:Power1.easeOut}) 



 // 			return preloaderOutTl;
	// 	} 
	}

}