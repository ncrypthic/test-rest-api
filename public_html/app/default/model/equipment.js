/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['knockout', 'default/model/category', 'default/model/category'], function(ko) {
    function Equipment(drawing) {
    }
    
    Equipment.prototype = {
        name: ko.observable(""),
        number: ko.observable(""),
        category: ko.observable(null),
        drawing: ko.observable(null),
        properties: ko.observable({})
    };
    
    return Equipment;
});