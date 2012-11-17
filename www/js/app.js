
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
define("app", ['backbone', 'install', 'localstorage', 'Note', 'Geo'], function(Backbone, install, localstorage, Note, Geo) {
    var app           = {};
        app.Geo       = new Geo.Model();
    var noteList      = new Note.List({geo: app.Geo});
    var noteListView  = new Note.ListView({collection: noteList}),
        noteAddView   = new Note.AddView({geo: app.Geo, noteList: noteList}),
        dinoView      = new Note.DinoView();

    /**
     * The router for the application.
     */
    app.Router = Backbone.Router.extend({
        routes: {
            "add": "addNote",
            "dino": "viewDino",
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

        viewNotes: function() {
          this.switchView('viewNotes');
          noteList.fetch();
        },

        addNote: function() {
          this.switchView('addNote');
          noteAddView.render(noteList);
        },

        viewDino: function() {
          this.switchView('viewDino');
          dinoView.render();
        }
    });

    window.app = app;
    window.noteList = noteList;

    return app;
});
