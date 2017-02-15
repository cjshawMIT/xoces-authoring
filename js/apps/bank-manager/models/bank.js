// xoces/app/bank-manager/models/bank.js

define(["backbone", "apps/common/utilities"],
    function(Backbone, Utils){

    var Bank = Backbone.Model.extend({
        url: function () {
            return this.id ? Utils.api() + 'learning/objectivebanks/' + this.id : Utils.api() + 'learning/banks/';
        }
    });
    return Bank;
});