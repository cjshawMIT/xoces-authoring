// xoces/apps/generic-manager/generic_manager_views.js

define(["app",
        "apps/common/utilities",
        "apps/common/views/common_views",
        "text!apps/generic-manager/templates/generic_manager.html",
        "text!apps/generic-manager/templates/object_list.html",
        "text!apps/generic-manager/templates/object.html",
        "text!apps/common/templates/add_object.html",
        "text!apps/common/templates/edit_object.html",
        "text!apps/common/templates/delete_dialog.html",
        "text!apps/common/templates/delink_dialog.html",
        "text!apps/common/templates/none_found.html",
        "jquery-select2"],
       function(XocesManager, Utils, CommonViews,
                GenericTemplate, ObjectListTemplate, ObjectTemplate,
                AddObjectTemplate, EditObjectTemplate, DeleteTemplate, DelinkTemplate,
                NoneFoundTemplate){

       function selectText (text) {
           if (text[0] == 'o') {
               return 'Please select an ' + text + '...';
           } else {
               return 'Please select a ' + text + '...';
           }
       }

  XocesManager.module("XocesApp.Generic.View", function(View, XocesManager, Backbone, Marionette, $, _) {
      View.ManagerView = Marionette.ItemView.extend({
          initialize: function (options) {
              this.options = options;
          },
          serializeData: function () {
              return {
                  context: this.options,
                  items: this.collection.toJSON()
              };
          },
          template: function (serializedData) {
              var context = serializedData.context;
              return _.template(GenericTemplate)({
                  context: context,
                  parents: serializedData.items
              });
          },
          onShow: function () {
              var context = this.options;

              $('.parent-selector').select2({
                  width: 'element',
                  placeholder: selectText(context.parentName)
              });

              if (context.hasChildren) {
                  XocesManager.regions.addRegion('children', '#parent-child-region');
              }

              if (context.hasGrandchildren) {
                  XocesManager.regions.addRegion('grandchildren', '#child-grandchild-region');
              }

              if (context.hasGreatgrandchildren) {
                  XocesManager.regions.addRegion('greatgrandchildren', '#grandchild-greatgrandchild-region');
              }

              if (context.hasGreatgrandparents) {
                  XocesManager.regions.addRegion('greatgrandparents', '#grandparent-greatgrandparent-region');
              }

              if (context.hasGrandparents) {
                  XocesManager.regions.addRegion('grandparents', '#parent-grandparent-region');
              }
          },
          resetGrandchildRegion: function () {
              var context = this.options;

              if (context.hasGrandchildren) {
                  XocesManager.regions.grandchildren.reset();
                  $('.link-grandchildren-wrapper').addClass('hidden');
              }
          },
          resetGreatgrandchildRegion: function () {
              var context = this.options;

              if (context.hasGreatgrandchildren) {
                  XocesManager.regions.greatgrandchildren.reset();
                  $('.link-greatgrandchildren-wrapper').addClass('hidden');
              }
          },
          resetGrandparentRegion: function () {
              var context = this.options;

              if (context.hasGrandparents) {
                  XocesManager.regions.grandparents.reset();
                  $('.link-grandparent-wrapper').addClass('hidden');
              }
          },
          resetGreatgrandparentRegion: function () {
              var context = this.options;

              if (context.hasGreatgrandparents) {
                  XocesManager.regions.greatgrandparents.reset();
                  $('.link-greatgrandparent-wrapper').addClass('hidden');
              }
          },
          events: {
              'change .parent-selector': 'selectParent',
              'click .add-parent-btn': 'addParent',
              'click .delete-parent': 'deleteParent',
              'click .edit-parent': 'editParent',
              'click .link-child': 'linkChild',
              'click .link-grandchild': 'linkGrandchild',
              'click .link-grandparent': 'linkGrandparent',
              'click .link-greatgrandchild': 'linkGreatgrandchild',
              'click .link-greatgrandparent': 'linkGreatgrandparent',
              'click .child': 'showGrandchildren',
              'click .grandchild': 'showGreatgrandchildren',
              'click .grandparent': 'showGreatgrandparents',
              'click .remove-child': 'unlinkChild',
              'click .remove-grandchild': 'unlinkGrandchild',
              'click .remove-grandparent': 'unlinkGrandparent',
              'click .remove-greatgrandchild': 'unlinkGreatgrandchild',
              'click .remove-greatgrandparent': 'unlinkGreatgrandparent'
          },
          addParent: function (e) {
              var _this = this,
                  context = this.options;

              XocesManager.regions.dialog.show(new View.AddParentView());
              XocesManager.regions.dialog.$el.dialog({
                  modal: true,
                  width: 600,
                  height: 500,
                  title: 'Create a new ' + context.parentName,
                  buttons: [
                      {
                          text: "Cancel",
                          class: 'btn btn-danger',
                          click: function () {
                              $(this).dialog("close");
                          }
                      },
                      {
                          text: "Create",
                          class: 'btn btn-success',
                          click: function () {
                              var parent = new context.parentModel(),
                                  name = $('input[name="displayName"]').val(),
                                  desc = $('textarea.object-description').val(),
                                  _thisDialog = this;

                              parent.set('displayName', name);
                              parent.set('description', desc);
                              $(_thisDialog).dialog("close");
                              parent.save()
                                  .success(function (model, response, options) {
                                      var $s = $('select.parent-selector'),
                                          parent = $.parseJSON(options.responseText);

                                      _this.showParentDetails(parent);

                                      $s.children('option:selected').prop('selected', false);
                                      $s.append('<option selected value="' + parent.id + '">' + parent.displayName.text + '</option>');
                                      $s.trigger('change');

                                      _this.resetGrandchildRegion();
                                      _this.resetGreatgrandchildRegion();

                                  }).error(function (model, xhr, options) {
                                      Utils.updateStatus('Server error: ' + model.responseText);
                                  }).always(function () {
                                  });
                            }
                        }
                    ]
              });
          },
          deleteParent: function (e) {
              var id = $('select[name="parent-selection"]').val(),
                  context = this.options;

              XocesManager.regions.dialog.show(new View.DeleteParentView(context));
              XocesManager.regions.dialog.$el.dialog({
                  modal: true,
                  width: 600,
                  height: 500,
                  title: 'Delete ' + context.parentName,
                  buttons: [
                      {
                          text: "Cancel",
                          class: 'btn btn-danger',
                          click: function () {
                              $(this).dialog("close");
                          }
                      },
                      {
                          text: "Delete",
                          class: 'btn btn-success',
                          click: function () {
                              var parent = new context.parentModel({id: id}),
                                  _thisDialog = this;

                              $(_thisDialog).dialog("close");
                              parent.destroy()
                                  .success(function (model, response, options) {
                                      var $s = $('select.parent-selector'),
                                          $details = $('.parent-details'),
                                          $children = $('.parent-children');

                                      $s.children('option[value="' + id + '"]').remove();
                                      $s.select2({
                                          width: 'element',
                                          placeholder: selectText(context.parentName)
                                      });

                                      $details.addClass('hidden');
                                      $children.addClass('hidden');
                                  }).error(function (model, xhr, options) {
                                      Utils.updateStatus('Server error: ' + model.responseText);
                                  }).always(function () {

                                  });
                            }
                        }
                    ]
              });
          },
          editParent: function (e) {
              var id = $('select[name="parent-selection"]').val(),
                  name = $('.parent-details .display-name span').text(),
                  desc = $('.parent-details .description span').text(),
                  _this = this,
                  context = this.options;

              XocesManager.regions.dialog.show(new View.EditParentView({
                  displayName: name,
                  description: desc
              }));
              XocesManager.regions.dialog.$el.dialog({
                  modal: true,
                  width: 600,
                  height: 500,
                  title: 'Edit ' + context.parentName,
                  buttons: [
                      {
                          text: "Cancel",
                          class: 'btn btn-danger',
                          click: function () {
                              $(this).dialog("close");
                          }
                      },
                      {
                          text: "Save",
                          class: 'btn btn-success',
                          click: function () {
                              var parent = new context.parentModel({id: id}),
                                  name = $('input[name="displayName"]').val(),
                                  desc = $('textarea.object-description').val(),
                                  _thisDialog = this;

                              parent.set('displayName', name);
                              parent.set('description', desc);

                              $(_thisDialog).dialog("close");
                              parent.save()
                                  .success(function (model, response, options) {
                                      var $s = $('select.parent-selector'),
                                          $details = $('.parent-details'),
                                          $children = $('.parent-children'),
                                          parent = $.parseJSON(options.responseText);

                                      $s.children('option:selected')
                                          .prop('selected', false);
                                      $s.children('option[value="' + id + '"]')
                                          .text(name)
                                          .prop('selected', true);
                                      $s.trigger('change');
                                      _this.showParentDetails(parent);
                                  }).error(function (model, xhr, options) {
                                      Utils.updateStatus('Server error: ' + model.responseText);
                                  }).always(function () {
                                  });
                            }
                        }
                    ]
              });
          },
          getGrandparentParents: function (grandparentId, _callback) {
              var context = this.options,
                  grandparentParents = new context.grandparentReverseCollection(
                        {parentId: grandparentId}),
                  grandparentPromise = grandparentParents.fetch(),
                  currentParentIds = [],
                  _this = this;

              grandparentPromise.done(function (data) {
                  currentParentIds = _.pluck(data, 'id');
                  _callback(currentParentIds);
              });
          },
          getGreatgrandparentGrandparents: function (greatgrandparentId, _callback) {
              var context = this.options,
                  greatgrandparentGrandparents = new context.greatgrandparentReverseCollection(
                        {parentId: greatgrandparentId}),
                  greatgrandparentPromise = greatgrandparentGrandparents.fetch(),
                  currentGrandparentIds = [],
                  _this = this;

              greatgrandparentPromise.done(function (data) {
                  currentGrandparentIds = _.pluck(data, 'id');
                  _callback(currentGrandparentIds);
              });
          },
          linkChild: function (e) {
            var context = this.options,
                children = new context.allChildrenCollection([]),
                childrenView = new CommonViews.LinkView({
                    collection: children,
                    targetName: context.childName
                }),
                childrenPromise = childrenView.collection.fetch(),
                _this = this;

            childrenPromise.done(function (data) {
                XocesManager.regions.dialog.show(childrenView);
                XocesManager.regions.dialog.$el.dialog({
                    modal: true,
                    width: 600,
                    height: 500,
                    title: 'Link ' + context.parentName + ' to ' + context.childName,
                    buttons: [
                        {
                            text: "Cancel",
                            class: 'btn btn-danger',
                            click: function () {
                                $(this).dialog("close");
                            }
                        },
                        {
                            text: "Link",
                            class: 'btn btn-success',
                            click: function () {
                                var newChild = $('.item-selector option:selected').data('raw-obj'),
                                    $t = $('ul.children-content'),
                                    _thisDialog = this;

                                $t.append(_.template(ObjectTemplate)({
                                    object: newChild,
                                    objectName: context.childName,
                                    objectStr: JSON.stringify(newChild),
                                    objectType: 'child'
                                }));

                                $t.children('li.none-found').addClass('hidden');

                                Utils.processing();
                                $(_thisDialog).dialog("close");
                                _this.updateChildren(function () {
                                    Utils.doneProcessing();
                                });
                            }
                        }
                    ]
                });
            });
          },
          linkGrandchild: function (e) {
                var context = this.options,
                    $child = $('li.child.active'),
                    child = $child.data('raw-obj'),
                    grandchildren = new context.allGrandchildrenCollection([]),
                    grandchildrenView = new CommonViews.LinkView({
                        collection: grandchildren,
                        targetName: context.grandchildName
                    }),
                    grandchildrenPromise = grandchildrenView.collection.fetch(),
                    _this = this;

                grandchildrenPromise.done(function (data) {
                    XocesManager.regions.dialog.show(grandchildrenView);
                    XocesManager.regions.dialog.$el.dialog({
                        modal: true,
                        width: 600,
                        height: 500,
                        title: 'Link ' + context.childName + ' to ' + context.grandchildName,
                        buttons: [
                            {
                                text: "Cancel",
                                class: 'btn btn-danger',
                                click: function () {
                                    $(this).dialog("close");
                                }
                            },
                            {
                                text: "Link",
                                class: 'btn btn-success',
                                click: function () {
                                    var newGrandchild = $('.item-selector option:selected').data('raw-obj'),
                                        $t = $('ul.grandchildren-content'),
                                        _thisDialog = this;

                                    $t.append(_.template(ObjectTemplate)({
                                        object: newGrandchild,
                                        objectName: context.grandchildName,
                                        objectStr: JSON.stringify(newGrandchild),
                                        objectType: 'grandchild'
                                    }));

                                    $t.children('li.none-found').addClass('hidden');
                                    $(_thisDialog).dialog("close");
                                    Utils.processing();
                                    _this.updateGrandchildren(function () {
                                        Utils.doneProcessing();
                                    });
                                }
                            }
                        ]
                    });
                });
          },
          linkGrandparent: function (e) {
            var context = this.options,
            grandparents = new context.allGrandparentsCollection([]),
            grandparentsView = new CommonViews.LinkView({
                collection: grandparents,
                targetName: context.grandparentName
            }),
            grandparentsPromise = grandparentsView.collection.fetch(),
            _this = this;

            grandparentsPromise.done(function (data) {
                XocesManager.regions.dialog.show(grandparentsView);
                XocesManager.regions.dialog.$el.dialog({
                    modal: true,
                    width: 600,
                    height: 500,
                    title: 'Link ' + context.parentName + ' to ' + context.grandparentName,
                    buttons: [
                        {
                            text: "Cancel",
                            class: 'btn btn-danger',
                            click: function () {
                                $(this).dialog("close");
                            }
                        },
                        {
                            text: "Link",
                            class: 'btn btn-success',
                            click: function () {
                                var newGrandparent = $('.item-selector option:selected').data('raw-obj'),
                                    $t = $('ul.grandparents-content'),
                                    _thisDialog = this;

                                $t.append(_.template(ObjectTemplate)({
                                    object: newGrandparent,
                                    objectName: context.grandparentName,
                                    objectStr: JSON.stringify(newGrandparent),
                                    objectType: 'grandparent'
                                }));

                                $t.children('li.none-found').addClass('hidden');

                                Utils.processing();
                                $(_thisDialog).dialog("close");
                                _this.updateGrandparents(function () {
                                });
                            }
                        }
                    ]
                });
            });
          },
          linkGreatgrandchild: function (e) {
                var context = this.options,
                    $grandchild = $('li.grandchild.active'),
                    grandchild = $grandchild.data('raw-obj'),
                    greatgrandchildren = new context.allGreatgrandchildrenCollection([]),
                    greatgrandchildrenView = new CommonViews.LinkView({
                        collection: greatgrandchildren,
                        targetName: context.greatgrandchildName
                    }),
                    greatgrandchildrenPromise = greatgrandchildrenView.collection.fetch(),
                    _this = this;

                greatgrandchildrenPromise.done(function (data) {
                    XocesManager.regions.dialog.show(greatgrandchildrenView);
                    XocesManager.regions.dialog.$el.dialog({
                        modal: true,
                        width: 600,
                        height: 500,
                        title: 'Link ' + context.grandchildName + ' to ' + context.greatgrandchildName,
                        buttons: [
                            {
                                text: "Cancel",
                                class: 'btn btn-danger',
                                click: function () {
                                    $(this).dialog("close");
                                }
                            },
                            {
                                text: "Link",
                                class: 'btn btn-success',
                                click: function () {
                                    var newGreatgrandchild = $('.item-selector option:selected').data('raw-obj'),
                                        $t = $('ul.greatgrandchildren-content'),
                                        _thisDialog = this;

                                    $t.append(_.template(ObjectTemplate)({
                                        object: newGreatgrandchild,
                                        objectName: context.greatgrandchildName,
                                        objectStr: JSON.stringify(newGreatgrandchild),
                                        objectType: 'greatgrandchild'
                                    }));

                                    $t.children('li.none-found').addClass('hidden');
                                    $(_thisDialog).dialog("close");
                                    Utils.processing();
                                    _this.updateGreatgrandchildren(function () {
                                        Utils.doneProcessing();
                                    });
                                }
                            }
                        ]
                    });
                });
          },
          linkGreatgrandparent: function (e) {
                var context = this.options,
                    $grandparent = $('li.grandparent.active'),
                    grandparent = $grandparent.data('raw-obj'),
                    greatgrandparents = new context.allGreatgrandparentsCollection([]),
                    greatgrandparentsView = new CommonViews.LinkView({
                        collection: greatgrandparents,
                        targetName: context.greatgrandparentName
                    }),
                    greatgrandparentsPromise = greatgrandparentsView.collection.fetch(),
                    _this = this;

                greatgrandparentsPromise.done(function (data) {
                    XocesManager.regions.dialog.show(greatgrandparentsView);
                    XocesManager.regions.dialog.$el.dialog({
                        modal: true,
                        width: 600,
                        height: 500,
                        title: 'Link ' + context.grandparentName + ' to ' + context.greatgrandparentName,
                        buttons: [
                            {
                                text: "Cancel",
                                class: 'btn btn-danger',
                                click: function () {
                                    $(this).dialog("close");
                                }
                            },
                            {
                                text: "Link",
                                class: 'btn btn-success',
                                click: function () {
                                    var newGreatgrandparent = $('.item-selector option:selected').data('raw-obj'),
                                        $t = $('ul.greatgrandparents-content'),
                                        _thisDialog = this;

                                    $t.append(_.template(ObjectTemplate)({
                                        object: newGreatgrandparent,
                                        objectName: context.greatgrandparentName,
                                        objectStr: JSON.stringify(newGreatgrandparent),
                                        objectType: 'greatgrandparent'
                                    }));

                                    $t.children('li.none-found').addClass('hidden');
                                    $(_thisDialog).dialog("close");
                                    Utils.processing();
                                    _this.updateGreatgrandparents(newGreatgrandparent.id, function () {

                                    });
                                }
                            }
                        ]
                    });
                });
          },
          saveGrandparentModel: function (grandparentId, childIds, _callback) {
              var context = this.options,
                  $grandparents = $('ul.grandparents-content').children('li:not(.none-found)'),
                  grandparentModel = new context.grandparentModel({id: grandparentId});

                  grandparentModel.set('childIds', childIds);
                  grandparentModel.save()
                      .success(function (model, response, options) {
                          console.log('done');
                      }).error(function (model, xhr, options) {
                          Utils.updateStatus('Server error: ' + model.responseText);
                          $grandparents.last().remove();
                      }).always(function () {
                          _callback();
                      });
          },
          saveGreatgrandparentModel: function (greatgrandparentId, grandparentIds, _callback) {
              var context = this.options,
                  $greatgrandparents = $('ul.greatgrandparents-content').children('li:not(.none-found)'),
                  greatgrandparentModel = new context.greatgrandparentModel({id: greatgrandparentId});

                  greatgrandparentModel.set('childIds', grandparentIds);
                  greatgrandparentModel.save()
                      .success(function (model, response, options) {
                          console.log('done');
                      }).error(function (model, xhr, options) {
                          Utils.updateStatus('Server error: ' + model.responseText);
                          $greatgrandparents.last().remove();
                      }).always(function () {
                          _callback();
                      });
          },
          selectParent: function (e) {
              var context = this.options,
                  $e = $(e.currentTarget),
                  parent = new context.parentModel({id: $e.val()}),
                  parentPromise = parent.fetch(),
                  _this = this;

              parentPromise.done(function (data) {
                  _this.showParentDetails(data);
              });
          },
          showGrandchildren: function (e) {
              var context = this.options,
                  _this = this;

              if (context.hasGrandchildren) {
                  var $child = $(e.currentTarget),
                      child = $child.data('raw-obj'),
                      grandchildren = new context.grandchildrenCollection({parentId: child.id}),// parentId is parent of the grandchild...i.e. the child
                      grandchildViewContext = {
                          collection: grandchildren,
                          objectName: context.grandchildName,
                          objectType: 'grandchildren',
                          objectTypeSingular: 'grandchild'
                      },
                      grandchildrenView = new View.ChildrenView(grandchildViewContext),
                      grandchildrenPromise = grandchildrenView.collection.fetch();

                  $('li.child.active').removeClass('active');
                  $child.addClass('active');

                  Utils.processing();

                  _this.resetGreatgrandchildRegion();

                  grandchildrenPromise.done(function (data) {
                      XocesManager.regions.grandchildren.show(grandchildrenView);
                      $('.grandchildren .link-wrapper').removeClass('hidden');
                      Utils.doneProcessing();
                  });
              }
          },
          showGreatgrandchildren: function (e) {
              var context = this.options;

              if (context.hasGreatgrandchildren) {
                  var $grandchild = $(e.currentTarget),
                      grandchild = $grandchild.data('raw-obj'),
                      greatgrandchildren = new context.greatgrandchildrenCollection({parentId: grandchild.id}),// parentId is parent of the grandchild...i.e. the child
                      greatgrandchildViewContext = {
                          collection: greatgrandchildren,
                          objectName: context.greatgrandchildName,
                          objectType: 'greatgrandchildren',
                          objectTypeSingular: 'greatgrandchild'
                      },
                      greatgrandchildrenView = new View.ChildrenView(greatgrandchildViewContext),
                      greatgrandchildrenPromise = greatgrandchildrenView.collection.fetch();

                  $('li.grandchild.active').removeClass('active');
                  $grandchild.addClass('active');

                  Utils.processing();

                  greatgrandchildrenPromise.done(function (data) {
                      XocesManager.regions.greatgrandchildren.show(greatgrandchildrenView);
                      $('.greatgrandchildren .link-wrapper').removeClass('hidden');
                      Utils.doneProcessing();
                  });
              }
          },
          showGreatgrandparents: function (e) {
              var context = this.options,
                  _this = this;

              if (context.hasGreatgrandparents) {
                  var $grandparent = $(e.currentTarget),
                      grandparent = $grandparent.data('raw-obj'),
                      grandparentId = grandparent.id,
                      greatgrandparents = new context.greatgrandparentCollection(
                          {parentId: grandparentId}),
                      greatgrandparentViewContext = {
                          collection: greatgrandparents,
                          objectName: context.greatgrandparentName,
                          objectType: 'greatgrandparents',
                          objectTypeSingular: 'greatgrandparent'
                      },
                      greatgrandparentsView = new View.ChildrenView(greatgrandparentViewContext),
                      greatgrandparentsPromise = greatgrandparentsView.collection.fetch();

                  $('li.grandparent.active').removeClass('active');
                  $grandparent.addClass('active');

                  Utils.processing();

                  _this.resetGreatgrandparentRegion();

                  greatgrandparentsPromise.done(function (data) {
                      XocesManager.regions.greatgrandparents.show(greatgrandparentsView);
                      $('.greatgrandparents .link-wrapper').removeClass('hidden');
                      Utils.doneProcessing();
                  });
              }
          },
          showParentDetails: function (parent) {
              var context = this.options,
                  $details = $('.parent-details'),
                  $children = $('.parent-children'),
                  children = new context.childrenCollection({parentId: parent.id}),
                  childViewContext = {
                      collection: children,
                      objectName: context.childName,
                      objectType: 'children',
                      objectTypeSingular: 'child'
                  },
                  childrenView = new View.ChildrenView(childViewContext),
                  childrenPromise = childrenView.collection.fetch();

              $details.removeClass('hidden');
              $details.find('.display-name span')
                  .text(parent.displayName.text);
              $details.find('.description span')
                  .text(parent.description.text);
              $details.find('.id span')
                  .text(parent.id);
              $children.removeClass('hidden');

              childrenPromise.done(function (data) {
                XocesManager.regions.children.show(childrenView);
              });

              if (context.hasGrandparents) {
                  var $grandparents = $('.parent-grandparent'),
                      grandparents = new context.grandparentCollection({parentId: parent.id}),
                      grandparentViewContext = {
                          collection: grandparents,
                          objectName: context.grandparentName,
                          objectType: 'grandparents',
                          objectTypeSingular: 'grandparent'
                      },
                      grandparentView = new View.ChildrenView(grandparentViewContext),
                      grandparentsPromise = grandparentView.collection.fetch();

                  grandparentsPromise.done(function (data) {
                      XocesManager.regions.grandparents.show(grandparentView);
                  });
              }
          },
          unlinkChild: function (e) {
              var $e = $(e.currentTarget),
                  $child = $e.parent(),
                  _this = this,
                  context = this.options;

              e.stopPropagation();

              XocesManager.regions.dialog.show(new View.DelinkView({
                  objType: context.childName
              }));
              XocesManager.regions.dialog.$el.dialog({
                  modal: true,
                  width: 600,
                  height: 500,
                  title: 'Delink ' + context.childName,
                  buttons: [
                      {
                          text: "Cancel",
                          class: 'btn btn-danger',
                          click: function () {
                              $(this).dialog("close");
                          }
                      },
                      {
                          text: "Delink",
                          class: 'btn btn-success',
                          click: function () {
                              var _thisDialog = this;

                              $child.remove();
                              $(_thisDialog).dialog("close");
                              _this.updateChildren(function () {
                                  var $list = $('ul.children-content');

                                  if ($list.children('li:not(.none-found)').length === 0) {
                                      $list.append(_.template(NoneFoundTemplate)());
                                  }

                                  _this.resetGrandchildRegion();
                                  _this.resetGreatgrandchildRegion();
                              });
                          }
                      }
                    ]
              });
          },
          unlinkGrandchild: function (e) {
              var $e = $(e.currentTarget),
                  $grandchild = $e.parent(),
                  _this = this,
                  context = this.options;

              e.stopPropagation();

              XocesManager.regions.dialog.show(new View.DelinkView({
                  objType: context.grandchildName
              }));
              XocesManager.regions.dialog.$el.dialog({
                  modal: true,
                  width: 600,
                  height: 500,
                  title: 'Delink ' + context.grandchildName,
                  buttons: [
                      {
                          text: "Cancel",
                          class: 'btn btn-danger',
                          click: function () {
                              $(this).dialog("close");
                          }
                      },
                      {
                          text: "Delink",
                          class: 'btn btn-success',
                          click: function () {
                              var _thisDialog = this;

                              $grandchild.remove();
                              Utils.processing();
                              $(_thisDialog).dialog("close");
                              _this.updateGrandchildren(function () {
                                  var $list = $('ul.grandchildren-content');
                                  Utils.doneProcessing();

                                  if ($list.children('li:not(.none-found)').length === 0) {
                                      $list.append(_.template(NoneFoundTemplate)());
                                  }

                                  _this.resetGreatgrandchildRegion();
                              });
                          }
                      }
                    ]
              });
          },
          unlinkGrandparent: function (e) {
              var $e = $(e.currentTarget),
                  $grandparent = $e.parent(),
                  grandparentId = $grandparent.data('raw-obj').id,
                  _this = this,
                  context = this.options;

              e.stopPropagation();

              XocesManager.regions.dialog.show(new View.DelinkView({
                  objType: context.grandparentName
              }));
              XocesManager.regions.dialog.$el.dialog({
                  modal: true,
                  width: 600,
                  height: 500,
                  title: 'Delink ' + context.grandparentName,
                  buttons: [
                      {
                          text: "Cancel",
                          class: 'btn btn-danger',
                          click: function () {
                              $(this).dialog("close");
                          }
                      },
                      {
                          text: "Delink",
                          class: 'btn btn-success',
                          click: function () {
                              var _thisDialog = this,
                                  parentId = $('select[name="parent-selection"]').val();

                              Utils.processing();

                              _this.getGrandparentParents(grandparentId, function (currentParentIds) {
                                  _.remove(currentParentIds, function (currentParentId) {
                                      return (parentId == currentParentId);
                                  });
                                  $grandparent.remove();

                                  $(_thisDialog).dialog("close");
                                  Utils.doneProcessing();

                                  _this.saveGrandparentModel(grandparentId, currentParentIds, function () {

                                      var $list = $('ul.grandparents-content');

                                      if ($list.children('li:not(.none-found)').length === 0) {
                                          $list.append(_.template(NoneFoundTemplate)());
                                      }

                                      _this.resetGreatgrandparentRegion();
                                  });
                              });
                          }
                      }
                    ]
              });
          },
          unlinkGreatgrandchild: function (e) {
              var $e = $(e.currentTarget),
                  $greatgrandchild = $e.parent(),
                  _this = this,
                  context = this.options;

              e.stopPropagation();

              XocesManager.regions.dialog.show(new View.DelinkView({
                  objType: context.greatgrandchildName
              }));
              XocesManager.regions.dialog.$el.dialog({
                  modal: true,
                  width: 600,
                  height: 500,
                  title: 'Delink ' + context.greatgrandchildName,
                  buttons: [
                      {
                          text: "Cancel",
                          class: 'btn btn-danger',
                          click: function () {
                              $(this).dialog("close");
                          }
                      },
                      {
                          text: "Delink",
                          class: 'btn btn-success',
                          click: function () {
                              var _thisDialog = this;

                              $greatgrandchild.remove();
                              Utils.processing();
                              $(_thisDialog).dialog("close");
                              _this.updateGreatgrandchildren(function () {
                                  var $list = $('ul.greatgrandchildren-content');
                                  Utils.doneProcessing();

                                  if ($list.children('li:not(.none-found)').length === 0) {
                                      $list.append(_.template(NoneFoundTemplate)());
                                  }
                              });
                          }
                      }
                    ]
              });
          },
          unlinkGreatgrandparent: function (e) {
              var $e = $(e.currentTarget),
                  $greatgrandparent = $e.parent(),
                  greatgrandparentId = $greatgrandparent.data('raw-obj').id,
                  _this = this,
                  context = this.options;

              e.stopPropagation();

              XocesManager.regions.dialog.show(new View.DelinkView({
                  objType: context.greatgrandparentName
              }));
              XocesManager.regions.dialog.$el.dialog({
                  modal: true,
                  width: 600,
                  height: 500,
                  title: 'Delink ' + context.greatgrandparentName,
                  buttons: [
                      {
                          text: "Cancel",
                          class: 'btn btn-danger',
                          click: function () {
                              $(this).dialog("close");
                          }
                      },
                      {
                          text: "Delink",
                          class: 'btn btn-success',
                          click: function () {
                              var _thisDialog = this,
                                  grandparentId = $('li.grandparent.active').data('raw-obj').id;
                              Utils.processing();

                              _this.getGreatgrandparentGrandparents(greatgrandparentId, function (currentGrandparentIds) {
                                  _.remove(currentGrandparentIds, function (currentGrandparentId) {
                                      return (grandparentId == currentGrandparentId);
                                  });
                                  $greatgrandparent.remove();

                                  $(_thisDialog).dialog("close");

                                  Utils.doneProcessing();
                                  _this.saveGreatgrandparentModel(greatgrandparentId, currentGrandparentIds, function () {

                                      var $list = $('ul.greatgrandparents-content');

                                      if ($list.children('li:not(.none-found)').length === 0) {
                                          $list.append(_.template(NoneFoundTemplate)());
                                      }
                                  });
                              });
                          }
                      }
                    ]
              });
          },
          updateGrandchildren: function (_callback) {
                var context = this.options,
                    childId = $('li.child.active').data('raw-obj').id,
                    child = new context.childModel({id: childId}),
                    $grandchildren = $('ul.grandchildren-content').children('li:not(.none-found)'),
                    grandchildrenIds = [];

                _.each($grandchildren, function (grandchild) {
                    var grandchildId = $(grandchild).data('raw-obj').id;

                    grandchildrenIds.push(grandchildId);
                });

                if (context.grandchildName == 'prerequisite') {
                    child.set('prerequisiteIds', grandchildrenIds);
                } else {
                    child.set('childIds', grandchildrenIds);
                }

                child.save()
                    .success(function (model, response, options) {
                        console.log('done');
                    }).error(function (model, xhr, options) {
                        Utils.updateStatus('Server error: ' + model.responseText);
                        $grandchildren.last().remove();
                    }).always(function () {
                        _callback();
                    });
          },
          updateGreatgrandchildren: function (_callback) {
                var context = this.options,
                    grandchildId = $('li.grandchild.active').data('raw-obj').id,
                    grandchild = new context.grandchildModel({id: grandchildId}),
                    $greatgrandchildren = $('ul.greatgrandchildren-content').children('li:not(.none-found)'),
                    greatgrandchildrenIds = [];

                _.each($greatgrandchildren, function (greatgrandchild) {
                    var greatgrandchildId = $(greatgrandchild).data('raw-obj').id;

                    greatgrandchildrenIds.push(greatgrandchildId);
                });

                if (context.greatgrandchildName == 'prerequisite') {
                    grandchild.set('prerequisiteIds', greatgrandchildrenIds);
                } else {
                    grandchild.set('childIds', greatgrandchildrenIds);
                }

                grandchild.save()
                    .success(function (model, response, options) {
                        console.log('done');
                    }).error(function (model, xhr, options) {
                        Utils.updateStatus('Server error: ' + model.responseText);
                        $greatgrandchildren.last().remove();
                    }).always(function () {
                        _callback();
                    });
          },
          updateChildren: function (_callback) {
                var context = this.options,
                    parentId = $('select[name="parent-selection"]').val(),
                    parent = new context.parentModel({id: parentId}),
                    $children = $('ul.children-content').children('li:not(.none-found)'),
                    childIds = [];

                _.each($children, function (child) {
                    var childId = $(child).data('raw-obj').id;

                    childIds.push(childId);
                });

                if (context.childName == 'prerequisite') {
                    parent.set('prerequisiteIds', childIds);
                } else {
                    parent.set('childIds', childIds);
                }

                parent.save()
                    .success(function (model, response, options) {
                        console.log('done');
                    }).error(function (model, xhr, options) {
                        Utils.updateStatus('Server error: ' + model.responseText);
                        $children.last().remove();
                    }).always(function () {
                        _callback();
                    });
          },
          updateGrandparents: function (_callback) {
              var context = this.options,
                  parentId = $('select[name="parent-selection"]').val(),
                  $grandparents = $('ul.grandparents-content').children('li:not(.none-found)'),
                  grandparentId = $grandparents.last().data('raw-obj').id,
                  _this = this;

              _this.getGrandparentParents(grandparentId, function (currentParentIds) {
                  currentParentIds.push(parentId);
                  Utils.doneProcessing();
                  _this.saveGrandparentModel(grandparentId, currentParentIds, _callback);
              });
          },
          updateGreatgrandparents: function (greatgrandparentId, _callback) {
              var context = this.options,
                  grandparentId = $('li.grandparent.active').data('raw-obj').id,
                  _this = this;

              _this.getGreatgrandparentGrandparents(greatgrandparentId, function (currentGrandparentIds) {
                  currentGrandparentIds.push(grandparentId);
                  Utils.doneProcessing();
                  _this.saveGreatgrandparentModel(greatgrandparentId, currentGrandparentIds, _callback);
              });
          }
      });

      View.AddParentView = Marionette.ItemView.extend({
          template: function () {
              return _.template(AddObjectTemplate)();
          }
      });

      View.DeleteParentView = Marionette.ItemView.extend({
          initialize: function (options) {
              this.options = options;
          },
          serializeData: function () {
              return this.options;
          },
          template: function (serializedData) {
              return _.template(DeleteTemplate)({
                  objType: serializedData.parentName
              });
          }
      });

      View.DelinkView = Marionette.ItemView.extend({
          initialize: function (options) {
              this.options = options;
          },
          serializeData: function () {
              return this.options;
          },
          template: function (serializedData) {
              return _.template(DelinkTemplate)({
                  objType: serializedData.objType
              });
          }
      });

      View.EditParentView = Marionette.ItemView.extend({
          initialize: function (options) {
            this.options = options;
          },
          serializeData: function () {
              return {
                  displayName: this.options.displayName,
                  description: this.options.description
              };
          },
          template: function (serializedData) {
              return _.template(EditObjectTemplate)({
                  displayName: serializedData.displayName,
                  description: serializedData.description
              });
          }
      });

      View.ChildrenView = Marionette.ItemView.extend({
          initialize: function (options) {
              this.options = options;
          },
          serializeData: function () {
            return {
                context: this.options,
                items: this.collection.toJSON()
            }
          },
          template: function (serializedData) {
              return _.template(ObjectListTemplate)({
                  objects: serializedData.items,
                  objectName: serializedData.context.objectName,
                  objectType: serializedData.context.objectType,
                  objectTypeSingular: serializedData.context.objectTypeSingular
              });
          },
          onShow: function () {
          }
      });
  });

  return XocesManager.XocesApp.Generic.View;
});