app.model.Note = Backbone.Model.extend({});

app.collection.NoteList = Backbone.Collection.extend({
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

app.view.TemplatedView = Backbone.View.extend({
  render: function(){
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});

app.template.NoteListItemView = app.view.TemplatedView.extend({
  template: _.template($("#note-list-template").html()),
  initialize: function(){
    this.bind('render', this);
    this.model.on('change', this.render);
  }
});

app.view.NoteListView = Backbone.View.extend({
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
      var view = new app.template.NoteListItemView({model: model}).render();
      $ul.append(view.$el);
    });
    return this;
  }
});

app.colleciton.notes = new app.collection.NoteList();

app.view.noteListView = new app.view.NoteListView({collection: app.collection.notes});