// xoces/apps/subject-manager/subject_manager_views.js

define(["app",
        "apps/common/utilities",
        "text!apps/common/templates/item_selector.html",
        "text!apps/common/templates/none_found.html",
        "jquery-select2"],
       function(XocesManager, Utils, ItemSearchTemplate, NoneFoundTemplate){
  XocesManager.module("XocesApp.Common.View", function(View, XocesManager, Backbone, Marionette, $, _) {
      View.LinkView = Marionette.ItemView.extend({
          initialize: function (options) {
              this.options = options;
          },
          template: function (serializedData) {
              if (serializedData.items.length > 0) {
                return _.template(ItemSearchTemplate)({
                    items: serializedData.items
                });
            } else {
                return _.template(NoneFoundTemplate)();
            }
          },
          onShow: function () {
              $('.item-selector').select2({
                  width: 'element',
                  placeholder: 'Select a ' + this.options.targetName
              });
          },
          events: {
              'change .item-selector': 'showItemDetails'
          },
          showItemDetails: function (e) {
              var $e = $(e.currentTarget),
                  $item = $e.children('option:selected'),
                  item = $item.data('raw-obj'),
                  $name = $('.item-details .display-name span'),
                  $desc = $('.item-details .description span'),
                  $id = $('.item-details .id span');

              $('.item-details').removeClass('hidden');
              $name.text(item.displayName.text);
              $desc.text(item.description.text);
              $id.text(item.id)
          }
      });
  });

  return XocesManager.XocesApp.Common.View;
});