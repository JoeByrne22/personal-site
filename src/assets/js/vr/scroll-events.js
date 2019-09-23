// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

// don't think we need the scrolling show/hide feature anymore, but maybe on mobile, check with designers and adapt

// setInterval(function() {
//     if (didScroll) {
//         hasScrolled();
//         didScroll = false;
//     }
// }, 250);

// function hasScrolled() {
//     var st = $(this).scrollTop();

//     // Make sure they scroll more than delta
//     if(Math.abs(lastScrollTop - st) <= delta) {
//         return;
//     }

//     // If they scrolled down and are past the navbar, add class .nav-up.
//     // This is necessary so you never see what is "behind" the navbar.
//     if (st > lastScrollTop && st > navbarHeight){
//         // Scroll Down
//         if (mobileClosed) {
//             $('.sticky-nav').addClass('hideh');

//             var dd_login = $('#login').find('.dropdown-button');
//             if (dd_login.hasClass('active')) {
//                 dd_login.trigger('click');
//             }
//         }
//     } else {
//         // Scroll Up
//         if(st + $(window).height() < $(document).height()) {
//             if ($('.page-village-map').length && window.innerWidth >= 1024) {
//                 return;
//             } else {
//                 $('.sticky-nav').removeClass('hideh');
//             }
//         }
//     }

//     lastScrollTop = st;
// }


$(window).scroll(function(event){
	didScroll = true;
});

if ($('.slide-content-header ').length && !$('.slide-content-header.hide-arrow').length) {
    $(window).scroll(function(event){
        if ($(document).scrollTop() > 100) {
            $('.slide-content-header').addClass('hide-arrow');
        }
    });
}
