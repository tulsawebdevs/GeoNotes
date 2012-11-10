
// The code below uses require.js, a module system for javscript:
// http://requirejs.org/docs/api.html#define

require.config({
    baseUrl: 'js/lib',
    paths: {
      'jquery': 'jquery.min',
      'underscore': 'underscore',
      'backbone': 'backbone',
      'localstorage': 'backbone.localStorage'
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
define("app", ['backbone', 'install', 'localstorage'], function(Backbone, install) {

    var Note = Backbone.Model.extend({});

    console.log('local', Store);

    var NoteList = Backbone.Collection.extend({
      model: Note,
      localStorage: new Store("mozillanotes"),
      initialize: function(){
        this.fetch();
        this.on('add', function(model){
          console.log('model', model);
          model.save();
        });
      }
    });

    var TemplatedView = Backbone.View.extend({
      render: function(){
        var html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
      }
    });

    var NoteListItemView = TemplatedView.extend({
      tag: "li",
      template: _.template($("#note-list-template").html()),
      initialize: function(){
        this.bind('render', this);
        this.model.on('change', this.render);
      }
    });

    var NoteListView = Backbone.View.extend({
      el: '#note-list',
      initialize: function(){
        this.bind('render', this);
        this.collection.on('change', this.render);
      },
      render: function(){
        var listView = this;
        var $ul = this.$el.find("ul");
        $ul.empty();
        this.collection.each(function(model){
          var view = new NoteListItemView({model: model}).render();
          $ul.append(view.$el);
        });
        return this;
      }
    });

    var notes = new NoteList([
        {text: "Hello, fablab", position: {lat: 1, lng: 1}},
        {text: "Hello, fablab Tulsa", position: {lat: 1, lng: 1}}
    ]);


    var m = new Note({text: "MeowMeow", position: {lat: 1, lng: 1}});
    var n = new Note({text: "Rawr", position: {lat: 1, lng: 1}});

    notes.add(m);
    notes.add(n);

    var noteListView = new NoteListView({collection: notes});
    noteListView.render();

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
