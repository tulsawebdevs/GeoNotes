
/**
 * The code below uses require.js, a module system for javscript:
 * http://requirejs.org/docs/api.html#define
 * 
 * Include the in-app payments API, and if it fails to load handle it
 * gracefully.
 * https://developer.mozilla.org/en/Apps/In-app_payments
 */
require(['https://marketplace.cdn.mozilla.net/mozmarket.js'],
        function() {},
        function(err) {
            window.mozmarket = window.mozmarket || {};
            window.mozmarket.buy = function() {
                alert('The in-app purchasing is currently unavailable.');
            };
        });

/**
 * The main 'app'. The routes are defined and placed below.
 * When you write javascript in separate files, list them as
 * dependencies along with jquery
 */
define("app", ['backbone', 'install', 'localstorage', 'Note'], function(Backbone, install, localstorage, Note) {
    var app = {},
        noteList = new Note.List(),
        noteListView = new Note.ListView({collection: noteList}),
        noteAddView = new Note.AddView();

    /**
     * The router for the application.
     */
    app.Router = Backbone.Router.extend({
        routes: {
            "add": "addNote",
            ".*": "viewNotes"
        },

        /**
         * switchView
         * Will hide all the other values, then unhide itself.
         * @param  string id The id of the element to unhide. (#page > #id)
         */
        switchView: function(id) {
          $('#pages .page').hide();
          $('#' + id).show();
        },

        /**
         * Viewing the notes
         */
        viewNotes: function() {
          this.switchView('viewNotes');
          noteListView.render();
        },

        /**
         * Adding notes
         */
        addNote: function() {
          this.switchView('addNote');
          noteAddView.render(noteList);
        }
    });

    /**
     * Boilerplate data
     */
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

    return app;
});
