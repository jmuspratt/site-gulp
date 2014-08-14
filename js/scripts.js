// scripts.js
// Written by James Muspratt, 2014, with credits listed below.


//	+++++++++++++++++++++++++++++++++++++
//	Utilities are functions that each object below might need.
//	+++++++++++++++++++++++++++++++++++++

//	Utilities -------------------------------

var Utilities = {
	getSize: function() {
		var size_string = window.getComputedStyle(document.body,':after').getPropertyValue('content')
		size_string = size_string.replace(/["']/g, "")
		size_string = size_string.replace("size", "")
		var	size = parseInt(size_string)
		return size
	}
} // Utilities
	
	
	
	
//	+++++++++++++++++++++++++++++++++++++
//	Store each feature as an object literal with settings / init / bind / *component functions* pattern. We can use jQuery selectors/objects in each object's settings parameters (outside of document.ready), because this script file loads at the bottom of the page and all DOM elements are available. Based on http://css-tricks.com/how-do-you-structure-javascript-the-module-pattern-edition/
//	+++++++++++++++++++++++++++++++++++++



//	Animated Scrolling -------------------------------

var AnimatedScrolling = {
	settings: {
		$animatables: $('.animate'),
		speed: 1200
	},
	init: function() {
		AnimatedScrolling.bind()
	},
	bind: function() {
		AnimatedScrolling.settings.$animatables.click( function() {
			var clicked_link = this
			if ( AnimatedScrolling.checkSamePage(clicked_link) ) {
				AnimatedScrolling.doScroll(clicked_link) 
				return false // don't jump to hash
			}
		})
	},
	checkSamePage: function(clicked_link) {
		if (location.pathname.replace(/^\//,'') == clicked_link.pathname.replace(/^\//,'') && location.hostname == clicked_link.hostname) {
			return true
		}
		else {return false}
	},
	doScroll: function(clicked_link) {
		var $target = $(clicked_link.hash)
		$target = $target.length ? $target : $('[name=' + clicked_link.hash.slice(1) +']')
		if ($target.length) {
			$('html,body').animate({
				scrollTop: $target.offset().top
			}, AnimatedScrolling.settings.speed)
		}
	}
} 
// -------------------------------


//	Flag Waypoints -------------------------------

var FlagWaypoints = {
	settings: {
		$waypoints: $('.waypoint')
	},
	init: function() {
		FlagWaypoints.bind()
	},
	bind: function() {
		FlagWaypoints.settings.$waypoints.waypoint(function(direction) {
			if (direction == 'down') {
				FlagWaypoints.addTheClass(this)
			}
		},	{
			offset: function() {
				return 400 // trip waypoint when element is this many px from top 
			}
		})
	},
	addTheClass: function(target) {
		$(target).addClass('waypoint-active')
	}
}
// -------------------------------


//	OpenClose -------------------------------
	
var OpenClose = {
	settings: {
		$triggers: $('a.trigger'),
		$to_hide: $('.hide')
	},
	init: function() {
		OpenClose.bind()
	},
	bind: function() {
		OpenClose.hideThings()
		OpenClose.settings.$triggers.click( function() {
			var $clicked_trigger = $(this)
			OpenClose.manageClick($clicked_trigger)
			return false
		})
	},
	// Functions
	manageClick: function($clicked_trigger) {
		OpenClose.displayToggle($clicked_trigger)
		OpenClose.textToggle($clicked_trigger)
	},
	hideThings: function()	{
		OpenClose.settings.$to_hide.hide()
	},
	displayToggle: function($clicked_trigger) {
		var target_id = $clicked_trigger.attr("href")
		var $target = $(target_id)
		if ( $target.hasClass("open") ) {
			$target.removeClass("open").slideToggle(300)
			$clicked_trigger.removeClass("active")
		}
		else {
			$target.addClass("open").slideToggle(300)
			$clicked_trigger.addClass("active")
		}
	},
	textToggle: function($clicked_trigger) {
		if ( $clicked_trigger.data('default-text') ) {
			var default_text = $clicked_trigger.data('default-text')
		}
		if ($clicked_trigger.data("alt-text") ) {
			var alt_text 	 = $clicked_trigger.data("alt-text")
		}
		var current_text = $clicked_trigger.text()
		if (alt_text && default_text) {
			if ( default_text == current_text ) {
				$clicked_trigger.text(alt_text)
			}
			else {
				$clicked_trigger.text(default_text)
			}
		}
	}
} 
// -------------------------------

	
//	TapHover (normalize touchscreen taps vs. mouse hovers) -------------------------------

var TapHover = {
	settings: {
		$hoverables: $('.hoverable')
	},
	init: function() {
		TapHover.bind()
	},
	bind: function() {
		// touchscreen
		if ( Modernizr.touch ) {
			TapHover.settings.$hoverables.click(function(){ 
				TapHover.tapHoverable( this ) 
				return false
			})
		}
		// mouse
		else { TapHover.settings.$hoverables.hover(
			function() {TapHover.mouseIn( this )},
			function() {TapHover.mouseOut( this )})
		}
	},
	// touchscreen
	tapHoverable: function(tapped_element) {
		if (! ($(tapped_element).hasClass('hover')) ) {
			TapHover.settings.$hoverables.removeClass('hover')
			$(tapped_element).addClass('hover')
		}
		else {
			TapHover.settings.$hoverables.removeClass('hover')
		}
	},
	// mouse
	mouseIn: function(hovered_element) {
		$(hovered_element).addClass('hover')
	},
	mouseOut: function(hovered_element) {
		$(hovered_element).removeClass('hover')
	}
}
// -------------------------------




//	+++++++++++++++++++++++++++++++++++++
//	Get features based on <body> tag's data-features attribute, a space-separated string of the features necessary for that page. Based on http://viget.com/extend/javascript-execution-patterns-for-non-web-apps and http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
//	+++++++++++++++++++++++++++++++++++++


var SiteFeatures = {
	init: function() {
		var features = $('body').data('features')
		var featuresArray = []
 			 
		if(features) {
			featuresArray = features.split(' ')
			for(var x = 0, length = featuresArray.length; x < length; x++) {
				var func = featuresArray[x]
				// run function from string name
				if(window[func] && typeof window[func].init === 'function') {
					window[func].init()
				}
			}
		}
	}
} // Site.features
		
		
$(document).ready(function() {
	SiteFeatures.init()
}) // end document.ready

