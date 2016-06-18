/*globals svgEditor, svgCanvas, $*/
/*jslint vars: true, eqeq: true*/
/*
 * ext-safety_equipments.js
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2010 Alexis Deveria
 *
 */
 
/* 
    This is a very basic SVG-Edit extension. It adds a "Hello World" button in
    the left panel. Clicking on the button, and then the canvas will show the
    user the point on the canvas that was clicked on.
*/
 
svgEditor.addExtension("Safety Equipments", function(S) {'use strict';
    var start_x, start_y, cur_shape, current_d, lastBBox;
    // Get editor canvas
    var canv = svgEditor.canvas;
    var annotation = {
	d: "m62,2.5c-32.840818,0 -59.5,26.635492 -59.5,59.5c0,32.850929 26.645315,59.5 59.5,59.5c32.837357,0 59.5,-26.632599 59.5,-59.5c0,-32.8388 -26.634338,-59.5 -59.5,-59.5zm21.649048,81.149048c-11.95401,11.9543 -31.324726,11.974525 -43.298092,0c-11.956322,-11.956322 -11.969614,-31.32848 0,-43.298092c11.962391,-11.962391 31.332821,-11.965855 43.298092,0c11.95517,11.9543 11.971352,31.32819 0,43.298092zm1.532272,-68.53418l-7.16629,12.580782c-10.084961,-4.72014 -21.93499,-4.723894 -32.03035,0.00029l-7.166283,-12.581072c14.276825,-7.074725 31.604324,-7.313883 46.362923,0zm-70.101115,23.774872l12.582231,7.167156c-4.70426,10.107201 -4.753357,22.182522 0.311357,32.536388l-12.570958,7.160507c-7.356623,-14.393227 -7.687058,-31.945435 -0.32263,-46.864052zm24.107615,70.175629l7.171196,-12.589447c9.876713,4.490517 21.391983,4.496002 31.282272,-0.00029l7.171188,12.589737c-14.139336,6.86734 -31.126301,7.041801 -45.624657,0zm56.838684,-30.471794c5.055473,-10.33625 5.023987,-22.410412 0.311081,-32.536392l12.582214,-7.167152c7.123543,14.430485 7.280373,31.988472 -0.322632,46.864349l-12.570663,-7.160805z"
    };

    return {
	// Extension name
	name: "Safety Equipments",
	// Extension toolbar icon
	svgicons: svgEditor.curConfig.extPath + "safety_equipments.svg",
	// Multiple buttons can be added in this array
	buttons: [{
	    // Must match the icon ID in icon svg markup
	    id: "safety_equipments", 

	    // This indicates that the button will be added to the "mode"
	    // button panel on the left side
	    type: "mode", 

	    // Tooltip text
	    title: "Safety Equipments", 
	    
	    // Events
	    events: {
		'click': function() {
		    // The action taken when the button is clicked on.
		    // For "mode" buttons, any other button will 
		    // automatically be de-pressed.
		    svgCanvas.setMode("safety_equipments");
		}
	    }
	}],
	// This is triggered when the main mouse button is pressed down 
	// on the editor canvas (not the tool panels)
	mouseDown: function(opts) {
	    // Check the mode on mousedown
	    if(svgCanvas.getMode() == "safety_equipments") {
		var cur_style = canv.getStyle();
                var category = svgEditor.fid.getCategoryByName('Safety');
		// The returned object must include "started" with 
		// a value of true in order for mouseUp to be triggered
		var equipment = svgEditor.fid.drawing.createEquipment(category, {name: 'label', value: 'Fire extinguisher'}, {
		    'element': 'path',
		    'curStyles': true,
		    'attr': {
			'd': annotation.d,
			'id': canv.getNextId(),
			'stroke': 1,
			'opacity': cur_style.opacity / 2,
			'style': 'pointer-events:none',
			'class': 'safety equipments'
		    }
		});
		cur_shape = equipment.element;
		svgEditor.fid.drawing.addEquipment(equipment);
		// Make sure shape uses absolute values
		if (/[a-z]/.test(annotation.d)) {
		    current_d = canv.pathActions.convertPath(cur_shape);
		    cur_shape.setAttribute('d', current_d);
		    canv.pathActions.fixEnd(cur_shape);
		}
		var zoom = svgCanvas.getZoom();

		// Move `path` element to position
		cur_shape.setAttribute('transform', 'translate(' + opts.start_x + ',' + opts.start_y + ')');

		canv.recalculateDimensions(cur_shape);

		var tlist = canv.getTransformList(cur_shape);

		lastBBox = cur_shape.getBBox();

		return { started: true };
	    }
	},
	
	// This is triggered from anywhere, but "started" must have been set
	// to true (see above). Note that "opts" is an object with event info
	mouseUp: function(opts) {
	    // Check the mode on mouseup
	    if(svgCanvas.getMode() == "safety_equipments") {
		var zoom = svgCanvas.getZoom();
		
		// Get the actual coordinate by dividing by the zoom value
		var x = opts.mouse_x / zoom;
		var y = opts.mouse_y / zoom;
		svgCanvas.addToSelection([cur_shape], true);
		return {
		    keep: true,
		    element: cur_shape,
		    started: false
		};
	    }
	}
    };
});

