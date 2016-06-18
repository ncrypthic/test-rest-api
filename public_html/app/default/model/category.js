/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['knockout'], function(ko) {
    function Category() {
    }
    
    Category.prototype = {
        name: ko.observable("")
    };
    
    return Category;
});