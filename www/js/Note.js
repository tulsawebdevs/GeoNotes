/**
 * Most of the note views, templates, and models are defined here
 */
define("Note", ["backbone", "localstorage", "Geo"], function(Backbone, localstorage, Geo){
    var Note = {};

    /**
     * Extend the note model and do nothing. [:
     */
    Note.Model = Backbone.Model.extend({
      defaults: {
          'text': "loading ...",
          'distance': "loading ..."
      },

      serialize: function(){
        return _.extend(this.toJSON());
      }
   });

    /**
     * The collection of notes (aka notebook!)
     */
    Note.List = Backbone.Collection.extend({
      model: Note.Model,
      localStorage: new Store("notes"),
      initialize: function(options){
        this.geo = options.geo;
        this.on('add', function(model){
          model.save();
        });
        var self = this;
        this.geo.on('change:currentLat change:currentLng', function(){
            console.log("change:currentLat: " + self.geo.get("currentPosition"));
            _.each(self.models, function(note){
                note.set("distance", self.geo.distance(note.get("position")));
            });
        });
      }
    });

    /**
     * The main view for the ListView
     *
     * Note.ListView extends Note.ListItemView extends Note.TemplatedView
     */
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

    /**
     * The view for the actual list
     *
     * Note.ListView extends Note.ListItemView extends Note.TemplatedView
     */
    Note.ListView = Backbone.View.extend({
      el: '#note-list',
      initialize: function(){
        _.bindAll(this, 'render');
        this.collection.on('change', this.render);
      },
      render: function(){
        var $ul = this.$el.find("ul");
        $ul.empty();
        this.collection.each(function(model){
          var view = new Note.ListItemView({model: model}).render();
          $ul.append(view.$el);
        });
        return this;
      }
    });

    /**
     * If we want to make a detail view in the future
     */
    Note.DetailView = Backbone.View.extend({
        // TODO: implement
    });

    /**
     * Will render the dinosaur image
     */
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

    /**
     * The view for the 'add' page.
     */
    Note.AddView = Backbone.View.extend({
      noteList: null,
      events: {
        "click input.button.addNote": "actionSubmit"
      },
      el: '#addNote',
      initialize: function(options){
        _.bindAll(this, 'render');
        this.geo = options.geo;
      },
      render: function(noteList){
        var data = $('#add-note-template').html(),
          addNote = $('#addNote');

        // Cache value
        this.noteList = noteList;

        // To render or not to render
        if(addNote.text().length > 0) {
          $('textarea').val('');
          return; // lol wut?
        }

        // Render coords - now and/or when they update
        var renderCoords = function(position){
            $('span[data-name=latitude]', $('#addNote')).text(position.coords.latitude);
            $('span[data-name=longitude]', $('#addNote')).text(position.coords.longitude);
        };
        if (this.geo.get("currentPosition").coords) {
            renderCoords(this.geo.get("currentPosition"));
        }
        var self = this;
        this.geo.on("change:currentLat change:currentLng", function(){
            renderCoords(self.geo.get("currentPosition"));
        });

        // Append
        addNote.append(data);

        return this;
      },
      actionSubmit: function() {
        // Variables
        var addNote = $('#addNote'),
          text = $('textarea[name=noteText]', addNote).val(),
          position = this.geo.get("currentPosition");
        // Add note
        note = new Note.Model({
          text: text,
          position: position
        });
        this.noteList.add(note);
        // Redirect
        window.location.hash = '';
      }
    });

    return Note;
});
