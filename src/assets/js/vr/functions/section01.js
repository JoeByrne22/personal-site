var section01 = {
  init: function() {
    console.log("section01 ready!!");
    //simulate activation
    // $(".scroll-deck1 h1").addClass("active");

    // init controller
    var controller = new ScrollMagic.Controller({ addIndicators: true });

    var tweenHi = gsap.timeline({ duration: 1, ease: Back.ease });

    tweenHi.fromTo(
      "#section01 .three-box",
      { autoAlpha: 1, xPercent: 0 },
      { autoAlpha: 1, xPercent: -100 },
      0
    );
    //   .to(".desktop .animation .first", { autoAlpha: 1 }, 0)
    //   .to(".desktop .headings .one", { autoAlpha: 0, y: -100 }, 1);

    var scene01 = new ScrollMagic.Scene({
      triggerElement: "#section01",
      duration: "100%",
      triggerHook: 0
    })
      .setTween(tweenHi)
      .setPin("#section01")
      .addTo(controller);
  }
};
