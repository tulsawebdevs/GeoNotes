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
        this.bind('render', this);
        this.collection.on('change', this.render);
      },
      render: function(){
        var listView = this;
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

    console.log(Note);
    return Note;
});
