var script = document.createElement('script');
script.src =
'https://maps.googleapis.com/maps/api/js?libraries=places,visualization&key=AIzaSyC-5TmGOcuCbj2uX6Ssfqn7_6gKRRCYomg&v=weekly&callback=initMap';
script.async=true;

var markers = {"Popizz Woodlands":{lat:1.434078,lng:103.780709},
"Popizz Jurong Point":{lat:1.3397496619782405,lng:103.7054636956996},
"Popizz Sembawang":{lat:1.448064,lng:103.819989},
"Popizz Punggol":{lat:1.3915619950791178,lng:103.8960201313853},
"Popizz Pasir Ris":{lat:1.3782040376877163,lng:103.9417973560014},
"Popizz Katong":{lat:1.3051357518694195,lng:103.90421970830876},
};

window.initMap = function() {
    // Google Maps JS API is loaded and available
    const myLatLng = { lat: 1.3521, lng: 103.8198 };
    var map = new google.maps.Map(document.getElementById("js_googlemap"), {
      zoom: 11,
      center: myLatLng,
      gestureHandling: 'cooperative',
    });
    var image = {
        url: "images/gmaps_icon.png",
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(30,30)
      };
    function addMarker(marker,location,icon="") {
        var marker = new google.maps.Marker({
            position: location,
            title: marker,
            map,
            icon: icon,
        });
        // To add the marker to the map, call setMap();
        marker.setMap(map);
        // marker_array.push(marker);
        // return marker_array;
    }
    for (let marker of Object.keys(markers)) {
        let location = markers[marker];
        addMarker(marker,location,image);
    }
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directonsService = new google.maps.DirectionsService();
    // get Directions from start to end
    function getDirections(start,end,modeoft='DRIVING') {
        let request = {
            origin:start,
            destination:end,
            travelMode: modeoft,
        }
        directonsService.route(request).then(function(result) {
            directionsDisplay.setDirections(result);
            directionsDisplay.setMap(map);
        }).catch((error) => {
            console.log("error in obtaining directions result"+ error);
        })
        directionsDisplay.setPanel(document.getElementById('rightpanel'))
    };
    // get currentLocation
    $("button.get_currentLocation").click(() => {
        var gl = navigator.geolocation;
        gl.getCurrentPosition(function(pos) {
            let lati = pos.coords.latitude;
            let lngi = pos.coords.longitude;
            let currentLocation = {lat:lati,lng:lngi};
            addMarker("currentLocation",currentLocation);
            $("select#origin option:first-of-type").val(`${lati},${lngi}`);
            $("select#origin option:first-of-type").text("Current Location");
        });
        $("button.get_currentLocation").css("visibility","hidden");
        $("button.getDirection").css("visibility","visible")
    })
    // change destination onclick
    $("select#destination:selected").change(() => {
        let location = $("select#destination:selected").val().split(",");
        map.setCenter({lat: location[0], lng: location[1]});
    })
    // check for filled starting and end destination
    $("button.getDirection").click(() => {
        //console.log($("select#destination").find("option:selected").val())
        if ($("select#destination").find("option:selected").val() != "" && $("select#origin").find("option:selected").val() != "") {
            let start = $("select#origin").find("option:selected").val().split(",");
            let end = $("select#destination").find("option:selected").val().split(",");
            start = {lat:parseFloat(start[0]),lng:parseFloat(start[1])};
            end = {lat:parseFloat(end[0]),lng:parseFloat(end[1])};
            getDirections(start,end);
        }
    })
};
document.head.appendChild(script);