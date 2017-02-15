// xoces/router.js

define(["app",
        "apps/navbar/navbar_controller",
        "apps/common/utilities",
        "csrf"],
    function(XocesManager, NavbarController,
             Utils, csrftoken){
  XocesManager.module("Routers.XocesApp", function(XocesAppRouter, XocesManager, Backbone, Marionette, $, _){
    XocesAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "": "initialize",
        "departments/": "manageDepartments",
        "subjects/": "manageSubjects",
        "modules/": "manageModules",
        "outcomes/": "manageObjectives"
      }
    });

    var executeAction = function(action, arg){
      XocesManager.startSubApp("XocesManager");
      action(arg);
    };

    var API = {
        initialize: function () {
        },
        manageDepartments: function () {
            XocesManager.trigger("departments:show");
        },
        manageModules: function () {
            XocesManager.trigger("modules:show");
        },
        manageObjectives: function () {
            XocesManager.trigger("outcomes:show");
        },
        manageSubjects: function () {
            XocesManager.trigger("subjects:show");
        }
    };

    XocesManager.on('content:hide', function () {
        XocesManager.regions.content.$el.addClass('hidden');
    });

    XocesManager.on('content:show', function () {
        XocesManager.regions.content.$el.removeClass('hidden');
    });

    XocesManager.on('departments:show', function () {
        require(["apps/generic-manager/generic_manager_controller"],
            function(GenericManagerController){
            GenericManagerController.showDepartments();
        });
    });

    XocesManager.on('modules:show', function () {
        require(["apps/generic-manager/generic_manager_controller"],
            function(GenericManagerController){
            GenericManagerController.showModules();
        });
    });

    XocesManager.on('outcomes:show', function () {
        require(["apps/generic-manager/generic_manager_controller"],
            function(GenericManagerController){
            GenericManagerController.showObjectives();
        });
    });

    XocesManager.on('subjects:show', function () {
        require(["apps/generic-manager/generic_manager_controller"],
            function(GenericManagerController){
            GenericManagerController.showSubjects();
        });
    });

    XocesManager.Routers.on("start", function(){
      new XocesAppRouter.Router({
        controller: API
      });

      NavbarController.renderNavbar();
    });
  });

  return XocesManager.XocesAppRouter;
});