define(
    ["knockout", "jquery", "async", "./model/layout", "./model/worksite", "jqxAll"], 
    function(ko, $, async, Layout, Worksite) {
        // Instance
        var $app;
        
        function Application(layout) {
            this.layout = layout;
        };

        Application.prototype = {
            layout: null
        };

        function ViewModel($app, worksites, categories) {
            var self = this;
            
            function getWorksites() {
                var worksite = [];
                for (var i = 0; i < worksites.length; i++) {
                    var facility = [];
                    for (var j = 0; j < worksites[i].facilities.length; j++) {
                        var drawing = [];
                        for (var k = 0; k < worksites[i].facilities[j].drawings.length; k++) {
                            drawing.push({
                                icon: "image/drawingIcon.png", 
                                label: worksites[i].facilities[j].drawings[k].name,
                                class: 'drawing',
                                value: ko.observable(worksites[i].facilities[j].drawings[k])
                            });
                        }                
                        facility.push({
                            icon: "image/contactsIcon.png", 
                            label: worksites[i].facilities[j].name, 
                            expanded: true, 
                            items: drawing,
                            class: 'facility',
                            value: ko.observable(worksites[i].facilities[j])
                        });
                    }
                    worksite.push({
                       icon: "image/folderOpen.png", 
                       label: worksites[i].name, 
                       expanded: true,
                       items: facility ,
                       class: 'worksite',
                       value: ko.observable(worksites[i])
                    });
                }

                return worksite;
            };
            
            function getEquipmentCategories() {
                return [{ 
                        label: 'Categories', 
                        expanded: true,
                        items: categories
                    }];
            };
            
            function setDrawingEquipments() {
                var selectedCategories = [];
                self.categories.elmt
                    .jqxTree('getCheckedItems').forEach(function(item) {
                        if(item.value) {
                            selectedCategories.push(item.value);
                        }
                    });
                var tabIndex    = $app.layout.getSelectedContentTab();
                var editorPanel = $app.layout.getEditor(tabIndex);
                var editor      = editorPanel.find('iframe')[0].contentWindow;
                if(editor.$) {
                    editor.$(editor.document)
                            .trigger('select.categories.fid', {categories: selectedCategories});
                }
            }
            
            self.selected_equipment = {
                id: ko.observable(null),
                url: ko.observable(null),
                path: ko.observable(null),
                category: {
                    id: ko.observable(),
                    name: ko.observable()
                },
                drawing: ko.observable({}),
                properties: ko.observable([])
            };
            
            self.dialog = {
                title: ko.observable(''),
                content: ko.observable(''),
                ok: ko.observable(function(){}),
                cancel: ko.observable(function(){})
            };
            
            self.worksites = {
                elmt: null,
                menus: [],
                context_level: null,
                context_item: null,
                source: ko.computed(getWorksites),
                disabled: ko.observable(false),
                event: {
                    initialized: function(vm, e) {
                        self.worksites.elmt = $(e.args.element);
                        self.worksites.elmt.jqxTree({ allowDrag: false, allowDrop: false });
                        // Initialize menu
                        self.worksites.menus.push($('#worksite-context-menu'));
                        self.worksites.menus.push($('#facility-context-menu'));
                        self.worksites.menus.push($('#drawing-context-menu'));
                        self.worksites.menus.forEach(function(menu) {
                            menu.jqxMenu({ 
                                theme: 'office', 
                                autoOpenPopup: false, 
                                mode: 'popup', 
                                width: 150
                            });
                        });
                        $(document).bind('contextmenu', function(e) {
                            var id = $(e.target).parents('.jqx-tree').first().attr('id');
                            var isWorksiteTree = self.worksites.elmt.attr('id') === id;
                            var isWorksiteTreeItem = $(e.target).parent().hasClass('jqx-tree-item-li');
                            if (isWorksiteTree && isWorksiteTreeItem) {
                                return false;
                            }
                            
                            return true;
                        });
                        self.worksites.elmt.on('mouseenter', 'div.jqx-tree-item', function(e) {
                            var items = self.worksites.elmt.jqxTree('getItems');
                            self.worksites.context_level = -1;
                            items.forEach(function(item) {
                                if(item.element === e.target.parentElement) {
                                    self.worksites.context_level = item.level;
                                }
                            });
                        });
                    },
                    select: function() {
                        var item = self.worksites.elmt.jqxTree('getSelectedItem');
                        if(item.level < 2) {
                            return;
                        }
                        $app.layout.openEditor(function(editor) {
                            editor.svgEditor.fid.categories = categories;
                        });
                    },
                    contextmenu: function(vm, e) {
                        self.worksites.context_item = null;
                        if(self.worksites.context_level === -1) {
                            return false;
                        }
                        
                        self.worksites.menus.forEach(function(menu) {
                            menu.jqxMenu('close');
                        });
                        var elmt = $(e.target);
                        var id = elmt.parents('.jqx-tree').first().attr('id');
                        var isWorksiteTree = self.worksites.elmt.attr('id') === id;
                        var isWorksiteTreeItem = elmt.parent().hasClass('jqx-tree-item-li');
                        if(isWorksiteTree && isWorksiteTreeItem) {
                            var scrollTop = $(window).scrollTop();
                            var scrollLeft = $(window).scrollLeft();
                            self.worksites.menus[self.worksites.context_level]
                                .jqxMenu('open', parseInt(e.clientX) + 5 + scrollLeft, parseInt(e.clientY) + 5 + scrollTop);
                            self.worksites.context_item = elmt.parent()[0];
                            return true;
                        }
                    }
                },
                editDrawing: function(vm, e) {
                    var items = self.worksites.elmt.jqxTree('getItems');
                    var selectedItem;
                    items.forEach(function(item) {
                        if(item.element === self.worksites.context_item) {
                            selectedItem = item;
                        }
                    });
                    var model = ko.observable({drawing: selectedItem.value});
                    var window = $('<div data-bind="template: \'drawing-modal\'"></div>');
                    ko.applyBindings(model, window[0]);
                    window.jqxWindow({isModal: true, width: '50%', minHeight: '50%' });
                },
                removeDrawing: function() {
                    var items = self.worksites.elmt.jqxTree('getItems');
                    var selectedItem;
                    items.forEach(function(item) {
                        if(item.element === self.worksites.context_item) {
                            selectedItem = item;
                        }
                    });
                    self.dialog.title('Remove drawing confirmation');
                    self.dialog.content('Are you sure you want to remove `'+selectedItem.value.name+"` drawing?");
                    self.dialog.ok(function() {
                        alert('removed');
                    });
                    self.dialog.cancel(function() {
                        $app.layout.closeDialog();
                    });
                    $app.layout.openDialog();
                }
            };
            
            self.categories = {
                elmt: null,
                source: ko.computed(getEquipmentCategories),
                disabled: ko.observable(false),
                selectHandler: null,
                event: {
                    initialized: function(vm, e) {
                        self.categories.elmt = $(e.args.element);
                        self.categories.elmt.jqxTree({ 
                            hasThreeStates: true, 
                            allowDrag: false, 
                            allowDrop: false, 
                            checkboxes: true 
                        });
                        self.categories.elmt.addClass('category-filter');
                    },
                    checkChange: function(vm, e) {
                        if(self.categories.selectHandler) {
                            clearTimeout(self.categories.selectHandler);
                        }
                        self.categories.selectHandler = setTimeout(setDrawingEquipments, 50);
                    },
                    itemClick: function(vm, e) {
                        var elmt = e.args.element;
                        var isChecked = 
                                self.categories.elmt.jqxTree('getItem', elmt).checked;
                        if(isChecked) {
                            self.categories.elmt.jqxTree('uncheckItem', e.args.element);
                        } else {
                            self.categories.elmt.jqxTree('checkItem', e.args.element);
                        }
                    }
                }
            };
            
            $(document)
                .on('selectEquipment.editor.fid', function(e, equipment) {
                    self.selected_equipment.properties(equipment.properties);
                    var preview = $(equipment.element).parent();
                    if(preview.prop('nodeName').toLowerCase() === 'a') {
                        self.selected_equipment.url(preview.attr('xlink:href'));
                    } else {
                        self.selected_equipment.url("");
                    }
                })
                .on('clearSelection.editor.fid', function() {
                    self.selected_equipment.properties([]);
                    self.selected_equipment.url("");
                })
                .on('saveDrawing.editor.fid', function(e, equipments, cb) {
                    console.log(equipments);
                    cb();
                });
        };

        return (function() {
            if(!$app) {
                async.series(
                    [
                        // Get worksites from backend
                        function(next) {
                            $.getJSON("/api/worksites.json", function (data) { 
                                // Pass worksites to results
                                next(null, data);
                            }, function(err) {
                                next(err);
                            });
                        },
                        // Get categories from backend
                        function(next) {
                            $.getJSON('/api/categories.json', function(data){ 
                                // Pass categories to results
                                next(null, data);
                            }, function(err) {
                                next(err);
                            });
                        }
                    ],
                    // Results = [ worksites[], categories[] ]
                    function(err, results) {
                        if(err) {
                            alert('Oopsss...');
                            return;
                        }
                        var worksites = results[0];
                        var categories = results[1];
                        var initialDrawing = {equipments: []}, drawings = [];
                        // Find initial drawing
                        if( worksites[0] && 
                            worksites[0].facilities[0] &&
                            worksites[0].facilities[0].drawings.length > 1) {
                            drawings = worksites[0].facilities[0].drawings;
                            initialDrawing = drawings[drawings.length - 1];
                        }
                        
                        // Format categories
                        categories.forEach(function(category){
                            category.checked = true;
                            category.label = category.name;
                            category.value = category.name;
                        });

                        var $layout = new Layout();
                        $layout.initialize(function(editor) {
                            editor.window.$(editor.document)
                                .trigger('set.categories.fid', [categories])
                                .trigger('setDrawing.editor.fid', [initialDrawing]);
                        });
                        $app = new Application($layout);
                        ko.applyBindings(new ViewModel($app, results[0], results[1]));
                    }
                );
            }
            
            return $app;
        }());
    }
); 