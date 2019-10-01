var scrollMagic = {
	init: function() {
	
	var controller = new ScrollMagic.Controller();

	$(".desktop .fade").each(function(){
	    $(this).addClass('out');
	    new ScrollMagic.Scene({
	      triggerElement: this,
	      triggerHook: 0.8
	    })
	    .on("enter", function(ev){$(ev.target.triggerElement()).removeClass('out');})
	    .on("leave", function(ev){$(ev.target.triggerElement()).addClass('out');})
	    .addTo(controller);
	  });

 

 
	}
}
