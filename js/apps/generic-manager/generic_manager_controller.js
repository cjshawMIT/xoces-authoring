// xoces/js/apps/generic-manager/generic_manager_controller.js

define(["app",
        "apps/common/utilities",
        "apps/generic-manager/views/generic_manager_views",
        "apps/subject-manager/collections/subjects",
        "apps/subject-manager/models/subject",
        "apps/subject-manager/collections/subject_modules",
        "apps/subject-manager/collections/subject_objectives",
        "apps/module-manager/collections/modules",
        "apps/module-manager/models/module",
        "apps/module-manager/collections/module_objectives",
        "apps/module-manager/collections/module_subjects",
        "apps/objective-manager/collections/objectives",
        "apps/objective-manager/models/objective",
        "apps/objective-manager/collections/objective_modules",
        "apps/objective-manager/collections/objective_prerequisites",
        "apps/objective-manager/collections/objective_subjects",
        "apps/department-manager/collections/departments",
        "apps/department-manager/models/department",
        "apps/department-manager/collections/department_subjects"],
    function(XocesManager, Utils, GenericViews, SubjectsCollection,
             SubjectModel, SubjectModuleCollection, SubjectObjectiveCollection,
             ModulesCollection,
             ModuleModel, ModuleObjectiveCollection, ModuleSubjectCollection,
             ObjectivesCollection,
             ObjectiveModel, ObjectiveModuleCollection,
             ObjectivePrerequisiteCollection, ObjectiveSubjectCollection,
             DepartmentsCollection, DepartmentModel, DepartmentSubjectCollection){
  XocesManager.module("XocesApp.Generic", function(Generic, XocesManager, Backbone, Marionette, $, _){
    Generic.Controller = {
      showDepartments: function () {
        var departments = new DepartmentsCollection([]),
            context = {
            parentName: 'department',
            parentModel: DepartmentModel,
            parentTitle: 'Department',
            collection: departments,
            hasChildren: true
        },
        departmentsView, departmentsPromise;

        if (Utils.showX('subjects')) {  // should always be True if has departments
            context.childName = 'subject';
            context.childModel = SubjectModel;
            context.childrenCollection = DepartmentSubjectCollection;
            context.allChildrenCollection = SubjectsCollection;
            context.childTitle = 'Subjects';
            context.hasGrandchildren = true;
            context.grandchildName = 'module';
            context.grandchildModel = ModuleModel;
            context.grandchildrenCollection = SubjectModuleCollection;
            context.allGrandchildrenCollection = ModulesCollection;
            context.grandchildrenTitle = 'Modules';
            context.hasGreatgrandchildren = true;
            context.greatgrandchildName = 'outcome';
            context.greatgrandchildModel = ObjectiveModel;
            context.greatgrandchildrenCollection = ModuleObjectiveCollection;
            context.allGreatgrandchildrenCollection = ObjectivesCollection;
            context.greatgrandchildrenTitle = 'Outcomes';
        } else {
            context.childName = 'outcome';
            context.childModel = ObjectiveModel;
            context.childrenCollection = SubjectModuleCollection;
            context.allChildrenCollection = ObjectivesCollection;
            context.childTitle = 'Outcomes';
            context.hasGrandchildren = true;
            context.grandchildName = 'prerequisite';
            context.grandchildModel = ObjectiveModel;
            context.grandchildrenCollection = ObjectivePrerequisiteCollection;
            context.allGrandchildrenCollection = ObjectivesCollection;
            context.grandchildrenTitle = 'Prerequisites';
            context.hasGreatgrandchildren = false;
        }

        departmentsView = new GenericViews.ManagerView(context);
        departmentsPromise = departmentsView.collection.fetch();

        departmentsPromise.done(function (data) {
            XocesManager.trigger("content:show");
            XocesManager.regions.content.show(departmentsView);
        });
      },
      showModules: function () {
        var modules = new ModulesCollection([]),
            context = {
            parentName: 'module',
            parentModel: ModuleModel,
            parentTitle: 'Module',
            collection: modules,
            hasChildren: true
        },
        modulesView, modulesPromise;

        if (Utils.showX('outcomes')) {
            context.childName = 'outcome';
            context.childModel = ObjectiveModel;
            context.childrenCollection = ModuleObjectiveCollection;
            context.allChildrenCollection = ObjectivesCollection;
            context.childTitle = 'Outcomes';
            context.hasGrandchildren = true;
            context.grandchildName = 'prerequisite';
            context.grandchildModel = ObjectiveModel;
            context.grandchildrenCollection = ObjectivePrerequisiteCollection;
            context.allGrandchildrenCollection = ObjectivesCollection;
            context.grandchildrenTitle = 'Prerequisites';
            context.hasGreatgrandchildren = false;
            context.hasGrandparents = false;
            context.hasGreatgrandparents = false;

            if (Utils.showX('subjects')) {
                context.hasGrandparents = true;
                context.grandparentName = 'subject';
                context.grandparentModel = SubjectModel;
                context.grandparentCollection = ModuleSubjectCollection;
                context.grandparentReverseCollection = SubjectModuleCollection;
                context.allGrandparentsCollection = SubjectsCollection;
                context.grandparentTitle = 'Subjects';
            }
        } else {
            context.hasChildren = false;
            context.hasGrandchildren = false;
            context.hasGreatgrandchildren = false;
        }

        if (Utils.activeBankId() === 'mc3-objectivebank%3A2818%40MIT-OEIT') {
            context.parentName = 'topic';
            context.parentTitle = 'Topics';
            context.grandparentName = 'domain';
            context.grandparentTitle = 'Domains';
            context.hasGreatgrandchildren = true;
            context.greatgrandchildName = 'suboutcome';
            context.greatgrandchildModel = ObjectiveModel;
            context.greatgrandchildrenCollection = ModuleObjectiveCollection;
            context.allGreatgrandchildrenCollection = ObjectivesCollection;
            context.greatgrandchildrenTitle = 'Suboutcomes';
        } else if (Utils.activeBankId() === 'mc3-objectivebank%3A2819%40MIT-OEIT') {
            context.parentName = 'topic';
            context.parentTitle = 'Topics';
            context.grandparentName = 'course';
            context.grandparentTitle = 'Courses';
        }

        modulesView = new GenericViews.ManagerView(context);
        modulesPromise = modulesView.collection.fetch();

        modulesPromise.done(function (data) {
            XocesManager.trigger("content:show");
            XocesManager.regions.content.show(modulesView);
        });
      },
      showObjectives: function () {
        var objectives = new ObjectivesCollection([]),
            context = {
            parentName: 'outcome',
            parentModel: ObjectiveModel,
            parentTitle: 'Outcome',
            collection: objectives,
            hasChildren: true
        },
        objectivesView, objectivesPromise;

        if (true) {  // always show prerequisites
            context.childName = 'prerequisite';
            context.childModel = ObjectiveModel;
            context.childrenCollection = ObjectivePrerequisiteCollection;
            context.allChildrenCollection = ObjectivesCollection;
            context.childTitle = 'Prerequisites';
            context.hasGrandchildren = false;
            context.hasGreatgrandchildren = false;
            context.hasGreatgrandparents = false;
            context.hasGrandparents = true;

            if (Utils.showX('modules')) {
                context.grandparentName = 'module';
                context.grandparentModel = ModuleModel;
                context.grandparentCollection = ObjectiveModuleCollection;
                context.grandparentReverseCollection = ModuleObjectiveCollection;
                context.allGrandparentsCollection = ModulesCollection;
                context.grandparentTitle = 'Modules';
                if (Utils.showX('subjects')) {
                    context.hasGreatgrandparents = true;
                    context.greatgrandparentName = 'subject';
                    context.greatgrandparentModel = SubjectModel;
                    context.greatgrandparentCollection = ModuleSubjectCollection;
                    context.greatgrandparentReverseCollection = SubjectModuleCollection;
                    context.allGreatgrandparentsCollection = SubjectsCollection;
                    context.greatgrandparentTitle = 'Subjects';
                }
            } else if (Utils.showX('subjects')) {
                context.grandparentName = 'subject';
                context.grandparentModel = SubjectModel;
                context.grandparentCollection = ObjectiveSubjectCollection;
                context.grandparentReverseCollection = SubjectObjectiveCollection;
                context.allGrandparentsCollection = SubjectsCollection;
                context.grandparentTitle = 'Subjects';
            }
        } else {
            context.childName = 'prerequisite';
            context.childModel = ObjectiveModel;
            context.childrenCollection = ObjectivePrerequisiteCollection;
            context.allChildrenCollection = ObjectivesCollection;
            context.childTitle = 'Prerequisites';
            context.hasGrandchildren = false;
            context.hasGreatgrandchildren = false;
        }

        if (Utils.activeBankId() === 'mc3-objectivebank%3A2818%40MIT-OEIT') {
            context.grandparentName = 'topic';
            context.grandparentTitle = 'Topics';
            context.greatgrandparentName = 'domain';
            context.greatgrandparentTitle = 'Domains';
        } else if (Utils.activeBankId() === 'mc3-objectivebank%3A2819%40MIT-OEIT') {
            context.grandparentName = 'topic';
            context.grandparentTitle = 'Topics';
            context.greatgrandparentName = 'course';
            context.greatgrandparentTitle = 'Courses';
        }

        objectivesView = new GenericViews.ManagerView(context);
        objectivesPromise = objectivesView.collection.fetch();

        objectivesPromise.done(function (data) {
            XocesManager.trigger("content:show");
            XocesManager.regions.content.show(objectivesView);
        });
      },
      showSubjects: function () {
        var subjects = new SubjectsCollection([]),
            context = {
            parentName: 'subject',
            parentModel: SubjectModel,
            parentTitle: 'Subject',
            collection: subjects,
            hasChildren: true
        },
        subjectsView, subjectsPromise;

        if (Utils.showX('modules')) {
            context.childName = 'module';
            context.childModel = ModuleModel;
            context.childrenCollection = SubjectModuleCollection;
            context.allChildrenCollection = ModulesCollection;
            context.childTitle = 'Modules';
            context.hasGrandchildren = true;
            context.grandchildName = 'outcome';
            context.grandchildModel = ObjectiveModel;
            context.grandchildrenCollection = ModuleObjectiveCollection;
            context.allGrandchildrenCollection = ObjectivesCollection;
            context.grandchildrenTitle = 'Outcomes';
            context.hasGreatgrandchildren = true;
            context.greatgrandchildName = 'prerequisite';
            context.greatgrandchildModel = ObjectiveModel;
            context.greatgrandchildrenCollection = ObjectivePrerequisiteCollection;
            context.allGreatgrandchildrenCollection = ObjectivesCollection;
            context.greatgrandchildrenTitle = 'Prerequisites';
        } else {
            context.childName = 'outcome';
            context.childModel = ObjectiveModel;
            context.childrenCollection = SubjectObjectiveCollection;
            context.allChildrenCollection = ObjectivesCollection;
            context.childTitle = 'Outcomes';
            context.hasGrandchildren = true;
            context.grandchildName = 'prerequisite';
            context.grandchildModel = ObjectiveModel;
            context.grandchildrenCollection = ObjectivePrerequisiteCollection;
            context.allGrandchildrenCollection = ObjectivesCollection;
            context.grandchildrenTitle = 'Prerequisites';
            context.hasGreatgrandchildren = false;
        }

        if (Utils.activeBankId() === 'mc3-objectivebank%3A2818%40MIT-OEIT') {
            context.parentName = 'domain';
            context.parentTitle = 'Domains';
            context.childName = 'topic';
            context.childTitle = 'Topics';
        } else if (Utils.activeBankId() === 'mc3-objectivebank%3A2819%40MIT-OEIT') {
            context.childName = 'topic';
            context.childTitle = 'Topics';
            context.parentName = 'course';
            context.parentTitle = 'Courses';
        }

        subjectsView = new GenericViews.ManagerView(context);
        subjectsPromise = subjectsView.collection.fetch();

        subjectsPromise.done(function (data) {
            XocesManager.trigger("content:show");
            XocesManager.regions.content.show(subjectsView);
        });
      }
    }
  });

  return XocesManager.XocesApp.Generic.Controller;
});