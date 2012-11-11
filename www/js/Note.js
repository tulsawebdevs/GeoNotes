/**
 * Most of the note views, templates, and models are defined here
 */
define("Note", ["backbone", "localstorage"], function(Backbone, localstorage){
    var Note = {};

    /**
     * Extend the note model and do nothing. [:
     */
    Note.Model = Backbone.Model.extend({});

    /**
     * The base Template for ListItemView
     *
     * Note.ListView extends Note.ListItemView extends Note.TemplatedView
     */
    Note.TemplatedView = Backbone.View.extend({
      render: function(){
        var html = this.template(this.model.toJSON());
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
          addNote = $('#addNote'),
          latitude, longitude;

        // Cache value
        this.noteList = noteList;

        // Geo location
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(function(position) {
            // Update geolocation
            $('input[data-name=latitude]', $('#addNote')).val(position.coords.latitude);
            $('input[data-name=longitude]', $('#addNote')).val(position.coords.longitude);
            $('span[data-name=latitude]', $('#addNote')).text(position.coords.latitude);
            $('span[data-name=longitude]', $('#addNote')).text(position.coords.longitude);
          });
        } else {
          alert("I'm sorry, but geolocation services are not supported by your browser.");
        }

        // To render or not to render
        if(addNote.text().length > 0) {
          $('textarea').val('');
          return; // lol wut?
        }

        // Append
        addNote.append(data);


        return this;
      },
      actionSubmit: function() {
        // Variables
        var addNote = $('#addNote'),
          text = $('textarea[name=noteText]', addNote).val(),
          latitude = $('input[data-name=latitude]', addNote).val(),
          longitude = $('input[data-name=longitude]', addNote).val();
        // Add note
        this.noteList.add(new Note.Model({
          text: text,
          position: {
            lat: latitude,
            lng: longitude
          }
        }));
        // Redirect
        window.location.hash = '';
      }
    });

    return Note;
});
