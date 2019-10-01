var tabs = {
    init: function() {

        //general click tabs event

        var paginationLink = $( '.paginationlink' );
        var boxLink = $( '.but' );
        var box = $( '.box' );

        boxLink.click( function() {
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

            if ((targetBox).is('.box02')) {
            } else {
                $('.mobile .open').removeClass('open');
                $(".mobile header.header").removeClass('open');
                $(".mobile .anchor-nav").removeClass('open');
            }
        }

 

        //SECTION02 tabs for subnav
        ////////////////


        var articleLink = $('.btnarticle');
        var article = $('.article');


        articleLink.click( function() {
            $('html,body').animate({scrollTop: $(".article-container").offset().top - 0}, 'slow');

            var boxID = $(this).attr("data-target");
            var currentarticle = $('.article:not(.is-hidden)');
            var targetArticle = $('.article#' + boxID);

            if (!$(this).hasClass('active'))    {
                articleLink.removeClass('active');
                $(this).addClass('active') ;

                TweenMax.to(currentarticle, 0.2, {ease:Power4.easeOut,className: '-=visible', autoAlpha: 0,  onComplete: articleIn, onCompleteParams: [targetArticle] });
            } 

            return false;
        });

        var articleIn = function( targetArticle ) {
            article.addClass( 'is-hidden' );
            targetArticle.removeClass( 'is-hidden' );

            TweenMax.to( targetArticle, 0.2, {autoAlpha: 1,className: '+=visible', ease:Power4.easeIn});
            $('.mobile .open-button.open').removeClass('open'); 
            $(".mobile header.header").removeClass('open');
            $(".mobile .anchor-nav").removeClass('open');
        }
    }
 

}
 