define("Note", ["backbone", "localstorage", "Geo"], function(Backbone, localstorage, Geo){
    var Note = {};

    Note.Model = Backbone.Model.extend({
      defaults: {
          'text': "loading ...",
          'distance': "loading ..."
      },

      serialize: function(){
        return _.extend(this.toJSON());
      }
   });

    Note.List = Backbone.Collection.extend({
      model: Note.Model,
      localStorage: new Store("notes"),
      initialize: function(options){
        this.geo = options.geo;
        this.on('add', function(model){
          model.save();
        });
        var self = this;
        this.geo.on('change:currentLng', function(){
            self.each(function(note){
              if (note.has("coords"))
                note.set("distance", self.geo.distance(note.get("coords")));
            });
        });
      }
    });

    Note.ListItemView = Backbone.View.extend({
      template: _.template($("#note-list-template").html()),
      initialize: function(){
        _.bindAll(this, 'render');
        this.model.on('change', this.render);
      },
      render: function(){
        var html = this.template(this.model.serialize());
        this.$el.html(html);
        return this;
      }
    });

    Note.ListView = Backbone.View.extend({
      el: '#note-list',
      initialize: function(){
        _.bindAll(this, 'render');
        this.collection.on('change', this.render);
      },
      render: function(){
        console.log("Note.ListView, render");
        var $ul = this.$el.find("ul");
        $ul.empty();
        this.collection.each(function(model){
          var view = new Note.ListItemView({model: model}).render();
          $ul.append(view.$el);
        });
        return this;
      }
    });

    Note.DetailView = Backbone.View.extend({
        // TODO: implement
    });

    Note.DinoView = Backbone.View.extend({
      el: '#viewDino',
      initialize: function(){
        _.bindAll(this, 'render');
      },
      render: function(noteList){
        this.$el.html($('<img />').attr({
          'src': './img/dino.png'
        })).prepend(
          $('<a href="#"><i class="icon-step-backward"></i>Back</a>')
        );
        return this;
      }
    });

    Note.AddView = Backbone.View.extend({
      el: '#addNote',
      noteList: null,

      events: {
        "click button#btnAdd": "actionSubmit"
      },

      initialize: function(options){
        this.geo        = options.geo;
        this.noteList   = options.noteList;
        this.coordsView = new Geo.CoordsView({model: this.geo});
        _.bindAll(this, 'render');
      },

      render: function(noteList){
        this.coordsView.render();
      },

      actionSubmit: function() {
        // Variables
        var addNote   = $('#addNote'),
            text      = $('#noteText', addNote).val(),
            lat       = this.geo.get("currentLat"),
            lon       = this.geo.get("currentLng"),
            coords    = this.geo.get("currentCoords"),
            time      = this.geo.get("timestamp");
        // Add note
        var note = new Note.Model({
          text: text,
          lat: lat,
          lon: lon,
          coords: coords,
          time: time
        });
        this.noteList.add(note);
        // Redirect
        window.location.hash = '';
      }
    });

    return Note;
});
