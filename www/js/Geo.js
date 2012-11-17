define("Geo", ["backbone"], function(Backbone){

    var Geo = {};

    if ("geolocation" in navigator) {
    } else {
        alert("Sorry, GeoNotes requires a browser that supports geolocation.");
        return null;
    }

    Geo.Model = Backbone.Model.extend({

        defaults: {
            wpid: '',
            currentLat: '',
            currentLng: '',
            timestamp: '',
            currentCoords: '',
        },

        initialize: function(){
            var self = this;
            this.set("wpid", navigator.geolocation.watchPosition(function(position){
                console.log("watchPosition event: " + position.coords.longitude + "," + position.coords.latitude);
                self.set("currentLat", position.coords.latitude);
                self.set("currentLng", position.coords.longitude);
                self.set("currentCoords", position.coords.longitude + "," + position.coords.latitude);
                self.set("timestamp", position.timestamp);
            }, null, {maximumAge: 1000}));
        },

        // return haversine distance between pos1 and pos2 ...
        // or between pos1 and current position if pos2 is undefined
        distance: function(coords1, coords2){
          coords2 = typeof coords2 !== 'undefined' ? coords2 : this.get("currentCoords");
          var pos1 = coords1.split(","),
              pos2 = coords2.split(",");
            var R = 3961, //earth radius km
                lat1 = pos1[1],
                lng1 = pos1[0],
                lat2 = pos2[1],
                lng2 = pos2[0];
            var dLat = (lat2 - lat1) * Math.PI / 180,
                dLng = (lng2 - lng1) * Math.PI / 180,
                lat1 = lat1 * Math.PI / 180,
                lat2 = lat2 * Math.PI / 180;
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var distance = R*c;
            var miles = Math.round((R * c) * 10)/10;
            var yards = Math.round((distance * 1760) * 10)/10,
                feet  = Math.round((distance * 5280) * 10)/10;
            return {miles: miles, yards: yards, feet: feet};
        }
    });

    Geo.CoordsView = Backbone.View.extend({
      el: $('#coordsView'),
      tagName: 'span',
      className: 'geoCoords',
      initialize: function(options){
        this.model.on('change:timestamp', _.bind(this.render, this));
      },
      render: function(){
        this.$el.html('<span class="lng" data-name="longitude">'+this.model.get('currentLng')+','+'<span class="lat" data-name="latitude">'+this.model.get('currentLat'));
        }
    });

    return Geo;
});
