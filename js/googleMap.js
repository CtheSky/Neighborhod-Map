/**
 * Created by CtheSky on 2016/10/28.
 */
// google map
var map;
var infowindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7, lng: -74},
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    });

    // Resize stuff...
    google.maps.event.addDomListener(window, "resize", function() {
       var center = map.getCenter();
       google.maps.event.trigger(map, "resize");
       map.setCenter(center);
    });

    infowindow = new google.maps.InfoWindow();
}

function markerBounce(marker){
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function stopAnimation(){
        marker.setAnimation(null);
    }, 700);
}