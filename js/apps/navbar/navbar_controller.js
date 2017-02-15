// xoces/apps/navbar/navbar_controller.js

define(["app",
        "apps/navbar/views/navbar_views",
        "apps/bank-manager/collections/banks"],
    function(XocesManager, NavbarViews, BanksCollection){
  XocesManager.module("XocesApp.Navbar", function(Navbar, XocesManager, Backbone, Marionette, $, _){
    Navbar.Controller = {
      renderNavbar: function () {
          var banks = new BanksCollection([]),
              navbarView = new NavbarViews.NavbarView({collection: banks}),
              navbarPromise = navbarView.collection.fetch();

          navbarPromise.done(function (data) {
              XocesManager.regions.navbar.show(navbarView);
          });
      }
    }
  });

  return XocesManager.XocesApp.Navbar.Controller;
});