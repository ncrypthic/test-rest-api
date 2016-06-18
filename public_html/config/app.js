;require.config({
    baseUrl: "app/",
    paths: {
        domReady: "../vendor/domReady/domReady",
        text: "../vendor/text/text",
        knockoutAmd: "../vendor/knockout-amd-helpers/build/knockout-amd-helpers.min",
        async: "../vendor/async/dist/async.min",
        jquery: "../vendor/jquery/dist/jquery.min",
        jqxCore: "../vendor/jqwidgets/jqwidgets/jqxcore",
        jqxButtons: "../vendor/jqwidgets/jqwidgets/jqxbuttons",
        jqxScrollBar: "../vendor/jqwidgets/jqwidgets/jqxscrollbar",
        jqxData: "../vendor/jqwidgets/jqwidgets/jqxdata",
        jqxMenu: "../vendor/jqwidgets/jqwidgets/jqxmenu",
        jqxTooltip: "../vendor/jqwidgets/jqwidgets/jqxtooltip",
        jqxListbox: "../vendor/jqwidgets/jqwidgets/jqxlistbox",
        jqxDropdownList: "../vendor/jqwidgets/jqwidgets/jqxdropdownlist",
        jqxNumberInput: "../vendor/jqwidgets/jqwidgets/jqxnumberinput",
        jqxRadioButton: "../vendor/jqwidgets/jqwidgets/jqxradiobutton",
        jqxInput: "../vendor/jqwidgets/jqwidgets/jqxinput",
        jqxRibbon: "../vendor/jqwidgets/jqwidgets/jqxribbon",
        jqxLayout: "../vendor/jqwidgets/jqwidgets/jqxlayout",
        jqxDockingLayout: "../vendor/jqwidgets/jqwidgets/jqxdockinglayout",
        jqxWindow: "../vendor/jqwidgets/jqwidgets/jqxwindow",
        jqxKnockout: "../vendor/jqwidgets/jqwidgets/jqxknockout",
        knockout: "../vendor/knockout/dist/knockout",
        sammy: "../vendor/sammy/lib/sammy",
        jqxTree: "../vendor/jqwidgets/jqwidgets/jqxtree",
        jqxSplitter: "../vendor/jqwidgets/jqwidgets/jqxsplitter",
        jqxPanel: "../vendor/jqwidgets/jqwidgets/jqxpanel",
        jqxExpander: "../vendor/jqwidgets/jqwidgets/jqxexpander",
        jqxCheckBox: "../vendor/jqwidgets/jqwidgets/jqxcheckbox",
        jqxAll: "../vendor/jqwidgets/jqwidgets/jqx-all"
    },
    shim: {
        knockout: { deps: ["jquery"] },
        knockoutAmd: { deps: ["knockout", "text"] },
        jquery: { export: "$" },
        jqxCore: { deps: ["jqxKnockout"], export: "$" },
        jqxButtons: { deps: ["jqxCore"], export: "$" },
        jqxScrollBar: { deps: ["jqxCore"], export: "$" },
        jqxData: { deps: ["jqxCore"], export: "$" },
        jqxMenu: { deps: ["jqxCore"], export: "$" },
        jqxTooltip: { deps: ["jqxCore"], export: "$" },
        jqxListbox: { deps: ["jqxCore"], export: "$" },
        jqxDropdownList: { deps: ["jqxCore"], export: "$" },
        jqxNumberInput: { deps: ["jqxCore"], export: "$" },
        jqxRadioButton: { deps: ["jqxCore"], export: "$" },
        jqxInput: { deps: ["jqxCore"], export: "$" },
        jqxRibbon: { deps: ["jqxCore"], export: "$" },
        jqxLayout: { deps: ["jqxCore"], export: "$" },
        jqxDockingLayout: { deps: ["jqxCore", "jqxLayout"], export: "$" },
        jqxWindow: { deps: ["jqxCore"], export: "$" },
        jqxKnockout: { deps: ["knockout"] },
        jqxExpander: {deps:["jqxCore"], export: "$"},
        jqxTree: {deps: ["jqxData","jqxExpander", "jqxListbox", "jqxScrollBar", "jqxButtons"], export: "$"},
        jqxSplitter: {deps: ["jqxCore"], export: "$"},
        jqxPanel: {deps: ["jqxCore"], export: "$"},
        jqxCheckBox: {deps: ["jqxCore"], export: "$"},
        jqxAll: {deps: ["jquery", "knockout"], export: "$"}
    }
});
(function(r) {
    var deps = [
        "knockout", "jquery", "domReady!", 'knockoutAmd'
    ];
    r(deps, function(ko) {
        window.ko = ko;
        r(["default/app"]);
    });
})(require);