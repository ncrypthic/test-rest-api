/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['knockout', 'default/model/facility'], function(ko) {
    function Worksite() {
    }
    
    Worksite.prototype = {
        name: ko.observable(""),
        facilities: ko.observableArray([])
    };
    
    return Worksite;
});