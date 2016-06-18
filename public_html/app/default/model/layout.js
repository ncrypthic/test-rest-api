define(['jquery', 'jqxDockingLayout'], function($){
    var applicationLayout = [{
        type: 'layoutGroup',
        orientation: 'horizontal',
        items: [
            {
                type: 'layoutGroup',
                orientation: 'vertical',
                width: '18%',
                items: [
                    {
                        type: 'documentGroup',
                        height: '70%',
                        minHeight: '30%',
                        maxHeight: '70%',
                        width: '100%',
                        items: [
                            {
                                type: 'documentPanel',
                                title: 'Facility',
                                contentContainer: 'facility-panel',
                                allowClose: false
                            }, 
                            {
                                type: 'documentPanel',
                                title: 'Equipments',
                                contentContainer: 'list-panel'
                            }, 
                            {
                                type: 'documentPanel',
                                position: 'bottom',
                                title: 'P&ID   ',
                                contentContainer: 'pid-panel'
                            }               
                        ]
                    },
                    {
                        type: 'documentGroup',
                        height: '30%',
                        minHeight: '30%',
                        maxHeight: '70%',
                        pinnedHeight: '10%',
                        items: [
                            {
                                type: 'documentPanel',
                                title: 'Content List',
                                allowClose: false,
                                contentContainer: 'ContainerList'
                            }
                        ]
                    }
                ]
            }, 
            {
                type: 'documentGroup',
                orientation: 'vertical',
                width: '65%',
                items: [
                    {
                        type: 'documentPanel',
                        contentContainer: 'editor-panel'
                    }
                ]
            },
            {
                type: 'layoutGroup',
                width: '17%',
                orientation: 'vertical',
                items: [
                    {
                        type: 'documentGroup',
                        height: '30%',
                        minHeight: '25%',
                        items:[
                            {
                                type: 'documentPanel',
                                title: 'Video',
                                contentContainer: 'preview-panel',
                                allowClose: false
                            }
                        ]
                    },
                    {
                        type: 'tabbedGroup',
                        height: '70%',
                        minHeight: '25%',
                        allowClose: false,
                        items:[
                            {
                                type: 'layoutPanel',
                                title: 'Properties',
                                contentContainer: 'properties-panel'
                            }
                        ]
                    }
                ]
            }
        ]
    }];

    function Layout() {
        var self = this;
        var $wrapper = $('#wrapper');
        var $dialog = $('#confirm-window');
        var $contentPanel = $('#main-content-panel');
        var newDocumentIndex = 2;

        function initMainContent(initCallback) {
            var tabs = $contentPanel.find('#tabs');
            tabs.jqxTabs({ 
                theme: 'office', 
                width: '100%',
                showCloseButtons: true,
            });
            tabs.on('click', '.editor-btn', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var panel = $(e.target).parents('.editor-panel').eq(0);
                panel.find('.preview-wrapper').css('display', 'none');
                panel.find('iframe').css('display', 'block');
                $('#Vids').attr('src', "");
            });
            var editor = self.createEditor(initCallback);
            resizeMainContentPanelHandler();
            tabs.find('.jqx-tabs-content-element').append(editor.panel);
        }
        
        function resizeMainContentPanelHandler() {
           var placeholder = $wrapper.find('#main-content-placeholder')
                   .parents('.jqx-widget').first();
           $contentPanel.css(placeholder.position());
           $contentPanel.width(placeholder.width());
        }
        
        self.initialize = function(initCallback) {
            // Initialize main content when jqxDockingLayout finished rendering
            $wrapper.on('create', function() {
                initMainContent(initCallback);
            });
            // Resize editor window on layout resize
            $wrapper.on('resize', resizeMainContentPanelHandler);
            // Resize editor window on window resize
            $(window).on('resize', resizeMainContentPanelHandler);
            // Initialize layout
            $wrapper.jqxDockingLayout({ 
                theme: 'office', 
                width: '100%', 
                layout: applicationLayout, 
                contextMenu: true 
            });
            // Initialize dialog
            $dialog.jqxWindow({ 
                isModal: true, 
                minHeight: '20%',
                height: '20%',
                maxHeight: '70%',
                minWidth: '30%', 
                maxWidth: '70%', 
                theme: 'office',
                autoOpen: false,
                cancelButton: $dialog.find('.cancel-btn'),
                okButton: $dialog.find('.ok-btn')
            });
            // Show editor handler
            $wrapper.on('click', '.show-editor', function() {
                $('.preview-wrapper').hide();
                $('.preview-wrapper').prev().resize().show();
            });
        };
        
        self.addContentTab = function(title, elmt) {
            var $title      = title + " " + newDocumentIndex++;
            var tabs = $contentPanel.find('#tabs');
            tabs.jqxTabs("addLast", $title, '');
            tabs.find('.jqx-tabs-content-element').last().append(elmt);
        };
        
        self.getContentTabs = function() {
            return $contentPanel.find('#tabs .editor-panel');
        };
        
        self.getContentTab = function(index) {
            var tabs = $contentPanel.find('#tabs');
            if(isNaN(index)) {
                return tabs.find('.editor-panel').last();
            } else {
                return tabs.find('.editor-panel').eq(index);
            }
        };
    
        self.getLeftTopPanel = function() {
            var layout = $wrapper.jqxDockingLayout('layout');
            return layout[0].items[0].items[0];
        };
        
        self.openDialog = function() {
            $dialog.jqxWindow('open');
        };
        
        self.closeDialog = function() {
            $dialog.jqxWindow('close');
        };
        
        self.createEditor = function(callback) {
            var $elmt = $('<div class="editor-panel"></div>');
            var editor = {
                panel: $elmt,
                iframe: {},
                preview: null,
                window: null,
                document: null,
                svgEditor: null,
                svgString: ""
            };
            // Programatically create iframe to make sure `onload` event triggered
            editor.iframe = document.createElement('iframe');
            editor.iframe.onload = function() {
                editor.window = editor.iframe.contentWindow;
                editor.document = editor.window.document;
                editor.svgEditor = editor.window.svgEditor;
                if(!editor.window.$ || !editor.window.svgEditor) {
                    return;
                }

                editor.window.$(editor.document).on('click', '#tool_preview', function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    $(editor.iframe).css('display', 'none');
                    var svg = $(editor.window.svgEditor.canvas.getContentElem()).clone(true);
                    svg.addClass('preview');
                    $(editor.iframe).next().find('.preview').replaceWith(svg);
                    $(editor.preview).css('display', 'block');
                });

                editor.preview.on('click', 'svg a', function(e){
                    e.preventDefault();
                    var element = editor.svgEditor.fid.drawing.getEquipmentByElement(e.target);
                    $(document).trigger('selectEquipment.editor.fid', element);
                });

                $('body').on('click', function(){
                    if(!editor.svgEditor) {
                        return;
                    }
                    // editor.svgEditor.canvas.clearSelection();
                    // Allow editor shortcuts
                    // editor.iframe.focus();
                });
                if(editor.svgString) {
                    editor.window.svgEditor.loadFromString(editor.svgString);
                }
                editor.window.onbeforeunload = function() {
                    editor.svgString = editor.window.svgEditor.canvas.getSvgString();
                };
                // Run callback after bridge ready
                editor.window.$(editor.document).on('bridgeReady.editor.fid', function(){
                    console.log('FID bridge ready');
                    // Trigger callback
                    if(typeof callback === 'function') {
                        callback(editor);
                    }
                });
            };
            editor.iframe.className = 'svg-editor';
            editor.iframe.src = 'editor/editor.html';
            editor.preview = $('<div class="preview-wrapper"><button type="button" class="editor-btn">Editor</button></div>');
            editor.preview.append('<svg class="preview"></svg>');
            editor.panel
                .append(editor.iframe)
                .append(editor.preview);

            return editor;
        };
        
        self.openEditor = function(callback) {
            var editor = this.createEditor(callback);
            self.addContentTab('New Document', editor.panel);
        };
        
        self.getEditor = function(index) {
            return self.getContentTab(index);
        };
        
        self.getSelectedContentTab = function() {
            var tabs = self.getContentTabs();
            return self.getContentTab(tabs.jqxTabs('val'));
        };
    }
    
    return Layout;
});
