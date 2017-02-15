// xoces/app/department-manager/models/department.js

define(["backbone", "apps/common/utilities"],
    function(Backbone, Utils){

    var Department = Backbone.Model.extend({
        url: function () {
            var baseUrl = Utils.learning() + 'departments/';
            return this.id ? baseUrl + this.id : baseUrl;
        }
    });
    return Department;
});