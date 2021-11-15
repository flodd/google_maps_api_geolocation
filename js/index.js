let map;
let marker;
let geocoder;

// aspetta il caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
    marker = {};
    // crea un elemento script all'interno del documento
    let s = document.createElement("script");
    document.head.appendChild(s);

    // aggiunge un event listener LOAD all'elemento SCRIPT
    s.addEventListener("load", () => {

        //script has loaded
        console.log("script has loaded. About to load the map");

        // Crea la nuova mappa
        map = new google.maps.Map(document.getElementById("map"), {
            center: {
                lat: 45.4496711,
                lng: -75.6569551
            },
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            // restriction: {
            //     latLngBounds: {
            //         north: 90.00,
            //         south: 10.00,
            //         west: -100.00,
            //         east: -60.00,
            //     }
            // },
            // minZoom: 10,
            // maxZoom: 17,
            disableDoubleClickZoom: true,
            clickableIcons: false,
            disableDefaultUI: true,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                mapTypeIds: ["roadmap", "terrain", "satellite"],
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            scaleControl: false,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            rotateControl: true
        });

        // Crea l'input field di ricerca
        const input = document.getElementById("addressInput");
        const searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        map.addListener("bounds_changed", () => {
            searchBox.setBounds(map.getBounds());
        });

        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();
            places.forEach((place) => {
                if (!place.geometry || !place.geometry.location) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                if (places.length == 0) {
                    return;
                };
                addMarkerFromPlace(places);
            });
        });


        map.addListener("dblclick", addMarker);
    });

    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPKEY}&libraries=places`;
});

function addMarkerFromPlace(place) {
    if (Object.keys(marker).length !== 0 && marker.constructor !== Object) {
        return removeMarker();
    }

    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: place[0].geometry.location,
    });

    console.log(place);
    getAddress(place[0].geometry.location);
    marker.addListener("dblclick", dblClickMarker);

    google.maps.event.addListener(marker, 'dragend', function (marker) {
        getAddress(marker.latLng);
    });
    map.setCenter(marker.latLng);
    map.panTo(marker.getPosition());
}

function addMarker(ev) {
    if (Object.keys(marker).length !== 0 && marker.constructor !== Object) {
        return removeMarker();
    }

    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: {
            lat: ev.latLng.lat(),
            lng: ev.latLng.lng()
        }
    });
    getAddress(ev.latLng);
    marker.addListener("dblclick", dblClickMarker);

    google.maps.event.addListener(marker, 'dragend', function (marker) {
        getAddress(marker.latLng);
    });
}

function removeMarker() {
    marker.setMap(null);
    marker = {};
    document.getElementById("address").innerHTML = '';
}

function getAddress(latLng) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latLng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            document.getElementById("address").innerHTML = results[0].formatted_address;
            console.log(results[0].formatted_address);
        } else {
            document.getElementById("address").innerHTML = status;
        }
    });
}

function dblClickMarker(ev) {
    removeMarker();
}

