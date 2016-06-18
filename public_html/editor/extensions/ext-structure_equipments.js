/*globals svgEditor, svgCanvas, $*/
/*jslint vars: true, eqeq: true*/
/*
 * ext-home_equipments.js
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
 
svgEditor.addExtension("Home Equipments", function(S) {'use strict';
    var start_x, start_y, cur_shape, current_d, lastBBox;
    // Get editor canvas
    var canv = svgEditor.canvas;
    var annotation = {
	d: "M15.45,7L14,5.551V2c0-0.55-0.45-1-1-1h-1c-0.55,0-1,0.45-1,1v0.553L9,0.555C8.727,0.297,8.477,0,8,0S7.273,0.297,7,0.555  L0.55,7C0.238,7.325,0,7.562,0,8c0,0.563,0.432,1,1,1h1v6c0,0.55,0.45,1,1,1h3v-5c0-0.55,0.45-1,1-1h2c0.55,0,1,0.45,1,1v5h3  c0.55,0,1-0.45,1-1V9h1c0.568,0,1-0.437,1-1C16,7.562,15.762,7.325,15.45,7z"
    };

    return {
	// Extension name
	name: "Structure Equipments",
	// Extension toolbar icon
	svgicons: svgEditor.curConfig.extPath + "structure_equipments.svg",
	// Multiple buttons can be added in this array
	buttons: [{
	    // Must match the icon ID in icon svg markup
	    id: "structure_equipments", 

	    // This indicates that the button will be added to the "mode"
	    // button panel on the left side
	    type: "mode", 

	    // Tooltip text
	    title: "Structure Equipments", 
	    
	    // Events
	    events: {
		'click': function() {
		    // The action taken when the button is clicked on.
		    // For "mode" buttons, any other button will 
		    // automatically be de-pressed.
		    svgCanvas.setMode("home_equipments");
		}
	    }
	}],
	// This is triggered when the main mouse button is pressed down 
	// on the editor canvas (not the tool panels)
	mouseDown: function(opts) {
	    // Check the mode on mousedown
	    if(svgCanvas.getMode() == "home_equipments") {
		var cur_style = canv.getStyle();
		// The returned object must include "started" with 
		// a value of true in order for mouseUp to be triggered
		var equipment = svgEditor.fid.drawing.createEquipment('Home', {name: 'Home'}, {
		    'element': 'path',
		    'curStyles': true,
		    'attr': {
			'd': annotation.d,
			'id': canv.getNextId(),
			'stroke': 1,
			'opacity': cur_style.opacity / 2,
			'style': 'pointer-events:none',
			'class': 'home equipments'
		    }
		});
		cur_shape = equipment.element;
		svgEditor.fid.drawing.addEquipment(equipment);
		// Make sure shape uses absolute values
		if (/[a-z]/.test(annotation.d)) {
		    current_d = canv.pathActions.convertPath(cur_shape);
		    cur_shape.setAttribute('d', current_d);
		    console.log(cur_shape);
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
	    if(svgCanvas.getMode() == "home_equipments") {
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

