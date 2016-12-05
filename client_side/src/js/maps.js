

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.7745457, lng:-96.7804983 }, //NOTE: centers Dallas, TX
    zoom: 10
  });
  var input = /** @type {!HTMLInputElement} */(
    document.getElementById('goog_address'));
  var street_number = /** @type {!HTMLInputElement} */(
    document.getElementById('street_number'));
  var route = /** @type {!HTMLInputElement} */(
    document.getElementById('route'));
  var city = /** @type {!HTMLInputElement} */(
    document.getElementById('city'));
  var county = /** @type {!HTMLInputElement} */(
    document.getElementById('county'));
  var state = /** @type {!HTMLInputElement} */(
    document.getElementById('state'));
  var zipcode = /** @type {!HTMLInputElement} */(
    document.getElementById('zipcode'));

  var location_being_changed;

  var options = {
    types: ['address']
  }

  var autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.bindTo('bounds', map);  //defaults to searching in the current map view

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  //TODO: look into better handling of pressing ENTER while inputting an address
  google.maps.event.addDomListener(input, 'keydown', function (e) {
    if (e.keyCode === 13) {
      if (location_being_changed) {
        e.preventDefault();
        e.stopPropagation();
      }
    } else {
      // means the user is probably typing
      location_being_changed = true;
    }
  });

  if(input.value){
    google.maps.event.trigger(autocomplete, 'place_changed');
  }

  function handleAddress() {
    infowindow.close();
    marker.setVisible(false);
    location_being_changed = false;

    var place = autocomplete.getPlace();
    //parse address
    console.log(place.address_components)
    var address_components = place.address_components;
    address_components.forEach(function(component) {
      if(component.types.indexOf("street_number") !== -1)
        street_number.value=component.short_name
      else if(component.types.indexOf("route") !== -1)
        route.value=component.short_name
      else if(component.types.indexOf("locality") !== -1)
        city.value=component.short_name
      else if(component.types.indexOf("administrative_area_level_2") !== -1)
        county.value=component.short_name
      else if(component.types.indexOf("administrative_area_level_1") !== -1)
        state.value=component.short_name
      else if(component.types.indexOf("postal_code") !== -1)
        zipcode.value=component.short_name
    })


    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent(address);
    infowindow.open(map, marker);
  }

  autocomplete.addListener('place_changed', handleAddress);
}

// //HACK: replace or remove
// function ensureMap(){
//   if(!mapInitialized && (typeof window.google !== 'object' || typeof window.google.maps !== 'object')){
//     setTimeout(ensureMap, 500)
//   }
//   else if(!mapInitialized){
//     initMap()
//   }
// }

// setTimeout(ensureMap, 500)
