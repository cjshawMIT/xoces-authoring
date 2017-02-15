// xoces/app/subject-manager/collections/subject_modules.js

define(["backbone",
        "apps/common/utilities",
        "apps/module-manager/models/module"],
    function(Backbone, Utils, ModuleModel){

    var Modules = Backbone.Collection.extend({
        initialize: function (options) {
            this.options = options;
        },
        model: ModuleModel,
        url: function () {
            var subjectBaseUrl = Utils.learning() + 'subjects/',
                moduleBaseUrl = Utils.learning() + 'modules/';

            return this.options.subjectId ? subjectBaseUrl + this.options.subjectId + '/modules/' : moduleBaseUrl;
        }
    });

    return Modules;
});