// xoces/app/module-manager/collections/module_subjects.js

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
            var baseUrl = Utils.learning() + 'modules/';

            return this.options.parentId ? baseUrl + this.options.parentId + '/subjects/' : baseUrl;
        }
    });

    return Subjects;
});