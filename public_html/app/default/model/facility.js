/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['knockout', 'default/model/worksite', 'default/model/drawing'], function(ko) {
    function Facility() {
    }
    
    Facility.prototype = {
        name: ko.observable(""),
        worksite: ko.observable(),
        drawings: ko.observableArray()
    };
    
    return Facility;
});