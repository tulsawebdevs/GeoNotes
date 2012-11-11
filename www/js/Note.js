/**
 * Most of the note views, templates, and models are defined here
 */
define("Note", ["backbone", "localstorage", "Geo"], function(Backbone, localstorage, Geo){
    var Note = {};

    /**
     * Extend the note model and do nothing. [:
     */
    Note.Model = Backbone.Model.extend({
      getDistance: function(){
        return 20;
      },
      serialize: function(){
        return _.extend({ distance: this.getDistance() }, this.toJSON());
      }
   });

    /**
     * The base Template for ListItemView
     *
     * Note.ListView extends Note.ListItemView extends Note.TemplatedView
     */
    Note.TemplatedView = Backbone.View.extend({
      render: function(){
        var html = this.template(this.model.serialize());
        this.$el.html(html);
        return this;
      }
    });

    /**
     * The collection of notes (aka notebook!)
     */
    Note.List = Backbone.Collection.extend({
      model: Note.Model,
      localStorage: new Store("notes"),
      initialize: function(){
        this.fetch();
        this.on('add', function(model){
          model.save();
        });
      }
    });

    /**
     * The main view for the ListView
     *
     * Note.ListView extends Note.ListItemView extends Note.TemplatedView
     */
    Note.ListItemView = Note.TemplatedView.extend({
      template: _.template($("#note-list-template").html()),
      initialize: function(){
        this.bind('render', this);
        this.model.on('change', this.render);
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
          'src': '/img/dino.png'
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
      initialize: function(){
        _.bindAll(this, 'render');
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

        // Geo location
        var geo = new Geo();
        var self = this;
        geo.on("geo", function(position){
            $('span[data-name=latitude]', $('#addNote')).text(position.coords.latitude);
            $('span[data-name=longitude]', $('#addNote')).text(position.coords.longitude);
            self.geo = geo;
        });

        // Append
        addNote.append(data);

        return this;
      },
      actionSubmit: function() {
        // Variables
        var addNote = $('#addNote'),
          text = $('textarea[name=noteText]', addNote).val(),
          position = this.geo.currentPosition;
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
