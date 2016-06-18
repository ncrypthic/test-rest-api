/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['knockout', 'default/model/equipment', 'default/model/facility'], function(ko) {
    function Drawing(site) {
    }
    
    Drawing.prototype = {
        facility: ko.observable(null),
        number: ko.observable(""),
        title: ko.observable(""),
        equipments: ko.observableArray([])
    };
    
    return Drawing;
});