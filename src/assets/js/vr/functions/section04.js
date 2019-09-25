      var section04 = {
  init: function() { 


    var controller = new ScrollMagic.Controller();


     TweenMax.set("#box04 .heading h1", {scale:0.8, autoAlpha:1, ease: Linear.easeNone})
     TweenMax.set("#box04 .side-left", {force3D:true, y: '72%',  ease: Linear.easeNone})
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
        triggerHook: 0,
        duration: '300%'
      })
      .on("enter", function(){
        console.log('onEnter')
        //hero05.play(); 
      })
      .on("leave", function(){
        console.log('onLeave')
        scene05 = scene05.destroy(true);
        scene05 = null;
      })
      .setClassToggle('#box04', 'is-active')
      .setPin('.box04')
      .setTween(hero05)
      .addTo(controller);

 
       
 
     

  }
}
