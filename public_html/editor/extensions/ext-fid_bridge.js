/*globals svgEditor, svgCanvas, $*/
/*jslint vars: true, eqeq: true*/
/*
 * ext-fid_bridge.js
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2016 Lim Afriyadi
 *
 */

/* 
    This is a very basic SVG-Edit extension. It adds a "Hello World" button in
    the left panel. Clicking on the button, and then the canvas will show the
    user the point on the canvas that was clicked on.
*/
FID = (function($parent, $){
    function Equipment(canvas, category, props, json) {
	var self = this;
        self.category = category;
	self.element  = canvas.addSvgElementFromJson(json);
	self.properties = [];
        self.properties = self.properties.concat(category.properties, props);

	function serialize(props) {
	    var $properties = canvas.addSvgElementFromJson({
		'element': 'fid:properties', 
		'attr': {
		    'xmlns:fid': 'http://fid.ptsynergy.co.id/svg/namespace/Property'
		} 
	    });
	    $properties.textContent = JSON.stringify(self.properties);
	    $(self.element).empty();
	    $(self.element).append($properties);
        }

	function unserialize(propsJson) {
            var props = JSON.parse(propsJson);
            self.properties = props;
        }

        self.saveProperties = function() {
	    serialize(self.properties);
        };

        self.loadProperties = function() { 
            unserialize($(self.element).find('fid:properties').html());
        };

	self.saveProperties();
        
        $(self.element).on('click', function() {
            if(!$parent.$) {
                return;
            }
            $parent.$($parent.document).trigger('selectEquipment.editor.fid', self);
        });
        
        $parent.$($parent.document).trigger('selectEquipment.editor.fid', self);
    }

    function Drawing(canvas, imgUrl) {
	var self = this;
	var equipments = [];
        self.imageUrl = imgUrl;
	
	self.getEquipments = function() {
	    return equipments;
        };
	self.addEquipment = function(eq) {
            if(eq instanceof Equipment) { 
		equipments.push(eq);
            }
        };
	self.getEquipment = function(id) {
	    for(var i = 0; i < equipments.length; i++) {
                if(id === equipments[i].properties.id) {
                    return equipments[i];
                }
            }
        };
	self.getEquipmentByElement = function(elmt) {
            if(!$(elmt).attr('id')) {
                throw new Error('Element must have `id` attribute');
            }
            for(var i = 0; i < equipments.length; i++) {
                if($(elmt).attr('id') === $(equipments[i].element).attr('id')) {
                    return equipments[i];
                }
            }
        };
        self.getEquipmentsByCategory = function(category) {
            return $.grep(self.equipments, function(eq) {
                return eq.category.name === category;
            });
        };
	self.createEquipment = function(category, props, json) {
	    return new Equipment(canvas, category, props, json);
        };
        
        self.save = function(cb) {
            $parent.$($parent.document).trigger('saveDrawing.editor.fid', [equipments, cb]);
        };
    }

    function FID(svgEditor) {
        var self = this;
        self.index = 0;
	self.drawing = new Drawing(svgEditor.canvas);
        self.categories = [];
        self.getCategoryByName = function(name) {
            var selected;
            self.categories.forEach(function(category) {
                if(category.name === name) {
                    selected = category;
                }
            });
            
            return selected;
        };
        
        self.getCategoryById = function(id) {
            var selected;
            self.categories.forEach(function(category) {
                if(category.id === id) {
                    selected = category;
                }
            });
            
            return selected;
        };
        
        self.onSelect = function(cb) {
            var selectedElems = svgEditor.canvas.getSelectedElems();
            cb(window, selectedElems);
            if(selectedElems[0] === null) {
                $parent.$($parent.document).trigger('clearSelection.editor.fid');
            }
        };
        
        self.onLinkChange = function(href) {
            var selectedElems = svgEditor.canvas.getSelectedElems();
            var equipment = self.drawing.getEquipmentByElement(selectedElems[0]);
            if(equipment) {
                $parent.$($parent.document).trigger('selectEquipment.editor.fid', equipment);
            }
        };
        
        self.onLoad = function(e, drawing) {
            
            if(drawing && drawing.equipments.length > 0) {
                drawing.equipments.forEach(function() {
                    self.drawing.equipments = drawing.equipments;
                });
            }
        };
    };

    FID.prototype = $parent.$app;
    
    return FID;
})(window.parent||window, $);

svgEditor.addExtension("FID Bridge", function(S) {'use strict';
    var fid = svgEditor.fid = new FID(svgEditor);
    // Set categories
    $(document).on('set.categories.fid', function(e, categories) {
        fid.categories = categories;
    });
    // Select categories
    $(document).on('select.categories.fid', function(e, selected) {
        if(!selected) {
            return;
        }
        var equipments = fid.drawing.getEquipments().map(function(eq){
            return eq.element;
        });
        $(equipments).hide();
        fid.drawing.getEquipments().forEach(function(eq) {
            if(selected.categories && selected.categories.indexOf(eq.category.name) >= 0) {
                $(eq.element).show();
            }
        });
    });
    // Set drawing
    $(document).on('setDrawing.editor.fid', find.onLoad);
    return {
	name: "FID Bridge",
	svgicons: svgEditor.curConfig.extPath + "fid_bridge.svg",
	buttons: [
            {
                id: 'tool_preview',
                type: 'context',
                panel: 'editor_panel',
                title: 'Preview',
                events: {}
            },
            {
                id: 'tool_fid_save',
                type: 'context',
                panel: 'editor_panel',
                title: 'Save',
                events: {
                    'click': function() {
                        fid.drawing.save(function() {
                            $('#tool_preview').click();
                        });
                    }
                }
            },
            {
                id: 'tool_fid_background',
                type: 'context',
                panel: 'editor_panel',
                title: 'Image',
                events: {
                    'click': function() {
                        $('#background-file').click();
                    }
                }
            }
        ],
	callback: function() {
            var bgInput = $('<input type="file" id="background-file" style="display: none;"/>');
            bgInput.change(function() {
                svgEditor.canvas.setBackground(bgInput.val());
                svgEditor.fid.$app.layout
                    .getContentTab(svgEditor.fid.index)
                    .find('.preview-wrapper')
                    .css('background-image', bgInput.val());
            });
            // $('body').append(bgInput);
            svgEditor.ready(function(){
                var oldSelectHandler = svgEditor.canvas.bind('selected', function() {
                    fid.onSelect(oldSelectHandler);
                });
                var w = window.parent;
                if (w) {
                    try {
                        $(document).trigger('bridgeReady.editor.fid');
                    }
                    catch(e) {
                        console.error(e);
                    }
                }
                // Hyperlink handler
                $('#link_url').change(function(){
                    fid.onLinkChange();
                });
                var oldMakeHyperlink = svgEditor.canvas.makeHyperlink;
                svgEditor.canvas.makeHyperlink = function makeHyperlink(url) {
                    oldMakeHyperlink(url)
                    fid.onLinkChange();
                };
                // End hyperlink
            });
        }
    };
});
