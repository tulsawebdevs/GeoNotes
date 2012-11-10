// Create global var - lol
var app = {
  model: {},
  view: {},
  collection: {},
  template: {}
};

// The code below uses require.js, a module system for javscript:
// http://requirejs.org/docs/api.html#define

require.config({
    baseUrl: 'js/lib',
    paths: {
      'jquery': 'jquery.min',
      'underscore': 'underscore',
      'backbone': 'backbone',
      'localstorage': 'localstorage',
      'viewNotes': 'viewNotes'
    },
    shim: {
      backbone: {
        deps: ["underscore", "jquery"],
        exports: "Backbone"
      },
      localstorage: {
        deps: ["Backbone", "jquery", "underscore"],
        exports: "localstorage"
      },
      bootstrap: {
        deps: ["jquery"],
        exports: "$"
      }
    }
});

// Include the in-app payments API, and if it fails to load handle it
// gracefully.
// https://developer.mozilla.org/en/Apps/In-app_payments
require(['https://marketplace.cdn.mozilla.net/mozmarket.js'],
        function() {},
        function(err) {
            window.mozmarket = window.mozmarket || {};
            window.mozmarket.buy = function() {
                alert('The in-app purchasing is currently unavailable.');
            };
        });



// When you write javascript in separate files, list them as
// dependencies along with jquery
define("app", ['backbone', 'install', 'localstorage', 'viewNotes'], function(Backbone, install) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            "add": "addNote",
            ".*": "viewNotes"
        },
        switchView: function(id) {
          console.log('switching...' , id);
          $('#pages .page').hide();
          $('#' + id).show();
        },
        viewNotes: function() {
          this.switchView('viewNotes');
          app.view.NoteListView.render();
        },
        addNote: function() {
          this.switchView('addNote');
          alert('hell yeah!');
        }
    });

    var app_router = new AppRouter();

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

    // Hook up the installation button, feel free to customize how
    // this works
    function updateInstallButton() {
        $(function() {
            var btn = $('.install-btn');
            if(install.state == 'uninstalled') {
                btn.show();
            }
            else if(install.state == 'installed' || install.state == 'unsupported') {
                btn.hide();
            }
        });
    }

    $(function() {
        $('.install-btn').click(install);
    });

    install.on('change', updateInstallButton);

    install.on('error', function(e, err) {
        // Feel free to customize this
        $('.install-error').text(err.toString()).show();
    });

    install.on('showiOSInstall', function() {
        // Feel free to customize this
        var msg = $('.install-ios-msg');
        msg.show();
        
        setTimeout(function() {
            msg.hide();
        }, 8000);
    });

});
