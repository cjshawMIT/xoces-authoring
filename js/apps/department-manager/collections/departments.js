// xoces/app/department-manager/collections/departments.js

define(["backbone",
        "apps/common/utilities",
        "apps/department-manager/models/department"],
    function(Backbone, Utils, DepartmentModel){

    var Departments = Backbone.Collection.extend({
        model: DepartmentModel,
        url: function () {
            var baseUrl = Utils.learning() + 'departments/';
            return baseUrl;
        }
    });

    return Departments;
});