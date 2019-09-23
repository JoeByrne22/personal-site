if ($('.full-video').length > 0) {

	if ($('[data-video-client="youtube"]').length > 0) {
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}

	var players = {};

	$('.video-cover').each(function() {
		var _this = $(this);
		var videoId = _this.attr('data-video-trigger');
		var videoClient = _this.attr('data-video-client');
		var videoContainer = _this.closest('.full-video').find('.video-embed');

		if (videoClient === 'youtube') {
			var videoObject = $('<iframe id="'+videoId+'" class="youtube-video" width="640" height="390" src="https://www.youtube.com/embed/'+videoId+'?rel=0&enablejsapi=1&wmode=transparent" frameborder="0" allowfullscreen></iframe>');
			videoContainer.append(videoObject);
		}
	});

	function onYouTubePlayerAPIReady() {
		$(document).ready(function() {
			$('.youtube-video').each(function(event) {
				var iframeID = $(this).attr('id');
				players[iframeID] = new YT.Player(iframeID, {
					events: {
						'onStateChange': videos.onStateChange
					}
				});
			});
		});
	};
}