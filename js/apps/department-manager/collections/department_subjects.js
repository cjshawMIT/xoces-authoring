// xoces/app/department-manager/collections/department_subjects.js

define(["backbone",
        "apps/common/utilities",
        "apps/subject-manager/models/subject"],
    function(Backbone, Utils, SubjectModel){

    var Subjects = Backbone.Collection.extend({
        initialize: function (options) {
            this.options = options;
        },
        model: SubjectModel,
        url: function () {
            var departmentBaseUrl = Utils.learning() + 'departments/',
                subjectBaseUrl = Utils.learning() + 'subjects/';

            return this.options.parentId ? departmentBaseUrl + this.options.parentId + '/subjects/' : subjectBaseUrl;
        }
    });

    return Subjects;
});