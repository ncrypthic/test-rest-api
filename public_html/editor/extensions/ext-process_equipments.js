/*globals svgEditor, svgCanvas, $*/
/*jslint vars: true, eqeq: true*/
/*
 * ext-wrench_equipments.js
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
 
svgEditor.addExtension("Process Equipments", function(S) {'use strict';
    var start_x, start_y, cur_shape, current_d, lastBBox;
    // Get editor canvas
    var canv = svgEditor.canvas;
    var annotation = {
	d: "m21.594226,11.106447l-1.047368,-1.10881l0.010801,-2.206294l3.841276,-4.066616c-1.830374,-0.696518 -3.956588,-0.269525 -5.42313,1.283048c-1.462325,1.548108 -1.867817,3.790666 -1.217815,5.724712l-12.398488,13.125707c-0.867664,0.918563 -0.867664,2.407975 0,3.326538c0.867664,0.918563 2.274544,0.918563 3.142208,0l12.398385,-13.125707c1.826774,0.688133 3.94517,0.258853 5.407494,-1.289255c1.462325,-1.548108 1.867817,-3.790666 1.217815,-5.724712l-3.836339,4.061389l-2.09484,0z"
    };

    return {
	// Extension name
	name: "Process Equipments",
	// Extension toolbar icon
	svgicons: svgEditor.curConfig.extPath + "process_equipments.svg",
	// Multiple buttons can be added in this array
	buttons: [{
	    // Must match the icon ID in icon svg markup
	    id: "process_equipments", 

	    // This indicates that the button will be added to the "mode"
	    // button panel on the left side
	    type: "mode", 

	    // Tooltip text
	    title: "Process Equipments", 
	    
	    // Events
	    events: {
		'click': function() {
		    // The action taken when the button is clicked on.
		    // For "mode" buttons, any other button will 
		    // automatically be de-pressed.
		    svgCanvas.setMode("process_equipments");
		}
	    }
	}],
	// This is triggered when the main mouse button is pressed down 
	// on the editor canvas (not the tool panels)
	mouseDown: function(opts) {
	    // Check the mode on mousedown
	    if(svgCanvas.getMode() == "process_equipments") {
		var cur_style = canv.getStyle();
                var category = svgEditor.fid.getCategoryByName('Process');
		// The returned object must include "started" with 
		// a value of true in order for mouseUp to be triggered
		var equipment = svgEditor.fid.drawing.createEquipment(category, {name: 'label', value: 'Process Equipments'}, {
		    'element': 'path',
		    'curStyles': true,
		    'attr': {
			'd': annotation.d,
//                        'transform' : annotation.transform,
			'id': canv.getNextId(),
			'stroke': 1,
			'opacity': cur_style.opacity / 2,
			'style': 'pointer-events:none',
			'class': 'wrench equipments'
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
	    if(svgCanvas.getMode() == "wrench_equipments") {
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

