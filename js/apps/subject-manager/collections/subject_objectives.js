// xoces/app/subject-manager/collections/subject_objectives.js

define(["backbone",
        "apps/common/utilities",
        "apps/objective-manager/models/objective"],
    function(Backbone, Utils, ObjectiveModel){

    var Objectives = Backbone.Collection.extend({
        initialize: function (options) {
            this.options = options;
        },
        model: ObjectiveModel,
        url: function () {
            var subjectBaseUrl = Utils.learning() + 'subjects/',
                objectiveBaseUrl = Utils.learning() + 'objectives/';

            return this.options.parentId ? subjectBaseUrl + this.options.parentId + '/objectives/' : objectiveBaseUrl;
        }
    });

    return Objectives;
});