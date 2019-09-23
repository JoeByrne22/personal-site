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
 