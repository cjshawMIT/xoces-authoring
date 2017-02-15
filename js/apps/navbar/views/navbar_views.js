// apps/navbar/views/navbar_views.js

define(["app",
        "apps/common/utilities",
        "text!apps/navbar/templates/navbar.html",
        "csrf",
        "cookies",
        "jquery-ui",
        "bootstrap"],
       function(XocesManager, Utils, NavbarTemplate, csrftoken, Cookies){
  XocesManager.module("NavbarApp.View", function(View, XocesManager, Backbone, Marionette, $, _){
    View.NavbarView = Marionette.ItemView.extend({
        template: function (serializedData) {
            var url = window.location.href,
                preselectedId = Utils.cookie('bankId'),
                active = '',
                bankName = 'Pick your -oces',
                hasDepartments = false,
                hasModules = false,
                hasOutcomes = false,
                hasSubjects = false,
                selectedBank, bankId;

            if (url.indexOf('#subjects') >= 0) {
                active = 'subjects';
            } else if (url.indexOf('#modules') >= 0) {
                active = 'modules';
            } else if (url.indexOf('#outcomes') >= 0) {
                active = 'outcomes';
            } else if (url.indexOf('#departments') >= 0) {
                active = 'departments';
            }

            if (preselectedId !== "-1") {
                try {
                    selectedBank = _.find(serializedData.items, {id: preselectedId});
                    bankName = selectedBank.displayName.text;
                    hasDepartments = selectedBank.hasDepartments;
                    hasModules = selectedBank.hasModules;
                    hasOutcomes = selectedBank.hasOutcomes;
                    hasSubjects = selectedBank.hasSubjects;
                    bankId = preselectedId;
                } catch (e) {
                    bankId = "-1";
                    bankName = "Pick your -oces";
                    hasDepartments = false;
                    hasModules = false;
                    hasOutcomes = false;
                    hasSubjects = false;
                }
            }

            return _.template(NavbarTemplate)({
                active: active,
                bankName: bankName,
                bankId: bankId,
                banks: serializedData.items,
                hasDepartments: hasDepartments,
                hasModules: hasModules,
                hasOutcomes: hasOutcomes,
                hasSubjects: hasSubjects
            });
        },
        onRender: function () {
        },
        updateActiveState: function ($e) {
            $('.xoces-navbar-btn.active').removeClass('active');
            $e.addClass('active');
        },
        events: {
            'click .bank-selector': 'setBankId',
            'click .manage-departments': 'manageDepartments',
            'click .manage-subjects': 'manageSubjects',
            'click .manage-modules': 'manageModules',
            'click .manage-objectives': 'manageObjectives'
        },
        manageDepartments: function (e) {
          XocesManager.navigate("departments/");
          XocesManager.trigger("departments:show");
          XocesManager.trigger("content:hide");
          this.updateActiveState($(e.currentTarget));
        },
        manageModules: function (e) {
          XocesManager.navigate("modules/");
          XocesManager.trigger("modules:show");
          XocesManager.trigger("content:hide");
          this.updateActiveState($(e.currentTarget));
        },
        manageObjectives: function (e) {
          XocesManager.navigate("outcomes/");
          XocesManager.trigger("outcomes:show");
          XocesManager.trigger("content:hide");
          this.updateActiveState($(e.currentTarget));
        },
        manageSubjects: function (e) {
          XocesManager.navigate("subjects/");
          XocesManager.trigger("subjects:show");
          XocesManager.trigger("content:hide");
          this.updateActiveState($(e.currentTarget));
        },
        setBankId: function (e) {
            var $e = $(e.currentTarget),
                bankMap = $e.data('obj'),
                bankId = bankMap.id,
                bankName = $e.data('obj').displayName.text;

            Cookies.set('bankId', bankId);
            Cookies.set('bankMap', bankMap);
            $('span.oces-label').text(' ' + bankName);

            // TODO: manage hide / unhide according to the
            // settings of the bank...make this a method
            $('.navbar-btn-wrapper').each(function () {
                var $t = $(this),
                    target = $t.data('target');

                if (Utils.showX(target)) {
                    $t.removeClass('hidden');
                } else {
                    $t.addClass('hidden');
                    $t.children('.xoces-navbar-btn.active')
                        .removeClass('active');
                }
            });

            this.tweakCustomNamesForNavbar(bankId);

            XocesManager.trigger("content:hide");
            // if there is an active navbar button, trigger click on it
            // otherwise clear out the content space
            if ($('.xoces-navbar-btn.active').length > 0) {
                var $btn = $('.xoces-navbar-btn.active').parent(),
                    btnType = $btn.data('target');

                XocesManager.navigate(btnType + "/");
                XocesManager.trigger(btnType + ":show");
            } else {
            }
        },
        tweakCustomNamesForNavbar: function (bankId) {
            if (bankId == 'mc3-objectivebank%3A2818%40MIT-OEIT') {
                $('.manage-modules').text('Manage Topics');
                $('.manage-subjects').text('Manage Domains');
            } else if (bankId == 'mc3-objectivebank%3A2819%40MIT-OEIT') {
                $('.manage-modules').text('Manage Topics');
                $('.manage-subjects').text('Manage Courses');
            } else {
                $('.manage-modules').text('Manage Modules');
                $('.manage-subjects').text('Manage Subjects');
            }
        }
    });
  });

  return XocesManager.NavbarApp.View;
});