require.config({
    deps: ["main"],

    baseUrl: 'js/',
    paths: {
      'jquery': 'lib/jquery.min',
      'install': 'lib/install',
      'underscore': 'lib/underscore',
      'backbone': 'lib/backbone',
      'localstorage': 'lib/localstorage',
      'Note': 'Note',
      'viewNotes': 'viewNotes'
    },
    shim: {
      backbone: {
        deps: ["underscore", "jquery"],
        exports: "Backbone"
      },
      localstorage: {
        deps: ["backbone", "jquery", "underscore"],
        exports: "localstorage"
      },
      bootstrap: {
        deps: ["jquery"],
        exports: "$"
      }
    }
});
