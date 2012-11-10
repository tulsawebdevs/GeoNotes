
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
      localStorage: new Store("notes"),
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
        {text: "garage: 1122", position: {lat: 1, lng: 1}},
        {text: "buy airlock", position: {lat: 1, lng: 1}},
        {text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", position: {lat: 1, lng: 1}}
    ]);

//    notes.each(function(note){ notes.add(note); });

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
