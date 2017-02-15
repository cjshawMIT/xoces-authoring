// xoces/app/bank-manager/collections/banks.js

define(["backbone",
        "apps/common/utilities",
        "apps/bank-manager/models/bank"],
    function(Backbone, Utils, BankModel){

    var Banks = Backbone.Collection.extend({
        model: BankModel,
        url: function () {
            return Utils.api() + 'learning/objectivebanks/';
        }
    });

    return Banks;
});