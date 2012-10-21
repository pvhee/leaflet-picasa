$(function() {

  L.MarkerClusterGroup.prototype._defaultIconCreateFunction = function (childCount) {
  	var c = ' marker-cluster-';
  	if (childCount < 5) {
  		c += 'small';
  	} else if (childCount < 50) {
  		c += 'medium';
  	} else {
  		c += 'large';
  	}

  	return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
  }


  // $("#remove-items").click(function() {
  //   Gallery.removeItems();
  // 
  //   // var $new  = $('<li><a href="#"><img src="images/thumbs/7.jpg" data-large="images/7.jpg" alt="image01" data-description="From off a hill whose concave womb reworded" /></a></li>');
  //   // Gallery.addItems( $new );
  // 
  // 
  // });





  var maxZoomPerClick = 4; 

// $("#full_image").hide();

  var map = L.map('leaflet-map', {minZoom: 1, maxZoom: 17}).setView([51.505, -0.09], 4);
  var markers = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    maxClusterRadius: 30
  });
  var bounds = [];
  var markers_raw = [];    
    
  L.tileLayer('http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png32', {
    // minZoom: 5,
    // maxZoom: 18,
    attribution: 'Map tiles by <a href="http://mapbox.com">Mapbox</a>'
  }).addTo(map);


  var json_Album_URI = "https://picasaweb.google.com/data/feed/base/"
              // + "user/"       +   "garsybuzz/"
              + "user/"       +   "109750673638535496225/"
              + "albumid/"    +   "5716360188091683297" 
              // + "albumid/"    +   "5716364246392855137" // Flower Tower
              // + "albumid/"    +   "5550916844194049793" 

              + "?alt="       +   "json"
              + "&kind="      +   "photo";
            
// var json_Album_URI = "http://local/picasa/picasa.json";

  $.getJSON(json_Album_URI,
    function(data){
    
      var nrGeo=0, total=0;
      $.each(data.feed.entry, function(i,item) {
        total++;
        // Only draw pictures with geo information attached
        if(item.hasOwnProperty("georss$where")) {
          nrGeo++;
        
          // fetch location
          var ll = item.georss$where.gml$Point.gml$pos.$t.split(" ");
          var latlng = L.latLng(ll[0], ll[1]);
        
          // create marker with a custom icon
          var m = L.marker(latlng, {icon: L.divIcon({ html: '<div><span>1</span></div>', className: 'marker-cluster marker-cluster-single', iconSize: L.point(40, 40) })});
          markers_raw.push(m);
        
          // store properties away for later retrieval
          m.picasa = {
            description: item.media$group.media$description.$t,
            images: {
              image : item.media$group.media$content[0],
              thumbnail_small : item.media$group.media$thumbnail[0],
              thumbnail_medium : item.media$group.media$thumbnail[1]
            }
          };
          
          markers.addLayer(m);
        
          // add to carousel
          
          // @todo: we should just be adding everything to the html - once that's done we fire up elastislide, not before
          
          
          _fillElastislide(m.picasa);
          // console.log('filling elastislide');
        
        }
      });
    
      // Add markers to the map
      map.addLayer(markers);




  });

  // Add the images to the slider
  function _fillElastislide(m) {    
    var img_url = '<img src="' + m.images.thumbnail_small.url + '" data-large="' + m.images.image.url + '"/>';
    var html = "<li><a href='#'>" + img_url + "</a></li>";
    var $new = $(html);
    Gallery.addItems($new);   
  }
  
  // On cluster hover put the pics of the cluster in the slider
	markers.on('clusterclick', function (a) {
    Gallery.removeItems();
    
    // Put all the images from the cluster in the slider
    $.each(a.layer.getAllChildMarkers(), function (i, m) {
      _fillElastislide(m.picasa);
    });
    
    Gallery.reload();
	});
	
	// On single point click, zoom in, but in batches
  markers.on('click', function(m) {
    // Zoom in batches
    var currentZoom = map.getZoom(), toZoom = map.getMaxZoom(), zoom = toZoom;
    if (toZoom - currentZoom > maxZoomPerClick) {
      zoom = currentZoom + maxZoomPerClick;
    }
    map.setView(m.layer.getLatLng(), zoom);
  });


});