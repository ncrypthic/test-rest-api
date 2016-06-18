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
svgEditor.addExtension("Equipments", function(S) {'use strict';
    var start_x, start_y, cur_shape, current_d, lastBBox;
    // Get editor canvas
    var canv = svgEditor.canvas;
    var annotation = {
	wrench_equipments: 
                {
                    name: "Wrench Equipments", 
                    id: "process_equipments",
                    d: "m21.594226,11.106447l-1.047368,-1.10881l0.010801,-2.206294l3.841276,-4.066616c-1.830374,-0.696518 -3.956588,-0.269525 -5.42313,1.283048c-1.462325,1.548108 -1.867817,3.790666 -1.217815,5.724712l-12.398488,13.125707c-0.867664,0.918563 -0.867664,2.407975 0,3.326538c0.867664,0.918563 2.274544,0.918563 3.142208,0l12.398385,-13.125707c1.826774,0.688133 3.94517,0.258853 5.407494,-1.289255c1.462325,-1.548108 1.867817,-3.790666 1.217815,-5.724712l-3.836339,4.061389l-2.09484,0z"
                },
        safety_equipments: 
                {
                    name: "Safety Equipments", 
                    id: "safety_equipments",
                    d: "m16,2c-7.72725,0 -14,6.26717 -14,14c0,7.72963 6.26949,14 14,14c7.72643,0 14,-6.26649 14,-14c0,-7.72678 -6.26691,-14 -14,-14zm5.09389,19.09389c-2.81271,2.81277 -7.37053,2.81754 -10.18778,0c-2.81326,-2.81326 -2.81639,-7.37141 0,-10.18779c2.81467,-2.81468 7.37242,-2.81549 10.18778,0c2.81298,2.81277 2.81678,7.37134 0,10.18779zm0.36053,-16.12569l-1.68619,2.96019c-2.37293,-1.11063 -5.16118,-1.1115 -7.53655,0.00007l-1.68619,-2.96026c3.35925,-1.66463 7.43632,-1.72091 10.90893,0zm-16.49438,5.59409l2.96053,1.68639c-1.10689,2.37817 -1.11844,5.21942 0.07326,7.65562l-2.95787,1.68482c-1.73097,-3.38664 -1.80872,-7.51657 -0.07591,-11.02683l-0.00001,0zm5.67238,16.51191l1.68734,-2.96223c2.32393,1.05659 5.0334,1.05788 7.36053,-0.00007l1.68734,2.9623c-3.3269,1.61584 -7.32383,1.65689 -10.73521,0zm13.3738,-7.16983c1.18952,-2.43206 1.18211,-5.27304 0.0732,-7.65562l2.96053,-1.68639c1.67612,3.39541 1.71303,7.5267 -0.07592,11.0269l-2.9578,-1.68489l-0.00001,0z"
                },
        home_equipments: 
                {
                    name: "Home Equipments",    
                    id: "structure_equipments",
                    d: "M15.45,7L14,5.551V2c0-0.55-0.45-1-1-1h-1c-0.55,0-1,0.45-1,1v0.553L9,0.555C8.727,0.297,8.477,0,8,0S7.273,0.297,7,0.555  L0.55,7C0.238,7.325,0,7.562,0,8c0,0.563,0.432,1,1,1h1v6c0,0.55,0.45,1,1,1h3v-5c0-0.55,0.45-1,1-1h2c0.55,0,1,0.45,1,1v5h3  c0.55,0,1-0.45,1-1V9h1c0.568,0,1-0.437,1-1C16,7.562,15.762,7.325,15.45,7z"
                },
        power_equipments: 
                {
                    name: "Power Equipments", 
                    id: "electrical_equipments",
                    d: "m23.985682,9.103919c-0.173096,-0.173218 -0.369871,-0.259857 -0.589292,-0.260282c-0.04675,0 -0.115478,0.011718 -0.208371,0.034729l-6.864224,1.698722l2.963884,-8.025747c0.057739,-0.115539 0.086882,-0.219421 0.086882,-0.31201c0,-0.19635 -0.075407,-0.366714 -0.225432,-0.511213c-0.150207,-0.144682 -0.335142,-0.21681 -0.554563,-0.21681l-5.685579,0c-0.184875,0 -0.346557,0.051911 -0.485349,0.155914c-0.138671,0.104125 -0.23126,0.237089 -0.277342,0.39871l-3.484144,14.300982c-0.057861,0.2771 0.017243,0.502531 0.22531,0.676052c0.150146,0.127439 0.329132,0.190582 0.537199,0.190582c0.092528,0 0.161864,-0.005404 0.208067,-0.017061l7.037624,-1.750876l-3.414808,14.006215c-0.046143,0.184875 -0.020218,0.358153 0.078139,0.519835c0.098296,0.162046 0.24571,0.271757 0.44206,0.329496c0.115539,0.022889 0.196653,0.034486 0.242796,0.034486c0.335142,0 0.577635,-0.144196 0.728024,-0.433256l9.360427,-20.055837c0.127196,-0.277282 0.087064,-0.531613 -0.121307,-0.762631z"
                },
        remove_equipments: 
                {
                    name: "Remove Equipments", 
                    id: "remove_equipments",
                    d: "m21.785112,11.869946c-0.013833,-0.332649 -0.138658,-0.662558 -0.395772,-0.916414c-0.256092,-0.253871 -0.589023,-0.378444 -0.924649,-0.392247c-0.373541,-0.015581 -0.751704,0.109051 -1.036485,0.392247l-3.178946,3.151546l-3.178961,-3.151546c-0.285684,-0.283196 -0.662943,-0.40691 -1.036514,-0.392247c-0.335641,0.013744 -0.668512,0.137473 -0.924649,0.392247c-0.256107,0.253856 -0.38185,0.583765 -0.395787,0.916414c-0.015699,0.370253 0.110044,0.744091 0.395787,1.027287l3.178946,3.151546l-3.178946,3.150628c-0.285743,0.283137 -0.410568,0.657093 -0.395787,1.027243c0.013878,0.332649 0.138717,0.662603 0.395787,0.916414c0.256137,0.253871 0.589008,0.378488 0.924649,0.392247c0.373571,0.015566 0.75083,-0.109007 1.036514,-0.392247l3.178961,-3.150583l3.179864,3.151546c0.285743,0.283137 0.663002,0.406866 1.036529,0.392247c0.335626,-0.013759 0.668512,-0.137473 0.924649,-0.392247c0.256152,-0.253871 0.38185,-0.58378 0.395772,-0.916414c0.015714,-0.370253 -0.110029,-0.744106 -0.395772,-1.027287l-3.179879,-3.151546l3.178916,-3.150628c0.285773,-0.283152 0.411487,-0.657048 0.395772,-1.028205zm-5.535852,-10.483747c-8.170177,0 -14.79438,6.565197 -14.79438,14.66258s6.624203,14.66258 14.79438,14.66258s14.79438,-6.565197 14.79438,-14.66258s-6.624218,-14.66258 -14.79438,-14.66258zm0,26.575917c-6.627876,0 -12.020434,-5.344497 -12.020434,-11.913338s5.392558,-11.913338 12.020434,-11.913338s12.020434,5.344497 12.020434,11.913338s-5.392558,11.913338 -12.020434,11.913338z"
                }
    };

    return {
	// Extension name
	name: "Equipments",
	// Extension toolbar icon
        svgicons: svgEditor.curConfig.extPath + "equipments.svg",
	// Multiple buttons can be added in this array
	buttons: [{
	    // Must match the icon ID in icon svg markup
	    id: annotation.wrench_equipments.id, 

	    // This indicates that the button will be added to the "mode"
	    // button panel on the left side
	    type: "mode", 

	    // Tooltip text
	    title: annotation.wrench_equipments.name, 
	    
	    // Events
	    events: {
		'click': function() {
		    // The action taken when the button is clicked on.
		    // For "mode" buttons, any other button will 
		    // automatically be de-pressed.
		    svgCanvas.setMode(
                            {
                                name: annotation.wrench_equipments.name,
                                mode: annotation.wrench_equipments
                            });
		}
	    }
	},
        {
            id: annotation.safety_equipments.id,
            type: "mode",
            title: annotation.safety_equipments.name,

            events: {
                'click': function() {
                    svgCanvas.setMode(
                            {
                                name: annotation.safety_equipments.name,
                                mode: annotation.safety_equipments
                            });
                }
            }
        },
        {
            id: annotation.remove_equipments.id,
            type: "mode",
            title: annotation.remove_equipments.name,

            events: {
                'click': function() {
                    svgCanvas.setMode(
                            {
                                name: annotation.remove_equipments.name,
                                mode: annotation.remove_equipments
                            });
                }
            }          
        },
        {
            id: annotation.power_equipments.id,
            type: "mode",
            title: annotation.power_equipments.name,

            events: {
                'click': function() {
                    svgCanvas.setMode(
                            {
                                name: annotation.power_equipments.name,
                                mode: annotation.power_equipments
                            });
                }
            }
        },
        {
            id: annotation.home_equipments.id,
            type: "mode",
            title: annotation.home_equipments.name,

            events: {
                'click': function() {
                    svgCanvas.setMode(
                            {
                                name: annotation.home_equipments.name,
                                mode: annotation.home_equipments
                            });
                }
            }     
        }],
	// This is triggered when the main mouse button is pressed down 
	// on the editor canvas (not the tool panels)
	mouseDown: function(opts) {
	    // Check the mode on mousedown
            if( svgCanvas.getMode()["name"] === annotation.wrench_equipments.name ||
                svgCanvas.getMode()["name"] === annotation.safety_equipments.name ||
                svgCanvas.getMode()["name"] === annotation.remove_equipments.name ||
                svgCanvas.getMode()["name"] === annotation.power_equipments.name ||
                svgCanvas.getMode()["name"] === annotation.home_equipments.name)
            {
                    var cur_style = canv.getStyle();
                      // The returned object must include "started" with 
                      // a value of true in order for mouseUp to be triggered
                      var equipment = svgEditor.fid.drawing.createEquipment(svgCanvas.getMode()["mode"].name, {name: svgCanvas.getMode()["mode"].name}, {
                          'element': 'path',
                          'curStyles': true,
                          'attr': {
                              'd': svgCanvas.getMode()["mode"].d,
                              'id': canv.getNextId(),
                              'stroke': 1,
                              'opacity': cur_style.opacity / 2,
                              'style': 'pointer-events:none',
                              'class': svgCanvas.getMode()["mode"].name
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
		if( svgCanvas.getMode()["name"] === annotation.wrench_equipments.name ||
                svgCanvas.getMode()["name"] === annotation.safety_equipments.name ||
                svgCanvas.getMode()["name"] === annotation.remove_equipments.name ||
                svgCanvas.getMode()["name"] === annotation.power_equipments.name ||
                svgCanvas.getMode()["name"] === annotation.home_equipments.name )
            {
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

