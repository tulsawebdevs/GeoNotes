define("Geo", ["backbone"], function(Backbone){

    var Geo;

    if ("geolocation" in navigator) {
    } else {
        alert("Sorry, GeoNotes requires a browser that supports geolocation.");
        return null;
    }

    var Geo = Backbone.Model.extend({

        defaults: {
            wpid: '',
            currentPosition: '',
            currentLat: '',
            currentLng: '',
        },

        initialize: function(){
            var self = this;
            this.set("wpid", navigator.geolocation.watchPosition(function(position){
                console.log("watchPosition event: " + position.coords.longitude + "," + position.coords.latitude);
                self.set("currentPosition", position);
                self.set("currentLat", position.coords.latitude);
                self.set("currentLng", position.coords.longitude);
                var geoposition = self.get("currentPosition");
            }, null, {maximumAge: 1000}));
        },

        // return haversine distance between pos1 and pos2 ...
        // or between pos1 and current position if pos2 is undefined
        distance: function(pos1, pos2){
            pos2 = typeof pos2 !== 'undefined' ? pos2 : this.get("currentPosition");
            var R = 3961, //earth radius km
                lat1 = pos1.coords.latitude,
                lng1 = pos1.coords.longitude,
                lat2 = pos2.coords.latitude,
                lng2 = pos2.coords.longitude;
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

    return Geo;
});
