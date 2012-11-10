define(["Note"], function(Note){
    var viewNotes = {};
    viewNotes.notes = new Note.List();

    var note = new Note.Model({text: "garage: 1122", position: {lat: 1, lng: 1}});
    viewNotes.notes.add(note);
        note = new Note.Model({text: "buy airlock", position: {lat: 1, lng: 1}});
    viewNotes.notes.add(note);
        note = new Note.Model({text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", position: {lat: 1, lng: 1}});
    viewNotes.notes.add(note);

    viewNotes.listView = new Note.ListView({collection: viewNotes.notes});

    return viewNotes;
});
