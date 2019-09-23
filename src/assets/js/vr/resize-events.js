//  ***********************
//  $$ Smart resize
//  ***********************
(function ($, sr) {
	var debounce = function (func, threshold, execAsap) {
		var timeout;
		return function debounced() {
			var obj = this,
				args = arguments;
			function delayed() {
				if (!execAsap) {
					func.apply(obj, args);
				}
				timeout = null;
			}
			if (timeout) {
				clearTimeout(timeout);
			} else if (execAsap) {
				func.apply(obj, args);
			}
			timeout = setTimeout(delayed, threshold || 500);
		};
	};
	jQuery.fn[sr] = function (fn) {
		return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
	};
})(jQuery, 'smartresize'); // End smartresize


$(window).smartresize(function () {
	window.newWindowWidth = window.innerWidth;
	window.newWindowHeight = window.innerHeight;

	//	responsive-helpers.js
	// bh.setHelpers(newWindowWidth, newWindowHeight);

	//	Add functions here

	if (windowWidth >= desktop && newWindowWidth < desktop) {
		//	sliders.js
		slider.pause();
		//	nav.js
		nav.openClose.closeNavResizeDown();
		nav.openClose.offCanvasScroll();
		nav.openClose.undoDisableSearch();
	}

	if ($('.slider-hero-extended').length) {
		slider.homeSlideHeight(newWindowWidth, newWindowHeight);
	}

	if (windowWidth < desktop && newWindowWidth >= desktop) {
		//	nav.js
		nav.openClose.undoMobile();
		nav.openClose.closeNavResize();
		nav.openClose.undoOffCanvasScroll();

		//	sliders.js
		slider.desktopOnly();

		//	forms.js
		form.keyboardAmends();
	}

	if (newWindowWidth < desktop && $('.site-canvas.active').length > 0) {
		// nav.js
		nav.openClose.cutHeight(newWindowHeight);
	}
	//	ellipsis.js
	if (ellipsis.editorial.applyEl.length > 0 || ellipsis.freeText.applyEl.length > 0 || ellipsis.promoTextLong.copy.length > 0) {

		if (windowWidth < tablet && newWindowWidth >= tablet) {
			ellipsis.editorial.loadApply();
			ellipsis.freeText.loadApply();
			ellipsis.promoTextLong.loadApply();
		}
		if (newWindowWidth >= tablet) {
			ellipsis.editorial.resizeApply();
			ellipsis.freeText.resizeApply();
			ellipsis.promoTextLong.resizeApply();
		}
		if (windowWidth >= tablet && newWindowWidth < tablet) {
			ellipsis.editorial.undoEllipsis();
			ellipsis.freeText.undoEllipsis();
			ellipsis.promoTextLong.undoEllipsis();
		}
	}

	if (ellipsis.editorial.feedApplyEl.length > 0) {
		ellipsis.editorial.resizeApplyFeed();
	}

	if ($('.ellipsis').length > 0) {
		ellipsis.removeEmpty();
	}

	$('.ellipsis-new').each(function(){
		ellipsisNew.applyEllipsis($(this), true);
	});

	if (windowWidth < tabletWide && newWindowWidth >= tabletWide) {
		// filter.js
		filter.undoSpecialDd();
	}

	// unslick and re slick sliders
	// slider.homeHeroProducts();

	// if (ellipsis.treat.copy.length) {
	// 	ellipsis.treat.resizeApply();
	// }

	// interactive-map.js
	// if (map.container.length > 0) {
	// 	map.dragableReset();
	// }

	// Touch device only
	if (isTouch) {

		// Reset product zoom widget if open
		if (Math.abs(windowWidth - newWindowWidth) > 200 && $('.zoom-open').length) {
			// Reset any existing panzoom on window resize
			zoom.resetPanZoom($('.zoom-open')); // zoom.js
		}
	}

	if ( (windowWidth < desktop && newWindowWidth >= desktop) || (windowWidth >= desktop && newWindowWidth < desktop) ) {
		setTimeout(function(){
			weather.clearOnResize(); // weather.js
		},500);
	}

	// Interactive Map
	window.vrMap.resize();

	// wear.js
	if (wearTab.wearWrapper.length) {
		wearTab.checkIfAplicable();
	}


	window.windowWidth = window.innerWidth;
	window.windowHeight = window.innerHeight;
});