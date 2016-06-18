/*globals svgEditor, svgCanvas, $*/
/*jslint vars: true, eqeq: true*/
/*
 * ext-remove_equipments.js
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
 
svgEditor.addExtension("Remove Equipments", function(S) {'use strict';
    var start_x, start_y, cur_shape, current_d, lastBBox;
    // Get editor canvas
    var canv = svgEditor.canvas;
    var annotation = {
	d: "m21.785112,11.869946c-0.013833,-0.332649 -0.138658,-0.662558 -0.395772,-0.916414c-0.256092,-0.253871 -0.589023,-0.378444 -0.924649,-0.392247c-0.373541,-0.015581 -0.751704,0.109051 -1.036485,0.392247l-3.178946,3.151546l-3.178961,-3.151546c-0.285684,-0.283196 -0.662943,-0.40691 -1.036514,-0.392247c-0.335641,0.013744 -0.668512,0.137473 -0.924649,0.392247c-0.256107,0.253856 -0.38185,0.583765 -0.395787,0.916414c-0.015699,0.370253 0.110044,0.744091 0.395787,1.027287l3.178946,3.151546l-3.178946,3.150628c-0.285743,0.283137 -0.410568,0.657093 -0.395787,1.027243c0.013878,0.332649 0.138717,0.662603 0.395787,0.916414c0.256137,0.253871 0.589008,0.378488 0.924649,0.392247c0.373571,0.015566 0.75083,-0.109007 1.036514,-0.392247l3.178961,-3.150583l3.179864,3.151546c0.285743,0.283137 0.663002,0.406866 1.036529,0.392247c0.335626,-0.013759 0.668512,-0.137473 0.924649,-0.392247c0.256152,-0.253871 0.38185,-0.58378 0.395772,-0.916414c0.015714,-0.370253 -0.110029,-0.744106 -0.395772,-1.027287l-3.179879,-3.151546l3.178916,-3.150628c0.285773,-0.283152 0.411487,-0.657048 0.395772,-1.028205zm-5.535852,-10.483747c-8.170177,0 -14.79438,6.565197 -14.79438,14.66258s6.624203,14.66258 14.79438,14.66258s14.79438,-6.565197 14.79438,-14.66258s-6.624218,-14.66258 -14.79438,-14.66258zm0,26.575917c-6.627876,0 -12.020434,-5.344497 -12.020434,-11.913338s5.392558,-11.913338 12.020434,-11.913338s12.020434,5.344497 12.020434,11.913338s-5.392558,11.913338 -12.020434,11.913338z"
    };

    return {
	// Extension name
	name: "Instrument Equipments",
	// Extension toolbar icon
	svgicons: svgEditor.curConfig.extPath + "instrument_equipments.svg",
	// Multiple buttons can be added in this array
	buttons: [{
	    // Must match the icon ID in icon svg markup
	    id: "instrument_equipments", 

	    // This indicates that the button will be added to the "mode"
	    // button panel on the left side
	    type: "mode", 

	    // Tooltip text
	    title: "Instrument Equipments", 
	    
	    // Events
	    events: {
		'click': function() {
		    // The action taken when the button is clicked on.
		    // For "mode" buttons, any other button will 
		    // automatically be de-pressed.
		    svgCanvas.setMode("remove_equipments");
		}
	    }
	}],
	// This is triggered when the main mouse button is pressed down 
	// on the editor canvas (not the tool panels)
	mouseDown: function(opts) {
	    // Check the mode on mousedown
	    if(svgCanvas.getMode() == "remove_equipments") {
		var cur_style = canv.getStyle();
		// The returned object must include "started" with 
		// a value of true in order for mouseUp to be triggered
		var equipment = svgEditor.fid.drawing.createEquipment('Remove', {name: 'Remove'}, {
		    'element': 'path',
		    'curStyles': true,
		    'attr': {
			'd': annotation.d,
                        'transform' : annotation.transform,
			'id': canv.getNextId(),
			'stroke': 1,
			'opacity': cur_style.opacity / 2,
			'style': 'pointer-events:none',
			'class': 'remove equipments'
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
	    if(svgCanvas.getMode() == "remove_equipments") {
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

