//  ***********************
//  $$ Document ready
//  ***********************
$(function() {
  window.windowWidth = window.innerWidth;
  window.windowHeight = window.innerHeight;

  window.isiPhone = navigator.userAgent.toLowerCase().indexOf("iphone");
  window.isiPad = navigator.userAgent.toLowerCase().indexOf("ipad");
  window.isiPod = navigator.userAgent.toLowerCase().indexOf("ipod");
  window.isAndroid = function() {
    return /Android/i.test(navigator.userAgent);
  };
  window.getAndroidVersion = function(ua) {
    ua = (ua || navigator.userAgent).toLowerCase();
    var match = ua.match(/android\s([0-9\.]*)/);
    return match ? match[1] : false;
  };

  if (window.isiPhone > 0 || window.isiPad > 0 || window.isiPod > 0) {
    window.isIOS = true;
  } else {
    window.isIOS = false;
  }

  window.tablet = 640;
  window.tabletWide = 800;
  window.desktop = 1024;

  window.isTouch = false;
  if ("ontouchstart" in document.documentElement || Modernizr.touchevents) {
    window.isTouch = true;
  }
  // isTouch = true;

  if (isTouch || Modernizr.touchevents) {
    $("html").addClass("touch");
  }

  // Detect IE11 and Add Modernizer-like Class to HTML Element
  if ($.browser.msie && $.browser.version <= 11) $("html").addClass("lt-ie12");

  /// Detect Desktop/Mobile and Add Modernizer-like Class to HTML Element
  if ($.browser.desktop) $("html").addClass("desktop");
  else if ($.browser.mobile) $("html").addClass("mobile");

  if (window.isAndroid()) $("html").addClass("android");

  if (parseInt(getAndroidVersion(), 10) == 6) $("html").addClass("android6");

  // Add functions here

  swiper.init();
  loader.init();
  scrollMagic.init();
  tabs.init();
  navigation.init();
});
