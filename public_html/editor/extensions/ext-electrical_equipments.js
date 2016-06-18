/*globals svgEditor, svgCanvas, $*/
/*jslint vars: true, eqeq: true*/
/*
 * ext-power_equipments.js
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
 
svgEditor.addExtension("Power Equipments", function(S) {'use strict';
    var start_x, start_y, cur_shape, current_d, lastBBox;
    // Get editor canvas
    var canv = svgEditor.canvas;
    var annotation = {
	d: "m23.985682,9.103919c-0.173096,-0.173218 -0.369871,-0.259857 -0.589292,-0.260282c-0.04675,0 -0.115478,0.011718 -0.208371,0.034729l-6.864224,1.698722l2.963884,-8.025747c0.057739,-0.115539 0.086882,-0.219421 0.086882,-0.31201c0,-0.19635 -0.075407,-0.366714 -0.225432,-0.511213c-0.150207,-0.144682 -0.335142,-0.21681 -0.554563,-0.21681l-5.685579,0c-0.184875,0 -0.346557,0.051911 -0.485349,0.155914c-0.138671,0.104125 -0.23126,0.237089 -0.277342,0.39871l-3.484144,14.300982c-0.057861,0.2771 0.017243,0.502531 0.22531,0.676052c0.150146,0.127439 0.329132,0.190582 0.537199,0.190582c0.092528,0 0.161864,-0.005404 0.208067,-0.017061l7.037624,-1.750876l-3.414808,14.006215c-0.046143,0.184875 -0.020218,0.358153 0.078139,0.519835c0.098296,0.162046 0.24571,0.271757 0.44206,0.329496c0.115539,0.022889 0.196653,0.034486 0.242796,0.034486c0.335142,0 0.577635,-0.144196 0.728024,-0.433256l9.360427,-20.055837c0.127196,-0.277282 0.087064,-0.531613 -0.121307,-0.762631z"
    };

    return {
	// Extension name
	name: "Electrical Equipments",
	// Extension toolbar icon
	svgicons: svgEditor.curConfig.extPath + "electrical_equipments.svg",
	// Multiple buttons can be added in this array
	buttons: [{
	    // Must match the icon ID in icon svg markup
	    id: "electrical_equipments", 

	    // This indicates that the button will be added to the "mode"
	    // button panel on the left side
	    type: "mode", 

	    // Tooltip text
	    title: "Electrical Equipments", 
	    
	    // Events
	    events: {
		'click': function() {
		    // The action taken when the button is clicked on.
		    // For "mode" buttons, any other button will 
		    // automatically be de-pressed.
		    svgCanvas.setMode("power_equipments");
		}
	    }
	}],
	// This is triggered when the main mouse button is pressed down 
	// on the editor canvas (not the tool panels)
	mouseDown: function(opts) {
	    // Check the mode on mousedown
	    if(svgCanvas.getMode() == "power_equipments") {
		var cur_style = canv.getStyle();
		// The returned object must include "started" with 
		// a value of true in order for mouseUp to be triggered
		var equipment = svgEditor.fid.drawing.createEquipment('Electrical', {name: 'Electrical'}, {
		    'element': 'path',
		    'curStyles': true,
		    'attr': {
			'd': annotation.d,
			'id': canv.getNextId(),
			'stroke': 1,
			'opacity': cur_style.opacity / 2,
			'style': 'pointer-events:none',
			'class': 'power equipments'
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
	    if(svgCanvas.getMode() == "power_equipments") {
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

