define("Note", ["backbone", "localstorage"], function(Backbone, localstorage){
    var Note = {};
    console.log(Note);

    Note.Model = Backbone.Model.extend({});

    Note.TemplatedView = Backbone.View.extend({
      render: function(){
        var html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
      }
    });

    Note.List = Backbone.Collection.extend({
      model: Note.Model,
      localStorage: new Store("notes"),
      initialize: function(){
        this.fetch();
        this.on('add', function(model){
          console.log('model', model);
          model.save();
        });
      }
    });

    Note.ListItemView = Note.TemplatedView.extend({
      template: _.template($("#note-list-template").html()),
      initialize: function(){
        this.bind('render', this);
        this.model.on('change', this.render);
      }
    });

    Note.ListView = Backbone.View.extend({
      el: '#note-list',
      initialize: function(){
        _.bindAll(this, 'render');
        this.collection.on('change', this.render);
      },
      render: function(){
        console.log('_this', this);
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
        this.noteList = noteList;
        if(addNote.text().length > 0) {
          $('textarea').val('');
          return; // lol wut?
        }
        addNote.append(data);
        return this;
      },
      actionSubmit: function() {
        // Variables
        var addNote = $('#addNote'),
          text = $('textarea[name=noteText]', addNote).val(),
          posx = $('input[name=posx]', addNote).val(),
          posy = $('input[name=posy]', addNote).val();
        // Add note
        console.log('hell yeah?');
        console.log(this.noteList, 'added');
        this.noteList.add(new Note.Model({
          text: text,
          position: {
            lat: posx,
            lng: posy
          }
        }));
        // Redirect
        window.location.hash = '';
      }
    });

    console.log(Note);
    return Note;
});
