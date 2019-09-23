	/*
 * Mapplic - Custom Interactive Map Plugin by @sekler
 * Version 4.0
 * http://www.mapplic.com/
 *
 * Modified by
 * 		Jaime DeFedrico <jaime.defedrico@iris-worldwide.com>
 * 		Rich Nelson <info@rich-nelson.co.uk>
 */

;(function($) {

	"use strict";

	/*************************************************
	 * PLUGIN CONSTANTS
	 *************************************************/
	var DISPLAY_MODE_DESKTOP = 1;
	var DISPLAY_MODE_MOBILE = 0;

	var DRAG_THRESHOLD = 0.2;

	var DURATION_TOUCH = 100;
	var DURATION_SHORT = 300;
	var DURATION_NORMAL = 600;
	var DURATION_LONG = 1200;

	var ERROR_LOCATION_THRESHOLD = 0;

	var EVENT_DATA_LOAD = "load.mapplic.data";
	var EVENT_LOCATION_CLOSE = 'close.mapplic.location';
	var EVENT_LOCATION_OPEN = 'open.mapplic.location';
	var EVENT_MAP_READY = 'ready.mapplic.map';
	var EVENT_POSITION_CHANGE = 'change.mapplic.position';
	var EVENT_TOOLTIP_LINK = "link.mapplic.tooltip";

	var FIT_AXIS_X = 0;
	var FIT_AXIS_Y = 1;

	var LABEL_MARGIN_LEFT = 6;

	var LOCATION_STATE_ACTIVE = 0;
	var LOCATION_STATE_HIGHLIGHT = 1;
	var LOCATION_STATE_NONE = 2;

	var PIN_NAME_DEFAULT = 'new-stores';

	var STYLE_ACTIVE = 'mapplic-active';
	var STYLE_COMPASS = 'mapplic-compass';
	var STYLE_DEBUG = 'mapplic-debug';
	var STYLE_DEBUG_PIN = 'mapplic-debug-pin';
	var STYLE_DEVELOPER = 'mapplic-element--developer';
	var STYLE_DRAGGING = 'mapplic-dragging';
	var STYLE_ELEMENT = 'mapplic-element';
	var STYLE_ELEMENT_ERROR = 'mapplic-element--error';
	var STYLE_ELEMENT_LOADING = 'mapplic-element--loading';
	var STYLE_INTERACTIVE = 'mapplic-interactive';
	var STYLE_LABEL = 'mapplic-label';
	var STYLE_LOCATION_DYNAMIC = 'mapplic-dynamic';
	var STYLE_LOCATION_STATIC = 'mapplic-static';
	var STYLE_NON_BRAND_UNIT = 'non-brand-unit'
	var STYLE_PIN = 'mapplic-pin';
	var STYLE_ZOOM_CONTROLS = 'mapplic-zoom-controls';

	var SELECTOR_ACTIVE = '.' + STYLE_ACTIVE;
	var SELECTOR_CONTAINER = '.mapplic-container';
	var SELECTOR_LOCATION_DYNAMIC = '.' + STYLE_LOCATION_DYNAMIC;
	var SELECTOR_LOCATION_STATIC = '.' + STYLE_LOCATION_STATIC;

	var TOOLTIP_FLIP_THRESHOLD = 0.5;
	var TOOLTIP_MARGIN_LEFT = 26;
	var TOOLTIP_MARGIN_RIGHT = 26;



	/*************************************************
	 * MAPPLIC
	 *************************************************/
	var Mapplic = function( jQueryElement, options ) {


		/* ----- PRIVATE VARS ----- */
		var self = this;
		var $document = $( document );
		var $window = $( window );


		/* ----- PUBLIC VARS ----- */
		self.el;
		self.compass;
		self.container;
		self.layer;
		self.map;
		self.mapImage;
		self.tooltip;
		self.zoomControls;

		self.debug;
		self.deepLink;

		self.data;

		self.locations;
		self.activeLocation;

		self.contentWidth;
		self.contentHeight;
		self.x;
		self.y;
		self.scale;

		self.fitAxis;
		self.fitScale;

		self.dragStartX;
		self.dragStartY;
		self.hammer;
		self.pinchStartScale;

		self.displayMode;



		self.o = {
			source: 'locations.json',
			tooltip: true,
			developer: false,
			maxscale: 4,
			zoom: true
		};





		/* ----- PRIVATE FUNCTIONS ----- */
		var init = function( jQueryElement, options ) {
			console.log( "Mapplic: init" );

			self.el = jQueryElement;

			// Merging options with defaults
			self.o = $.extend( self.o, options );

			// Set Variable Defaults
			self.container = self.el.find( SELECTOR_CONTAINER );

			self.locations = [];

			self.x = 0;
			self.y = 0;
			self.scale = 1;

			// Set Mapplic Element Class
			self.el.addClass( STYLE_ELEMENT )

			// Set Default Display Mode
			self.displayMode = self.o.displayMode || DISPLAY_MODE_MOBILE;

			// Resize Element
			resizeElement();

			// Load Data
			loadData( self.o.source );

		}

		var loadData = function( source ) {
			// console.log( "Mapplic: loadData", source );

			// Load Data via AJAX
			if ( typeof( source ) === 'string' ) {

				showLoading();

				$.getJSON( source, function( data ) {

					self.el.trigger( EVENT_DATA_LOAD, [ data ] );
					processData( data );

				} ).fail( function() {

					console.error( 'Failed to load map data.' );
					hideLoading();
					showError();

				} );

			// Load Data as Inline JSON Object
			} else {

				self.el.trigger( EVENT_DATA_LOAD, [ source ] );
				processData( source );

			}

		}

		var loadImage = function( source ) {
			console.log( "Mapplic: loadImage:", source );

			$.get( source, null, null, "html" )
				.done( function( data, textStatus, jqXHR ) {
					console.info( "SVG Load Successful!" );

					hideLoading();
					self.mapImage.append( data );

					processImage();
					processLocations( self.data.locations );

					finalSetup();

				} )
				.fail( function() {
					console.error( "Failed to load map image!" );

					hideLoading();
					showError();

				} );

		}

		var processData = function( data ) {
			// console.log( "Mapplic: processData" );

			// Set JSON Data
			self.data = data;

			// Check Default Pin
			var hasDefaultPin = ( self.data.pins[ PIN_NAME_DEFAULT ] !== undefined );
			console.assert( hasDefaultPin, "Default pin is not defined!" );

			if ( hasDefaultPin ) {

				// Get Cpntent Dimensions
				self.contentWidth = data.mapWidth;
				self.contentHeight = data.mapHeight;

				// Create Map Element
				addMap();

				// Add Level (only supports single level)
				addLayer();

				// Tooltip
				addTooltip();

				// Compass
				self.compass = new MapplicCompass();
				self.compass.init( self.data.compass );
				self.compass.el.appendTo( self.container );

				// Zoom buttons
				self.zoomControls = new MapplicZoomControls();
				self.zoomControls.init( self.data.zoom );
				self.zoomControls.el.appendTo( self.container );

				self.zoomControls.zoomIn.on( 'click', onZoomInClick );
				self.zoomControls.zoomOut.on( 'click', onZoomOutClick );

				// Add Controls
				addControls();

				// Debug Tools
				if ( self.o.debug ) {

					self.el.addClass( STYLE_DEVELOPER );
					self.debug = new MapplicDebug();
					self.debug.init();
					self.debug.el.appendTo( self.container );
					self.debug.pin.appendTo( self.layer );
					self.map.on( 'click', onDebugClick );

				}

			} else {

				// Show Error
				hideLoading();
				showError();

			}

		}

		var processImage = function() {
			console.log( "Mapplic: processImage" );

			if ( !self.debug ) {

				$( '*[id^=location-static] > *:first-child' ).addClassSVG( STYLE_LOCATION_STATIC );
				$( '*[id^=location-dynamic] > *:first-child' ).addClassSVG( STYLE_LOCATION_DYNAMIC );

			} else {

				var label;
				var labelY;
				var labelX;
				var locationId;
				var locationRect;

				var mapTop = self.map[0].getBoundingClientRect().top + window.scrollY;
				var mapLeft = self.map[0].getBoundingClientRect().left + window.scrollX;

				$( '*[id^=location] > *:first-child' ).each( function( index, location ) {

					location.classList.add( STYLE_LOCATION_STATIC );

					locationId = location.getAttribute( 'id' );
					locationRect = location.getBoundingClientRect();

					label = new MapplicLabel();
					label.init( locationId, {
						text: locationId,
						zoom: 0
					} );
					label.el.appendTo( self.layer );
					label.show();

					labelX = ( locationRect.left + window.scrollX + locationRect.width / 2 - mapLeft ) / self.data.mapWidth;
					labelY = ( locationRect.top + window.scrollY + locationRect.height / 2 - mapTop ) / self.data.mapHeight;
					label.position( labelX, labelY );

					label.el.css( {
						backgroundColor: "rgba( 0, 0, 0, 0.1 )",
						transform: "translate( -50%, -50% )"
					} );

				} );

			}

		}

		var processLocations = function( data ) {
			// console.log( "Mapplic: processLocations", data );

			if ( !self.debug ) {

				// Iterate through locations
				$.each( data, function( index, locationData ) {
					//console.info( locationData );

					if ( validateLocationData( locationData ) ) {

						if ( locationData.unitType )
							locationData.details.unitType = self.data.unitTypes[ locationData.unitType ];

						addLocation( locationData );

					}

				} );

				// Audit Locations
				console.info( self.locations.length + " locations added of " + data.length + ": " + ( self.locations.length / data.length * 100 ).toString() + "%" );
				console.assert( self.locations.length / data.length >= ERROR_LOCATION_THRESHOLD, "Too many locations failed to be added!" );

			}

		}

		var finalSetup = function() {
			// console.log( "Mapplic: finalSetup" );

			if ( self.locations.length / self.data.locations.length >= ERROR_LOCATION_THRESHOLD  ) {

				// Reset All Location States
				self.clearHighlight();

				// Update Locations
				updateLocations();

				// Resize
				self.resize();

				// Check Deep Linking and Activate Location
				self.deepLink = new MapplicDeepLink();
				$window.on( 'popstate', onPopState );

				// Default Position/Zoom
				var deepLinkId = self.deepLink.getId();

				if ( deepLinkId ){
					self.showLocation( deepLinkId, 0, true );
				}else{
					if ( self.displayMode === DISPLAY_MODE_MOBILE )
						self.moveTo( self.data.mobileMapX, self.data.mobileMapY, self.data.mobileMapZoom, 0 );
					else
						self.moveTo( self.data.mapX, self.data.mapY, self.data.mapZoom, 0 );
				}

				// Trigger event
				self.el.trigger( EVENT_MAP_READY, self );

			} else if ( self.debug ) {

				// Resize
				self.resize();

				// Zoom
				if ( self.displayMode === DISPLAY_MODE_MOBILE )
						self.moveTo( self.data.mobileMapX, self.data.mobileMapY, self.data.mobileMapLocationZoom, 0 );
					else
						self.moveTo( self.data.mapX, self.data.mapY, self.data.mapZoom, 0 );

				// Trigger event
				self.el.trigger( EVENT_MAP_READY, self );

			} else {

				showError();

			}

		}

		var addControls = function() {
			// console.log( "Mapplic: addControls" );

			// Detect Touch
			var isTouch = ( document.ontouchstart !== undefined );

			// Double Click
			self.el.on( 'dblclick', onMapDoubleClick );

			// Mobile Controls
			if ( isTouch ) {

				self.map.on( 'touchstart', onTouchStart );

				// Create Hammer Instance on Map
				self.hammer = new Hammer( self.map[0], {
					transform_always_block: true,
					drag_block_horizontal: true,
					drag_block_vertical: true
				} );

				self.hammer.get( 'pinch' ).set( {
					enable: true
				} );

				// Add Touch Events
				self.hammer.on( 'pinchstart', onPinchStart );
				self.hammer.on( 'pinch', onPinch );

			// Desktop Controls
			} else {

				self.map.on( 'mousedown', onMapMouseDown );
				self.layer.on( 'mousewheel', onMapMouseWheel );
				$window.on( 'keyup', onKeyUp );

			}

		}

		var addLayer = function() {
			// console.log( "Mapplic: addLayer" );

			// Create new map layer
			self.layer = $( '<div></div>' )
				.addClass( 'mapplic-layer' )
				.appendTo( self.map );

			// Create Map Image
			self.mapImage = $( '<div></div>' ).addClass('mapplic-map-image').appendTo( self.layer );

			// Load SVG Image
			loadImage( self.data.map );

		}

		var addLocation = function( data ) {
			// console.log( "Mapplic: addLocation" );

			// Vars
			var location;
			var pinName;
			var pinData;

			// Get Location Element
			var element = $( '#' + data.id );

			// Add Location
			location = new MapplicLocation();
			location.init( self, data, element );

			// Add Pin
			if ( data.pin ) {

				pinName = ( data.pin.name ) ? data.pin.name : PIN_NAME_DEFAULT;
				pinData = self.data.pins[ pinName ];

				if ( !pinData )
					pinData = self.data.pins[ PIN_NAME_DEFAULT ];

				location.addPin( pinData.source, pinData.width, pinData.height, data.pin.zoom );
				location.pin.el.appendTo( self.layer );

			}

			// Add Label
			if ( data.label ) {

				var labelOffsetX = ( pinData ) ? pinData.width / 2 : 0;

				location.addLabel( data.label, labelOffsetX );
				location.label.el.appendTo( self.layer );

			}

			// Add to Array
			self.locations.push( location );

			// Add Listener
			if ( data.interactive && location.el )
				location.el.on( 'click', onLocationClick );

		}

		var addMap = function() {
			// console.log( "Mapplic: addMap" );

			self.map = $( '<div></div>' )
				.addClass( 'mapplic-map' )
				.appendTo( self.container );

			self.map.css( {
				'left': self.x,
				'top': self.y,
				'width': self.contentWidth * self.scale,
				'height': self.contentHeight * self.scale
			} );

			self.map.addClass( 'mapplic-zoomable' );

		}

		var addTooltip = function() {
			// console.log( "Mapplic: addTooltip" );

			// Create Instance
			if ( !self.tooltip ) {

				self.tooltip = new MapplicTooltip();
				self.tooltip.init( self.data.tooltip );
				self.tooltip.children.close.on( 'click', onTooltipClose );

			}

			// Append to Element
			if ( self.displayMode === DISPLAY_MODE_MOBILE )
				self.tooltip.el.appendTo( self.container );
			else
				self.tooltip.el.appendTo( self.map );

		}

		var showError = function() {
			// console.log( "Mapplic: showError" );

			self.el.addClass( STYLE_ELEMENT_ERROR );

		}

		var showLoading = function() {
			// console.log( "Mapplic: showLoading" );

			self.el.addClass( STYLE_ELEMENT_LOADING );

		}

		var hideLoading = function() {
			// console.log( "Mapplic: hideLoading" );

			self.el.removeClass( STYLE_ELEMENT_LOADING );

		}

		var normalizeX = function( x ) {
			// console.log( "Mapplic: normalizeX", x );

			var minX = self.container.width() - self.contentWidth * self.scale;

			if (minX < 0) {
				if (x > 0) x = 0;
				else if (x < minX) x = minX;
			}
			else x = minX/2;

			return x;

		}

		var normalizeY = function( y ) {

			var minY = self.container.height() - self.contentHeight * self.scale;

			if (minY < 0) {
				if (y >= 0) y = 0;
				else if (y < minY) y = minY;
			}
			else y = minY/2;

			return y;

		}

		var normalizeScale = function( scale ) {

			if ( scale < self.fitScale )
				scale = self.fitScale;
			else if ( scale > self.o.maxscale )
				scale = self.o.maxscale;

			if ( self.zoomControls )
				self.zoomControls.update( scale, self.fitScale, self.o.maxscale );

			return scale;

		}

		var resizeElement = function() {
			// console.log( "Mapplic: resizeElement" );

			var paddingTop = window.innerWidth >= 1024 ? '5.8rem' : window.innerWidth < 640 ? '8.8rem' : window.innerWidth >= 640 && window.innerWidth <= 800 ? '10.2rem' : '12.4rem';
			$('.site-canvas').css('padding-top', paddingTop);

			if (window.innerWidth >= 1024) {
				$('.sticky-nav').addClass('hideh');
			}

			// var elTop = self.el.offset().top;
			var navHeight = $('.main-header').outerHeight();
			var actionsHeight = $('#mainContent > .page-wrapper').outerHeight();
			var elHeight = $window.height() - navHeight - actionsHeight + 12;
			// console.log(navHeight, actionsHeight, elHeight);

			self.el.height( elHeight );

		}

		var updateLocations = function() {
			// console.log( "Mapplic: updateLocations" );

			$.each( self.locations, function( index, location ) {

				location.updateZoom( self.scale / self.fitScale );

			} );

		}

		var validateLocationData = function( data ) {

			return (
				data.id &&
				data.x !== undefined &&
				data.y !== undefined
			);

		}

		var zoomTo = function( x, y, scale, d, easing ) {
			console.log( "Mapplic: zoomTo");

			if ( scale !== undefined ) {

				self.map.stop().animate({
					'left': x,
					'top': y,
					'width': self.contentWidth * scale,
					'height': self.contentHeight * scale
				}, d, easing, function() {

					// Update Locations
					updateLocations();

					// Update Tooltip
					if ( self.tooltip )
						self.tooltip.position();

				} );

			} else {

				self.map.css( {
					'left': x,
					'top': y
				} );

			}

			// Update Locations
			updateLocations();

			// Update Tooltip
			if ( self.tooltip )
				self.tooltip.position();

			// Trigger event
			self.el.trigger( EVENT_POSITION_CHANGE, self );

		}





		/* ----- PUBLIC FUNCTIONS ------ */

		/**
		 * moveTo(x, y, s, d)
		 * Move to position x, y on scale s in d milliseconds
		 */
		self.moveTo = function( x, y, s, duration, easing, rx, ry ) {
			console.log( "Mapplic: moveTo", x, y, s, duration );

			s = typeof s !== 'undefined' ? s : self.scale / self.fitScale;

			duration = typeof duration !== 'undefined' ? duration : DURATION_NORMAL;
			rx = typeof rx !== 'undefined' ? rx : 0.5;
			ry = typeof ry !== 'undefined' ? ry : 0.5;

			self.scale = normalizeScale( self.fitScale * s );

			self.x = normalizeX( self.container.width() * rx - self.scale * self.contentWidth * x );
			self.y = normalizeY( self.container.height() * ry - self.scale * self.contentHeight * y );

			zoomTo( self.x, self.y, self.scale, duration, easing );
		}

		/**
		 * getLocationById( id )
		 * Get the data object of location
		 */
		self.getLocationById = function( id ) {
			// console.log( "Mapplic: getLocationById", id );

			var ary = self.locations.filter( function( a ) {
				return a.id === id;
			} );

			if ( ary.length > 0 )
				return ary[0];

			return null;

		}

		/**
		 * showLocation( id, d )
		 * Focus to location in d milliseconds
		 */
		self.showLocation = function( id, duration, bypassDeepLink ) {
			// console.log( "Mapplic: showLocation", id, duration, bypassDeepLink );

			// Get Location
			var location = self.getLocationById( id );


			if ( location && location !== self.activeLocation ) {

				// Hide Previous Active Location
				if ( self.activeLocation )
					self.hideLocation( true );

				// Set Active Location
				self.activeLocation = location;
				self.activeLocation.changeState( LOCATION_STATE_ACTIVE );

				// Compass
				if ( self.displayMode === DISPLAY_MODE_MOBILE )
					self.compass.hide();

				// Tooltip
				self.tooltip.show( location );
				self.tooltip.children.extLinks.on( 'click', onTooltipLink );

				// DeepLink
				if ( !bypassDeepLink )
					self.deepLink.update( id );

				// Move Map
				var rx = 0.5;
				var ry = ( self.displayMode === DISPLAY_MODE_MOBILE ) ? 0.33 : 0.5;

				self.moveTo( location.x, location.y, location.getLocationZoom(), duration, 'easeInOutCubic', rx, ry );

				// Trigger event
				self.el.trigger( EVENT_LOCATION_OPEN, location );

			}

		}

		/**
		 * hideLocation()
		 * Close currently active location
		 */
		self.hideLocation = function( bypassDeepLink ) {
			// console.log( "Mapplic: hideLocation" );

			if ( self.activeLocation ) {

				self.el.trigger( EVENT_LOCATION_CLOSE, self.activeLocation );

				self.activeLocation.changeState( self.activeLocation.lastState );
				self.activeLocation = undefined;

			}

			if ( !bypassDeepLink )
				self.deepLink.clear();

			// Compass
			if ( self.displayMode === DISPLAY_MODE_MOBILE )
				self.compass.show();

			if ( self.tooltip ) {

				self.tooltip.hide();
				self.tooltip.children.extLinks.off( 'click', onTooltipLink );

			}

		}


		/**
		 * toggleLocationHighlight( id, highlight )
		 * Changes the specified location state to either
		 * highlight or none.
		 */
		self.toggleLocationHighlight = function( id, highlight ) {
			// console.log( "Mapplic: toggleLocationHighlight", id, highlight );

			var ary = ( Array.isArray( id ) ) ? id : [ id ];

			if ( ary.length > 0 ) {

				var location;

				var xMin;
				var xMax;
				var yMin;
				var yMax;

				$.each( ary, function( index, id ) {

					// Get Location
					location = self.getLocationById( id );

					// Change State
					if ( highlight )
						location.changeState( LOCATION_STATE_HIGHLIGHT );
					else
						location.changeState( LOCATION_STATE_NONE );

					// Update xMin, xMax
					if ( isNaN( xMin ) || isNaN( xMax ) )
						xMin = xMax = location.x;
					else if ( location.x < xMin )
						xMin = location.x;
					else if ( location.x > xMax )
						xMax = location.x;

					// Update yMin, yMax
					if ( isNaN( yMin ) || isNaN( yMax ) )
						yMin = yMax = location.y;
					else if ( location.y < yMin )
						yMin = location.y;
					else if ( location.y > yMax )
						yMax = location.y;

				} );

				// Get Coordinates
				var highlightX = ( xMax - xMin  ) / 2 + xMin;
				var highlightY = ( yMax - yMin  ) / 2 + yMin;

				// Get Zoom
				location = self.getLocationById( ary[ 0 ] );

				var highlightScale = location.zoom;

				if ( ary.length > 1 ) {

					var xDelta = xMax - xMin;
					var yDelta = yMax - yMin;
					var viewDelta = self.fitScale / self.scale;

					var xScale = viewDelta / xDelta * self.scale;
					var yScale = viewDelta / yDelta * self.scale;

					var highlightPaddingFactor = 0.9;
					var highlightScale = ( xScale < yScale ) ?
						xScale * highlightPaddingFactor / self.fitScale :
						yScale * highlightPaddingFactor / self.fitScale;

				}

				// Move To
				self.moveTo( highlightX, highlightY, highlightScale, DURATION_LONG );

			}

		}

		/**
		 * clearHighlight()
		 * Changes all locations state to none.
		 */
		self.clearHighlight = function() {
			// console.log( "Mapplic: clearHighlight" );

			var ary = self.locations.filter( function( a ) {
				return ( a.state === LOCATION_STATE_HIGHLIGHT );
			} );

			if ( ary.length > 0 ) {

				$.each( ary, function( index, location ) {

					location.changeState( LOCATION_STATE_NONE );

				} );

				var zoom = (this.map.displayMode === DISPLAY_MODE_MOBILE) ? self.data.mobileMapZoom : self.data.mapZoom;

				self.moveTo( self.data.mapX, self.data.mapY, zoom, DURATION_LONG );

			}

		}


		/**
		 * changeDisplayMode( mode )
		 * Allows external scripts to determine when to
		 * have Mapplic display content for a desktop
		 * device or a mobile device.
		 */
		self.changeDisplayMode = function( mode ) {
			// console.log( "Mapplic: changeDisplayMode", mode );

			self.displayMode = mode;

			if ( self.tooltip ) {

				self.tooltip.el.detach();
				addTooltip();

			}

		}


		/**
		 * resize()
		 * To be called whenever the browser window size
		 * is changed.
		 */
		self.resize = function() {
			// console.log( "Mapplic: resize" );

			// Resize Based on Viewport Height
			resizeElement();

			// Get Width and Height Ratios
			var wr = self.container.width() / self.contentWidth;
			var hr = self.container.height() / self.contentHeight;

			self.fitAxis = ( wr < hr ) ? FIT_AXIS_X : FIT_AXIS_Y;
			self.fitScale = ( wr < hr ) ? wr : hr;

			// Normalize X, Y, and Scale
			self.x = normalizeX( self.x );
			self.y = normalizeY( self.y );
			self.scale = normalizeScale( self.scale );

			// Refresh Position
			zoomTo( self.x, self.y, self.scale, DURATION_SHORT );

		}






		/* ----- EVENT LISTENERS ------ */
		var onDebugClick = function( e ) {
			// console.log( "Mapplic: onDebugClick" );

			if ( !self.dragging ) {

				var mapOffset = self.map.offset();
				var debugX = ( e.pageX - mapOffset.left ) / self.map.width();
				var debugY = ( e.pageY - mapOffset.top ) / self.map.height();
				var debugZoom = self.scale / self.fitScale;

				self.debug.update( debugX, debugY, debugZoom );

			}

		}

		var onLocationClick = function( e ) {
			// console.log( "Mapplic: onLocationClick" );

			if ( !self.debug ) {

				var $target = $( e.currentTarget );
				var locationId = $target.attr( 'data-location-id' );

				if ( !self.dragging ) {

					self.showLocation( locationId, DURATION_NORMAL );

				}

			}

		}

		var onKeyUp = function( e ) {
			// console.log( "Mapplic: onKeyUp:", e.keyCode );

			if (!e.keyCode) return;

			var validKeyCodes = "27 ";

			var strKeyCode = e.keyCode.toString() + " ";

			if ( validKeyCodes.indexOf( strKeyCode ) > -1 ) {

				e.preventDefault();

				switch( e.keyCode ) {

					// ESC
					case 27:
						self.hideLocation();
						break;

				}

			}

		}

		var onMapDoubleClick = function( e ) {
			console.log("Mapplic: onMapDoubleClick" );
			// console.log("event target tag name: ", e.target.tagName);

			// should only zoom if target is the map (not the zoom buttons, tooltip etc)
			if (['BUTTON','P','H4','A','DIV'].indexOf( e.target.tagName ) !== -1){
				return;
			}

			e.preventDefault();

			var scale = self.scale;
			self.scale = normalizeScale(scale * 2);

			self.x = normalizeX(self.x - (e.pageX - self.container.offset().left - self.x) * (self.scale/scale - 1));
			self.y = normalizeY(self.y - (e.pageY - self.container.offset().top - self.y) * (self.scale/scale - 1));

			zoomTo(self.x, self.y, self.scale, DURATION_SHORT, 'easeInOutCubic');

		}

		var onMapMouseDown = function( e ) {
			console.log( "Mapplic: onMapMouseDown" );

			if ( e.which === 1 ) {

				e.stopPropagation();

				self.dragging = false;
				self.map.addClass( STYLE_DRAGGING );
				self.map.stop();

				var pos = self.map.position();
				self.dragStartX = e.pageX - pos.left;
				self.dragStartY = e.pageY - pos.top;

				// Add Listeners
				self.map.on( 'mouseleave', onMapMouseLeave );
				self.map.on( 'mousemove', onMapMouseMove );
				self.map.on( 'mouseup', onMapMouseUp );

			}

		}

		var onMapMouseLeave = function( e ) {
			console.log( "Mapplic: onMapMouseLeave" );

			self.map.trigger( 'mouseup' );

		}

		var onMapMouseMove = function( e ) {
			console.log( "Mapplic: onMapMouseMove" );

			var x = normalizeX( e.pageX - self.dragStartX );
			var y = normalizeY( e.pageY - self.dragStartY );

			var deltaX = Math.abs( x - self.x );
			var deltaY = Math.abs( y - self.y );

			self.dragging = ( deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD );

			self.x = x;
			self.y = y;

			zoomTo( self.x, self.y );

		}

		var onMapMouseUp = function( e ) {
			console.log( "Mapplic: onMapMouseUp" );

			if ( !e.which || e.which === 1 ) {

				// Remove Dragging Cursor
				self.map.removeClass( STYLE_DRAGGING );

				// Hide Location
				var isTargetTooltip = $.contains( self.tooltip.el[0], e.target );

				if ( !self.dragging && self.activeLocation && !isTargetTooltip )
					self.hideLocation();

				// Remove Event Listeners
				self.map.off( 'mouseleave', onMapMouseLeave );
				self.map.off( 'mousemove', onMapMouseMove );
				self.map.off( 'mouseup', onMapMouseUp );

			}

		}

		var onMapMouseWheel = function( e, delta ) {
			console.log( "Mapplic: onMapMouseWheel", delta );

			e.preventDefault();

			var scale = self.scale;
			var pos = self.container.offset();

			self.scale = normalizeScale( scale + scale * delta / 50 );
			self.x = normalizeX( self.x - ( e.pageX - pos.left - self.x ) * ( self.scale / scale - 1 ) );
			self.y = normalizeY( self.y - ( e.pageY - pos.top - self.y ) * ( self.scale / scale - 1 ) );

			zoomTo( self.x, self.y, self.scale, DURATION_SHORT, 'easeOutCubic' );

			// Debug
			if ( self.debug )
				self.debug.update( null, null, self.scale / self.fitScale );

		}

		var onPinchStart = function( e ) {
			console.log( "Mapplic: onPinchStart" );

			self.dragging = false;
			self.pinchStartScale = self.scale / self.fitScale;

		}

		var onPinch = function( e ) {
			console.log( "Mapplic: onPinch" );

			self.dragging = true;

			var scale = ( e.scale !== 1 ) ?
				Math.max( 1, Math.min( self.pinchStartScale * e.scale, 100 ) ) :
				1 ;

			var oldScale = self.scale;
			self.scale = normalizeScale( scale * self.fitScale );

			self.x = normalizeX(self.x - (e.center.x - self.container.offset().left - self.x) * (self.scale / oldScale - 1));
			self.y = normalizeY(self.y - (e.center.y - self.container.offset().top - self.y) * (self.scale / oldScale - 1));

			zoomTo( self.x, self.y, self.scale, DURATION_TOUCH );

		}

		var onPopState = function( e ) {
			// console.log( "Mapplic: onPopState" );

			if ( e.originalEvent.state ) {
				console.info( 1 );

				var deepLinkId = self.deepLink.getId();
				console.info( deepLinkId );

				if ( deepLinkId ) {

					self.showLocation( deepLinkId, DURATION_NORMAL, true );

				} else {

					if ( self.activeLocation )
						self.hideLocation( true );

					var zoom = (this.map.displayMode === DISPLAY_MODE_MOBILE) ? self.data.mobileMapZoom : self.data.mapZoom;

					self.moveTo( self.data.mapX, self.data.mapY, zoom, DURATION_NORMAL );

				}

			}

		}

		var onTooltipClose = function( e ) {
			// console.log( "Mapplic: onTooltipClose" );

			e.preventDefault();

			self.hideLocation();

			// Reset Map?
			//self.moveTo( self.data.mapX, self.data.mapY, self.data.mapZoom, DURATION_NORMAL, 'easeInOutCubic' );

		}

		var onTooltipLink = function( e ) {
			// console.log( "Mapplic: onTooltipLink" );

			var url = e.currentTarget.getAttribute( 'href' );
			self.el.trigger( EVENT_TOOLTIP_LINK, [ self.activeLocation, url ] );

		}

		var onTouchStart = function( e ) {
			console.log( "Mapplic: onTouchStart" );

			self.dragging = false;

			var pos = self.map.position();
			self.dragStartX = e.originalEvent.changedTouches[ 0 ].pageX - pos.left;
			self.dragStartY = e.originalEvent.changedTouches[ 0 ].pageY - pos.top;

			self.map.on( 'touchmove', onTouchMove );
			self.map.on( 'touchend', onTouchEnd );

		}

		var onTouchMove = function( e ) {
			console.log( "Mapplic: onTouchMove" );

			e.preventDefault();

			if ( e.originalEvent.touches.length === 1 ) {

				var x = normalizeX( e.originalEvent.changedTouches[ 0 ].pageX - self.dragStartX );
				var y = normalizeY( e.originalEvent.changedTouches[ 0 ].pageY - self.dragStartY );

				var deltaX = Math.abs( x - self.x );
				var deltaY = Math.abs( y - self.y );

				self.dragging = ( deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD );

				self.x = x;
				self.y = y;

				zoomTo( self.x, self.y );

			} else {

				self.map.trigger( 'touchend' );

			}

		}

		var onTouchEnd = function( e ) {
			//console.log( "Mapplic: onTouchEnd" );
			// be careful, this event will fire wherever you click (touch) on mobile inside the map, even the tooltip

			self.map.off( 'touchmove', onTouchMove );
			self.map.off( 'touchend', onTouchEnd );

			// check if it's an SVG element so it doesn't hide the location (tooltip) when clicking on the tooltip
			if ( !self.dragging && self.activeLocation && e.target instanceof SVGElement)
				self.hideLocation();

		}

		var onZoomInClick = function( e ) {
			console.log( "Mapplic: onZoomInClick" );

			e.preventDefault();

			var scale = self.scale;
			self.scale = normalizeScale( scale + scale * 0.8 );

			self.x = normalizeX( self.x - ( self.container.width() / 2 - self.x ) * ( self.scale / scale - 1 ) );
			self.y = normalizeY( self.y - ( self.container.height() / 2 - self.y ) * ( self.scale / scale - 1 ) );

			console.log('ZI self.scale: ', self.scale.toFixed(2));
			console.log('ZI self.x:     ', self.x.toFixed(2));
			console.log('ZI self.y:     ', self.y.toFixed(2));

			zoomTo( self.x, self.y, self.scale, DURATION_NORMAL, 'easeInOutCubic' );

		}

		var onZoomOutClick = function( e ) {
			console.log( "Mapplic: onZoomOutClick" );

			console.log( "Mapplic: onZoomOutClick et:", e.target );
			console.log( "Mapplic: onZoomOutClick ect:", e.currentTarget );

			e.preventDefault();

			var scale = self.scale;
			self.scale = normalizeScale( scale - scale * 0.4 );

			self.x = normalizeX( self.x - ( self.container.width() / 2 - self.x ) * ( self.scale / scale - 1 ) );
			self.y = normalizeY( self.y - ( self.container.height() / 2 - self.y ) * ( self.scale / scale - 1 ) );

			console.log('ZO self.scale: ', self.scale.toFixed(2));
			console.log('ZO self.x:     ', self.x.toFixed(2));
			console.log('ZO self.y:     ', self.y.toFixed(2));

			zoomTo( self.x, self.y, self.scale, DURATION_NORMAL, 'easeInOutCubic' );

		}





		// ----- CALL ----- //
		init( jQueryElement, options );





		// ----- RETURN ----- //
		return self;

	};




	/*************************************************
	 * MAPPLIC LOCATION
	 *************************************************/
	var MapplicLocation = function () {
		// console.log( "new MapplicLocation" );

		// ----- PUBLIC VARS ----- //
		this.map;
		this.id;

		this.brands;
		this.category;
		this.details;
		this.interactive;
		this.tags;
		this.unitType;
		this.x;
		this.y;
		this.zoom;

		this.el;
		this.state;
		this.lastState;

		this.label;
		this.pin;


	}

	// ----- PROTOTYPE ----- //
	MapplicLocation.prototype = {

		// ----- PRIVATE FUNCTIONS ----- //

		// Web Mercator (EPSG:3857) lat/lng projection
		__latlngToPos: function(lat, lng) {
			var deltaLng = this.map.data.rightLng - this.map.data.leftLng,
				bottomLatDegree = this.map.data.bottomLat * Math.PI / 180,
				mapWidth = ((this.map.data.mapWidth / deltaLng) * 360) / (2 * Math.PI),
				mapOffsetY = (mapWidth / 2 * Math.log((1 + Math.sin(bottomLatDegree)) / (1 - Math.sin(bottomLatDegree))));

			lat = lat * Math.PI / 180;

			return {
				x: ((lng - this.map.data.leftLng) * (this.map.data.mapWidth / deltaLng)) / this.map.data.mapWidth,
				y: (this.map.data.mapHeight - ((mapWidth / 2 * Math.log((1 + Math.sin(lat)) / (1 - Math.sin(lat)))) - mapOffsetY)) / this.map.data.mapHeight
			};
		},

		// ----- PUBLIC FUNCTIONS ----- //
		init: function( map, data, element ) {
			// console.log( "MapplicLocation: init" );

			// Vars
			this.map = map;
			this.id = data.id;
			this.interactive = data.interactive;

			this.brands = data.brands;
			this.details = data.details;
			this.category = data.category;
			this.tags = data.tags;
			// this.unitType = data.unitType;
			this.unitType = data.type;
			this.nonBrandUnit = data.nonBrandUnit;
			this.zoom = data.zoom;
			this.mobileZoom = data.mobileZoom;

			// Coordinates
			if ( data.lat && data.lng ) {
				var pos = latlngToPos( data.lat, data.lng );
				this.x = pos.x;
				this.y = pos.y;
			} else if ( data.x && data.y ) {
				this.x = data.x;
				this.y = data.y;
			} else {
				this.x = 0.5;
				this.y = 0.5;
			}

			// Element
			if ( element.length > 0 ) {

				this.el = element;
				this.el.addClassSVG( STYLE_INTERACTIVE );
				this.el.attr( 'data-location-id', this.id );

				if ( this.unitType ){
					this.el.addClassSVG( this.unitType );
				}

				if ( this.nonBrandUnit ){
					this.el.addClassSVG( STYLE_NON_BRAND_UNIT );
				}
			}

			// Set State
			this.state = LOCATION_STATE_NONE;

			// Add Listeners
			if ( this.el ) {

				this.el.on( 'mouseenter', this.__onMouseEnter.bind( this ) );
				this.el.on( 'mouseleave', this.__onMouseLeave.bind( this ) );

			}

		},

		addPin: function( source, width, height, zoom ) {
			// console.log( "MapplicLocation: addPin" );

			this.pin = new MapplicPin();
			this.pin.init( this.id, source, width, height, zoom, this.interactive );
			this.pin.position( this.x, this.y );

		},

		addLabel: function( data, offsetX ) {
			// console.log( "MapplicLocation: addLabel" );

			this.label = new MapplicLabel();
			this.label.init( this.id, data );
			this.label.position( this.x, this.y );

			this.label.el.css( {
				marginLeft: offsetX + LABEL_MARGIN_LEFT
			} );

		},

		changeState: function( state ) {
			// console.log( "MapplicLocation: changeState", state );

			if ( state !== this.state ) {

				this.lastState = this.state;
				this.state = state;

				if ( this.el ) {

					// Element Class
					if ( this.state === LOCATION_STATE_ACTIVE ||
						 this.state === LOCATION_STATE_HIGHLIGHT ) {

						this.el.addClassSVG( STYLE_ACTIVE );

					} else {

						this.el.removeClassSVG( STYLE_ACTIVE );

					}

				}

				// Label
				if ( this.label ) {

					if ( this.state === LOCATION_STATE_ACTIVE ||
							 this.state === LOCATION_STATE_HIGHLIGHT ||
						 ( this.state === LOCATION_STATE_NONE &&
						   this.map.scale >= this.getLabelZoom() * this.map.fitScale ) ) {

						this.label.show();

					} else {

					 	this.label.hide();

					}

				}

				// Pin
				if ( this.state === LOCATION_STATE_ACTIVE ||
					 this.state === LOCATION_STATE_HIGHLIGHT ||
					 this.map.scale >= this.getPinZoom() * this.map.fitScale ) {

					this.pin.show();

				} else {

				 	this.pin.hide();

				}

			}

		},

		getLocationZoom: function() {
			var defaultZoom = (this.map.displayMode === DISPLAY_MODE_MOBILE) ? this.map.data.mobileMapLocationZoom : this.map.data.mapLocationZoom;
			var zoom = (this.map.displayMode === DISPLAY_MODE_MOBILE) ? this.mobileZoom : this.zoom;

			return zoom || defaultZoom;
		},

		getPinZoom: function() {
			var defaultZoom = (this.map.displayMode === DISPLAY_MODE_MOBILE) ? this.map.data.mobileMapLocationPinZoom : this.map.data.mapLocationPinZoom;
			var zoom = (this.map.displayMode === DISPLAY_MODE_MOBILE) ? this.pin.mobileZoom : this.pin.zoom;

			return zoom || defaultZoom;
		},

		getLabelZoom: function() {
			var defaultZoom = (this.map.displayMode === DISPLAY_MODE_MOBILE) ? this.map.data.mobileMapLocationLabelZoom : this.map.data.mapLocationLabelZoom;
			var zoom = (this.map.displayMode === DISPLAY_MODE_MOBILE) ? this.label.mobileZoom : this.label.zoom;

			return zoom || defaultZoom;
		},

		updateZoom: function( mapZoom ) {
			// console.log( "MapplicLocation: updateZoom", mapZoom );

			if ( this.state === LOCATION_STATE_NONE ) {

				// Update Label
				if ( this.label ) {

					if ( mapZoom >= this.getLabelZoom() )
						this.label.show();
					else
						this.label.hide();

				}

				// Update Pin
				if ( this.pin ) {

					if ( mapZoom >= this.getPinZoom() )
						this.pin.show();
					else
						this.pin.hide();

				}

			}

		},

		// ----- EVENT LISTENERS ----- //
		__onMouseEnter: function( e ) {
			// console.log( "MapplicLocation: __onMouseEnter" );
			//console.info( this.state, LOCATION_STATE_ACTIVE );

			// Label
			if ( this.label &&
				 this.state !== LOCATION_STATE_ACTIVE )
				this.label.show();

			// Pin
			if ( this.pin )
				this.pin.show();

		},

		__onMouseLeave: function( e ) {
			// console.log( "MapplicLocation: __onMouseLeave" );

			// Label
			if ( this.label &&
				 this.state !== LOCATION_STATE_HIGHLIGHT &&
				 this.map.scale < this.getLabelZoom() * this.map.fitScale ) {

			 	this.label.hide();

			}

			// Pin
			if ( this.pin &&
				 this.state === LOCATION_STATE_NONE &&
			 	 this.map.scale < this.getPinZoom() * this.map.fitScale ) {

			 	this.pin.hide();

			}

		}

	};





	/*************************************************
	 * MAPPLIC PIN
	 *************************************************/
	var MapplicPin = function() {
		// console.log( "new MapplicPin" );

		// ----- PUBLIC VARS ----- //
		this.el;
		this.id;
		this.zoom;

	}

	// ----- PROTOTYPE ----- //
	MapplicPin.prototype = {

		// ----- PUBLIC FUNCTIONS ----- //
		init: function( id, source, width, height, zoom, interactive ) {
			// console.log( "MapplicPin: init", id, source, width, height, zoom, interactive );

			// Set ID
			this.id = id;

			// Set Zoom
			this.zoom = zoom;

			// Do Stuff
			if ( source ) {

				// Create Element
				this.el = ( interactive ) ?
					$( '<a href="#"></a>' ) : $( '<div></div>' );

				// Add Class
				this.el.addClass( STYLE_PIN );

				// Add Location ID
				this.el.data( 'location-id', this.id );

				// Add Image
				this.el.append( '<img src="' + source + '" >' );

				// Set Element Dimensions
				this.el.width( width );
				this.el.height( height );

				// Hide
				this.el.hide();

			}

		},

		show: function() {
			//console.log( "MapplicPin: show" );

			if ( this.el.is( ":hidden" ) )
				this.el.show();

		},

		hide: function() {
			//console.log( "MapplicPin: hide" );

			if ( this.el.is( ":visible" ) )
				this.el.hide();

		},

		position: function( x, y ) {
			// console.log( "MapplicPin: position" );

			var top = y * 100;
			var	left = x * 100;

			this.el.css( {
				'top': top + '%',
				'left': left + '%'
			} );

		}
	}





	/*************************************************
	 * MAPPLIC LABEL
	 *************************************************/
	var MapplicLabel = function() {
		// console.log( "new MapplicLabel" );

		// ----- PUBLIC VARS ----- //
		this.id;
		this.el;
		this.zoom;

	}

	// ----- PROTOTYPE ----- //
	MapplicLabel.prototype = {

		// ----- PRIVATE FUNCTIONS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		init: function( id, data ) {
			// console.log( "MapplicLabel: init", id, data );

			// Set ID
			this.id = id;

			// Set Zoom Level Visible
			this.zoom = data.zoom;

			// Create Element
			this.el = $( '<div></div>' )
				.addClass( STYLE_LABEL );

			// Hide
			this.el.hide();

			// Set Text
			this.el.text( data.text );

		},

		show: function() {
			//console.log( "MapplicLabel: show" );

			if ( this.el.is( ":hidden" ) )
				this.el.show();

		},

		hide: function() {
			//console.log( "MapplicLabel: hide" );

			if ( this.el.is( ":visible" ) )
				this.el.hide();

		},

		position: function( x, y ) {
			// console.log( "MapplicLabel: position", x, y );

			var top = y * 100;
			var	left = x * 100;

			this.el.css( {
				'top': top + '%',
				'left': left + '%'
			} );

		}
	}





	/*************************************************
	 * MAPPLIC TOOLTIP
	 *************************************************/
	var MapplicTooltip = function() {
		console.log( "new MapplicTooltip" );

		// ----- VARS ----- //
		this.el;
		this.children;

		this.data;
		this.pin;
		this.location;

		// ----- CONSTANTS ----- //
		var STYLE_TOOLTIP = 'mapplic-tooltip';
		var STYLE_TOOLTIP_ACTIVE = 'mapplic-tooltip--active';
		var STYLE_TOOLTIP_REVERSE = 'mapplic-tooltip--reverse';
		var STYLE_TOOLTIP_FLIP = 'mapplic-tooltip--flip';

		var STYLE_TOOLTIP_OUTER_CONTAINER = 'mapplic-tooltip__outer-container';
		var STYLE_TOOLTIP_CONTAINER = 'mapplic-tooltip__container';
		var STYLE_TOOLTIP_CONTAINER_SHARE = 'mapplic-tooltip__container--share';

		var STYLE_TOOLTIP_CONTENT = 'mapplic-tooltip__content';

		var STYLE_TOOLTIP_UNIT_TYPE = 'mapplic-tooltip__type';
		var STYLE_TOOLTIP_TITLE = 'mapplic-tooltip__title';

		var STYLE_TOOLTIP_DESCRIPTION = 'mapplic-tooltip__description';
		var STYLE_TOOLTIP_BRANDS = 'mapplic-tooltip__brands';
		var STYLE_TOOLTIP_HOURS = 'mapplic-tooltip__hours';
		var STYLE_TOOLTIP_PHONE = 'mapplic-tooltip__phone';
		var STYLE_TOOLTIP_EMAIL = 'mapplic-tooltip__email';

		var STYLE_TOOLTIP_SOCIAL = 'mapplic-tooltip__social';

		var STYLE_TOOLTIP_LINK = 'mapplic-tooltip__link';
		var STYLE_TOOLTIP_LINK_BACK = 'mapplic-tooltip__link--back';
		var STYLE_TOOLTIP_LINK_EXT = 'mapplic-tooltip__link--ext';
		var STYLE_TOOLTIP_LINK_SHARE = 'mapplic-tooltip__link--share';
		var STYLE_TOOLTIP_OFFER = 'mapplic-tooltip__offer';

		var STYLE_TOOLTIP_CLOSE = 'mapplic-tooltip__close';


		// ----- FUNCTIONS ----- //
		this.init = function( data ) {
			console.log( "MapplicTooltip: init" );

			// Set Tooltip Data
			this.data = data;

			// Create Element and Children
			this.el = $(
				'<div class="' + STYLE_TOOLTIP + '">' +

					'<div class="' + STYLE_TOOLTIP_OUTER_CONTAINER + '">' +

						// Default Side
						'<div class="' + STYLE_TOOLTIP_CONTAINER + '">' +

							'<div class="' + STYLE_TOOLTIP_CONTENT + '">' +

								'<div class="mapplic-tooltip__header">' +
									'<p class="' + STYLE_TOOLTIP_UNIT_TYPE + '"></p>' +
									'<hr>' +
									'<h4 class="' + STYLE_TOOLTIP_TITLE + '"></h4>' +
								'</div>' +

								'<div class="mapplic-tooltip__body">' +

									'<div class="' + STYLE_TOOLTIP_DESCRIPTION + '"></div>' +
									'<p class="' + STYLE_TOOLTIP_BRANDS + '"></p>' +
									'<div class="mapplic-tooltip-details">' +
										'<p class="' + STYLE_TOOLTIP_HOURS + '"><strong>' + this.data.hours + '</strong><span></span></p>' +
										'<p class="' + STYLE_TOOLTIP_PHONE + '"><strong>' + this.data.phone + '</strong><span></span></p>' +
										'<p class="' + STYLE_TOOLTIP_EMAIL + '"><strong>' + this.data.email + '</strong><a href="#"></a></p>' +
									'</div>' +

								'</div>' +

								'<div class="mapplic-tooltip__footer">' +
									'<div class="' + STYLE_TOOLTIP_LINK + ' ' + STYLE_TOOLTIP_LINK_EXT + '">' +
										'<a href="#" target="_blank"><span>' + this.data.link + '</span><i class="webfont-arrow-long"></i></a>' +
									'</div>' +
									'<div class="' + STYLE_TOOLTIP_LINK + ' ' + STYLE_TOOLTIP_LINK_SHARE + '">' +
										'<a href="#" target="_blank"><span>' + this.data.share + '</span><i class="webfont-arrow-long"></i></a>' +
									'</div>' +
									'<p class="' + STYLE_TOOLTIP_OFFER + '"></p>' +
								'</div>' +

							'</div>' +

							'<a class="' + STYLE_TOOLTIP_CLOSE + ' webfont-close" href="#" aria-label="' + this.data.close + '"></a>' +

						'</div>' +

						// Alt Side
						'<div class="' + STYLE_TOOLTIP_CONTAINER + ' ' + STYLE_TOOLTIP_CONTAINER_SHARE + '">' +

							'<div class="' + STYLE_TOOLTIP_CONTENT + '">' +

								'<div class="mapplic-tooltip__header">' +
									'<p class="' + STYLE_TOOLTIP_UNIT_TYPE + '"></p>' +
									'<hr>' +
									'<h4 class="' + STYLE_TOOLTIP_TITLE + '"></h4>' +
								'</div>' +

								'<div class="mapplic-tooltip__body">' +

									'<div class="' + STYLE_TOOLTIP_SOCIAL + '">' +
										'<a class="webfont-facebook" href="#" target="_blank" aria-label="Facebook"></a>' +
										'<a class="webfont-twitter" href="#" target="_blank" aria-label="Twitter"></a>' +
										'<a class="webfont-messenger" href="#" aria-label="Messenger"></a>' +
										'<a class="webfont-whatsapp" href="#" data-action="share/whatsapp/share" aria-label="WhatsApp"></a>' +
									'</div>' +

								'</div>' +

								'<div class="mapplic-tooltip__footer">' +
									'<div class="' + STYLE_TOOLTIP_LINK + ' ' + STYLE_TOOLTIP_LINK_BACK + '">' +
										'<a href="#" target="_blank"><span>' + this.data.back + '</span><i class="webfont-arrow-long"></i></a>' +
									'</div>' +
								'</div>' +

							'</div>' +

							'<a class="' + STYLE_TOOLTIP_CLOSE + ' webfont-close" href="#" aria-label="' + this.data.close + '"></a>' +

						'</div>' +

					'</div>' +

				'</div>' );

			// Child Elements
			this.children = {
				back: this.el.find( '.' + STYLE_TOOLTIP_LINK_BACK + '> a' ),
				brands: this.el.find( '.' + STYLE_TOOLTIP_BRANDS ),
				close: this.el.find( '.' + STYLE_TOOLTIP_CLOSE ),
				container: this.el.find( '.' + STYLE_TOOLTIP_CONTAINER ),
				content: this.el.find( '.' + STYLE_TOOLTIP_CONTENT ),
				description: this.el.find( '.' + STYLE_TOOLTIP_DESCRIPTION ),
				email: this.el.find( '.' + STYLE_TOOLTIP_EMAIL ),
				extLinks: this.el.find( 'a[href^=http]' ),
				facebook: this.el.find( 'a[class*=facebook]' ),
				hours: this.el.find( '.' + STYLE_TOOLTIP_HOURS ),
				link: this.el.find( '.' + STYLE_TOOLTIP_LINK_EXT + '> a' ),
				messenger: this.el.find( 'a[class*=messenger]' ),
				offer: this.el.find( '.' + STYLE_TOOLTIP_OFFER ),
				phone: this.el.find( '.' + STYLE_TOOLTIP_PHONE ),
				share: this.el.find( '.' + STYLE_TOOLTIP_LINK_SHARE + '> a' ),
				title: this.el.find( '.' + STYLE_TOOLTIP_TITLE ),
				twitter: this.el.find( 'a[class*=twitter]' ),
				unitType: this.el.find( '.' + STYLE_TOOLTIP_UNIT_TYPE ),
				whatsapp: this.el.find( 'a[class*=whatsapp]' )
			};

			// Add Listeners
			this.children.back.on( 'click', onTooltipBack.bind( this ) );
			this.children.share.on( 'click', onTooltipShare.bind( this ) );

		}

		this.show = function( location ) {
			console.log( "MapplicTooltip: show", location );

			if ( location ) {

				// Update Location
				this.location = location;

				// Make Inactive to Prevent FOUC
				this.el.removeClass( STYLE_TOOLTIP_ACTIVE );

				// Show Default
				this.el.removeClass( STYLE_TOOLTIP_FLIP );

				// Update Content
				this.updateContent( location );

				// External Links
				this.children.extLinks = this.el.find( 'a[href^=http]' );

				// Positioning
				this.position();

				// Making it visible - CSS based for mobile (STYLE_TOOLTIP_OUTER_CONTAINER)
				this.el.stop().show();

				// Make Active
				this.el.addClass( STYLE_TOOLTIP_ACTIVE );

				// Scroll Fix
				this.resetContent();

			}
		}

		this.hide = function() {
			console.log( "MapplicTooltip: hide" );

			this.location = null;

			// CSS based for mobile (STYLE_TOOLTIP_OUTER_CONTAINER)
			this.el.stop().fadeOut( DURATION_SHORT );

			this.el.removeClass( STYLE_TOOLTIP_ACTIVE );
			this.children.extLinks.off( 'click' );

		}

		this.position = function() {
			//console.log( "MapplicTooltip: position" );

			if ( this.location ) {

				// Tooltip
				var left = ( this.location.x <= TOOLTIP_FLIP_THRESHOLD ) ?
					( this.location.x * 100 ).toString() + '%' : 'auto';

				var right = ( this.location.x > TOOLTIP_FLIP_THRESHOLD ) ?
					( 100 - this.location.x * 100 ).toString() + '%' : 'auto';

				var pinWidth = this.location.pin.el.outerWidth();

				var marginLeft = ( this.location.x <= TOOLTIP_FLIP_THRESHOLD ) ?
					TOOLTIP_MARGIN_LEFT + pinWidth / 2 : 0;

				var marginRight = ( this.location.x > TOOLTIP_FLIP_THRESHOLD ) ?
					TOOLTIP_MARGIN_RIGHT + pinWidth / 2 : 0;

				if ( left === 'auto' )
					this.el.addClass( STYLE_TOOLTIP_REVERSE );
				else
					this.el.removeClass( STYLE_TOOLTIP_REVERSE );

				this.el.css( {
					left: left,
					right: right,
					top: ( this.location.y * 100 ).toString() + '%',
					marginLeft: marginLeft,
					marginRight: marginRight
				} );


				// Tooltip Container(s)
				var $container;
				this.children.container.each( function( index, container ) {

					$container = $( container );

					$container.css( {
						marginTop: -$container.outerHeight() / 2
					} );

				} );

			}
		}

		this.resetContent = function() {
			console.log( "MapplicTooltip: resetContent");

			// Scroll Fix
			this.children.content.each( function( index, content ) {
				content.scrollTop = 0;
			} );

		}

		this.updateContent = function( location ) {
			console.log( "MapplicTooltip: updateContent" );

			// Type*
			this.children.unitType.text( location.details.unitType );

			// Title*
			this.children.title.text( location.details.title );

			// Description
			if ( location.details.description ) {
				this.children.description.show();
				this.children.description.html( location.details.description );
			} else {
				this.children.description.hide();
			}

			// Brands
			if ( location.brands && location.brands.length > 1 ) {

				this.children.brands.show();

				var brandsText = this.data.brands;

				$.each( location.brands, function( index, brand ) {
					brandsText = ( index === 0 ) ?
						brandsText + brand : brandsText + ', ' + brand;
				} );

				this.children.brands.text( brandsText );

			} else {
				this.children.brands.hide();
			}


			// Hours
			if ( location.details.hours ) {
				this.children.hours.show();
				this.children.hours.find( 'span' ).text( location.details.hours );
			} else {
				this.children.hours.hide();
			}

			// Phone
			if ( location.details.phone ) {
				this.children.phone.show();
				this.children.phone.find( 'span' ).text( location.details.phone );
			} else {
				this.children.phone.hide();
			}

			// Email
			if ( location.details.email ) {
				this.children.email.show();
				this.children.email.find( 'a' )
					.attr( 'href', 'mailto:' + location.details.email )
					.text( location.details.email );
			} else {
				this.children.email.hide();
			}

			// Link
			if ( location.details.link ) {
				this.children.link.show();
				this.children.link.attr( 'href', location.details.link );
			} else {
				this.children.link.hide();
			}

			// Offer
			if ( location.details.offer ) {

				if ( location.details.offerUrl )
					this.children.offer.replaceWith( '<a class="' + STYLE_TOOLTIP_OFFER + '" href="' + location.details.offerUrl + '" target="_blank">' + location.details.offer + '</a>' );
				else
					this.children.offer.replaceWith( '<p class="' + STYLE_TOOLTIP_OFFER + '">' + location.details.offer + '</p>' );

				this.children.offer = this.el.find( '.' + STYLE_TOOLTIP_OFFER );

			} else {
				this.children.offer.hide();
			}

			// Social
			this.updateSocial( location.details.title );

		}

		this.updateSocial = function( locationTitle ) {
			console.log( "MapplicTooltip: updateSocial", locationTitle );

			// Vars
			var shareText = this.data.village + ' ' + locationTitle;
			var shareUrl = window.location.href;
			var shareDisplay = ( $.browser.desktop ) ? 'popup' : 'touch';


			// Facebook
			var facebookUrl = 	'https://www.facebook.com/dialog/feed' +
								'?app_id=' + this.data.facebookAppId +
								'&display=' + shareDisplay +
								'&caption=' + encodeURIComponent( shareText ) +
								'&link=' + encodeURIComponent( shareUrl );

			this.children.facebook.attr( 'href', facebookUrl );


			// Messenger
			var messengerUrl = 	'fb-messenger://share' +
								'?app_id=' + this.data.facebookAppId +
								'&caption=' + encodeURIComponent( shareText ) +
								'&link=' + encodeURIComponent( shareUrl );

			this.children.messenger.attr( 'href', messengerUrl );


			// Twitter
			var twitterUrl = ( $.browser.desktop ) ?

			 	'https://twitter.com/intent/tweet' +
				'?text=' + encodeURIComponent( shareText ) +
				'&url=' + encodeURIComponent( shareUrl ) :

				'twitter://post' +
				'?message=' + encodeURIComponent( shareText ) +
				'&url=' + encodeURIComponent( shareUrl );

			this.children.twitter.attr( 'href', twitterUrl );

			if ( $.browser.desktop )
				this.children.twitter.attr( 'target', '_blank' );
			else
				this.children.twitter.attr( 'target', '' );


			// WhatsApp
			var whatsapp  = 	'whatsapp://send' +
								'?text=' + encodeURIComponent( shareText + ' ' + shareUrl );

			this.children.whatsapp.attr( 'href', whatsapp );

		}


		// ----- EVENT LISTENERS ----- //
		var onTooltipBack = function( e ) {
			console.log( "MapplicTooltip: onTooltipBack" );

			e.preventDefault();
			this.resetContent();
			this.el.removeClass( STYLE_TOOLTIP_FLIP );

		}

		var onTooltipShare = function( e ) {
			console.log( "MapplicTooltip: onTooltipShare" );

			e.preventDefault();
			this.resetContent();
			this.el.addClass( STYLE_TOOLTIP_FLIP );

		}

	}





	/*************************************************
	 * MAPPLIC DEEP LINK
	 *************************************************/
	var MapplicDeepLink = function() {
		console.log( "new MapplicDeepLink" );


		// ----- PRIVATE VARS ----- //
		var paramLocation = 'location';


		// ----- PRIVATE FUNCTIONS ----- //
		var generateUrl = function( id ) {

			var url = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;

			if ( id )
				url += '#' + id;

			return url;

		}


		// ----- PUBLIC FUNCTIONS ----- //
		this.getId = function() {

			return location.hash.replace( '#', '' );

		}

		this.update = function( id ) {
			console.log( "MapplicDeepLink: update", id );

			var url = generateUrl( id );

			window.history.pushState(
				{
					id: id,
					path: url
				},
				null,
				url
			);

		}

		this.clear = function() {
			console.log( "MapplicDeepLink: clear" );

			var url = generateUrl();

			window.history.pushState(
				{
					id: null,
					path: url
				},
				null,
				url
			);

		}

	}





	/*************************************************
	 * MAPPLIC DEBUG
	 *************************************************/
	var MapplicDebug = function() {


		// ----- PUBLIC VARS ----- //
		this.el;
		this.debugX;
		this.debugY;
		this.debugZoom;
		this.pin;


		// ----- PUBLIC FUNCTIONS ----- //
		this.init = function() {
			console.log( "MapplicDebug: init" );

			this.el = $( '<div class="' + STYLE_DEBUG + '"></div>' );

			this.debugX = $( '<code></code>' ).appendTo( this.el );
			this.debugY = $( '<code></code>' ).appendTo( this.el );
			this.debugZoom = $( '<code></code>' ).appendTo( this.el );

			this.pin = $( '<div class="' + STYLE_DEBUG_PIN + '"></div>' );

		}

		this.position = function( x, y ) {
			console.log( "MapplicDebug: position" );

			var top = y * 100;
			var	left = x * 100;

			this.pin.css( {
				'top': top + '%',
				'left': left + '%'
			} );

		}

		this.update = function( x, y, zoom ) {
			console.log( "MapplicDebug: update", x, y, zoom );

			if ( x && y ) {

				this.position( x, y );

				this.debugX.text( 'x: ' + parseFloat( x ).toFixed( 4 ) );
				this.debugY.text( 'y: ' + parseFloat( y ).toFixed( 4 ) );

			}

			this.debugZoom.text( 'zoom: ' + parseFloat( zoom ).toFixed( 4 ) );

		}

	}





	/*************************************************
	 * MAPPLIC COMPASS
	 *************************************************/
	var MapplicCompass = function() {
		console.log( "new MapplicCompass" );

		// ----- PUBLIC VARS ----- //
		this.el;
		this.data;


		// ----- PUBLIC FUNCTIONS ----- //
		this.init = function( data ) {
			console.log( "MapplicCompass: init" );

			this.data = data;
			this.el = $( '<div class="' + STYLE_COMPASS + '"></div' );
			this.loadImage( this.data.source );

		}

		this.loadImage = function( source ) {
			console.log( "MapplicCompass: loadImage:", source );

			var self = this;

			$.get( source, null, null, "html" )
				.done( function( data, textStatus, jqXHR ) {
					console.info( "Success loading compass image!" );

					self.el.append( data );


				} )
				.fail( function() {
					console.error( "Failed to load compass image!" );

				} );

		}

		this.show = function() {
			console.log( "MapplicCompass: show" );

			this.el.show();

		}

		this.hide = function() {
			console.log( "MapplicCompass: hide" );

			this.el.hide();

		}

	}




	/*************************************************
	 * MAPPLIC ZOOM CONTROLS
	 *************************************************/
	var MapplicZoomControls = function() {
		console.log( "new MapplicZoomControls" );


		// ----- PUBLIC VARS ----- //
		this.el;
		this.zoomIn;
		this.zoomOut;


		// ----- PUBLIC FUNCTIONS ----- //
		this.init = function( data ) {
			console.log( "MapplicZoomControls: init" );

			this.el = $( '<div class="' + STYLE_ZOOM_CONTROLS + '"></div>' );
			this.zoomIn = $( '<button class="webfont-plus" type="button" aria-label="' + data.zoomIn + '"></button>' );
			this.zoomOut = $( '<button class="webfont-minus" type="button" aria-label="' + data.zoomOut + '"></button>' );

			this.zoomIn.appendTo( this.el );
			this.zoomOut.appendTo( this.el );

		}

		this.update = function( scale, minScale, maxScale ) {
			console.log( "MapplicZoomControls: update" );

			if ( scale <= minScale )
				this.zoomOut.prop( 'disabled', true );
			else
				this.zoomOut.prop( 'disabled', false );

			if ( scale >= maxScale )
				this.zoomIn.prop( 'disabled', true );
			else
				this.zoomIn.prop( 'disabled', false );

		}

	}





	/*************************************************
	 * EASING FUNCTIONS
	 *************************************************/
	$.extend($.easing,
	{
		def: 'easeOutQuad',
		swing: function (x, t, b, c, d) {
			//alert(jQuery.easing.default);
			return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
		},
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		},
		easeOutCubic: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t + 1) + b;
		},
		easeInOutCubic: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		}
	});





	/*************************************************
	 * JQUERY PLUGINS
	 *************************************************/

	// Mapplic Plugin
	$.fn.mapplic = function( options ) {

		return this.each( function() {

			var $el = $( this );

			// Plugin already initiated on element
			if ( $el.data( 'mapplic' ) ) return;

			var instance = new Mapplic( $el, options );

			// Store plugin object in element's data
			$el.data( 'mapplic', instance );

		});
	};

	// SVG Add Class Plugin
	$.fn.addClassSVG = function( classList ) {

		this.each( function() {

			var $el = $( this );
			var attr = $el.attr( 'class' ) || '';
			var ary = classList.split( ' ' );

			$.each( ary, function( index, value ) {

				if ( attr.indexOf( value ) === -1 )
					attr += ' ' + value;

			} );

			attr.trim();
			$el.attr( 'class', attr );

		} );

		return this;

	};

	// SVG Has Class Plugin
	$.fn.hasClassSVG = function( className ) {
		return $( this ).attr( 'class' ).indexOf( className ) > -1;
	};

	// SVG Remove Class Plugin
	$.fn.removeClassSVG = function( classList ) {

		this.each( function() {

			var $el = $( this );
			var attr = $el.attr( 'class' );
			var ary = classList.split( ' ' );

			$.each( ary, function( index, value ) {

				attr = attr.replace( value, '' );

			} );

			attr.trim();
			$el.attr( 'class', attr );

		} );

		return this;

	};

})( jQuery );