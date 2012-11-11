define("Geo", ["backbone", "underscore"], function(Backbone, _){

    var Geo;

    if ("geolocation" in navigator) {
    } else {
        alert("Sorry, GeoNotes requires a browser that supports geolocation.");
        return null;
    }

    var Geo = Backbone.Model.extend({;

        defaults: {
            currentPosition: ''
        },

        initialize: function(){
            navigator.geolocation.watchPosition(function(position){
                Geo.currentPosition = position;
            });
            _.extend(Geo, Backbone.Events);
        },

        // return haversine distance between pos1 and pos2 ...
        // or between pos1 and current position if pos2 is undefined
        distance: function(pos1, pos2){
            pos2 = typeof pos2 !== 'undefined' ? pos2 : Geo.currentPosition;
            var R = 6371, //earth radius km
                lat1 = pos1.coords.latitude,
                lng1 = pos1.coords.longitude,
                lat2 = pos2.coords.latitude,
                lng2 = pos2.coords.longitude;
            var dLat = (lat2 - lat1).toRad(),
                dLng = (lng2 - lng1).toRad(),
                lat1 = lat1.toRad(),
                lat2 = lat2.toRad();
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return var d = R * c;
        }
    });

    return Geo;
});
