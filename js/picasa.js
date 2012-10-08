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


$("#remove-items").click(function() {
  Gallery.removeItems();
  
  // var $new  = $('<li><a href="#"><img src="images/thumbs/7.jpg" data-large="images/7.jpg" alt="image01" data-description="From off a hill whose concave womb reworded" /></a></li>');
  // Gallery.addItems( $new );
  
  
});





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
        console.log(m);
        markers_raw.push(m);
        
        // store properties away for later retrieval
        m.picasaProperties = {
          description: item.media$group.media$description.$t,
          images: {
            image : item.media$group.media$content[0],
            thumbnail_small : item.media$group.media$thumbnail[0],
            thumbnail_medium : item.media$group.media$thumbnail[1]
            // image : {
            //   url: "http://local/picasa/Zhang_neural_stem_cell1_01.jpg",
            //   width: 700,
            //   height: 400,
            // },
            // thumbnail_small : {
            //   url: "http://local/picasa/Zhang_neural_stem_cell1_01.jpg",
            //   width: 144,
            //   height: 97,
            // },
            // thumbnail_medium : {
            //   url: "http://local/picasa/Zhang_neural_stem_cell1_01.jpg",
            //   width: 144,
            //   height: 97,
            // },
          }
        };
        
        // console.debug(picasaProperties);
        
        
        // add to carousel
        _fillElastislide(m.picasaProperties);
        
        
      }
    });
    
    //var $new  = $('<li><a href="#"><img src="images/thumbs/7.jpg" data-large="images/7.jpg" alt="image01" data-description="From off a hill whose concave womb reworded" /></a></li>');
  	//Gallery.addItems( $new );


    function _fillElastislide(m) {
      var thumbnail = m.images.thumbnail_medium;
      // var img_url = "<img src='" + thumbnail.url + "' width='" + thumbnail.width + "' height='" + thumbnail.height + " data-large=" + m.images.image.url + " data-description='Whatever joske'/>";
      var img_url = "<img src='" + thumbnail.url + "' data-large=" + m.images.image.url + " alt='image01' data-description='Whatever joske'/>";
      
      
      
      // items += "<li><a href='#'>" + img_url + "</a></li>";
      // $('.carousel-list').append("<li><a href='#'>" + img_url + "</a></li>");
      // $('.carousel-list').append("<li img_full='" + m.picasaProperties.images.image.url + "'><a class='group1' href='#' title='whatever really'>" + img_url + "</a></li>");
      
      
      // <li><a href="#"><img src="images/thumbs/7.jpg" data-large="images/7.jpg" alt="image07" data-description="Tearing of papers, breaking rings a-twain" /></a></li>
      
      var html = "<li><a href='#'>" + img_url + "</a></li>";
      var $new = $(html);
      Gallery.addItems($new);
      
      //$('.carousel-list').append("<li><a href='#'>" + img_url + "</a></li>");        
    }

    // Add images to the slider
    function _bindElastislide(rebind) {
      console.log("bind elasti");
      
      if (rebind === true) {
        $('#carousel').elastislide('destroy');
      }

      $('#carousel').elastislide({
        imageW 	: 180,
  			minItems	: 5,
        onClick: function( $item ) {
          $('#map').hide();
          $('#full_image').empty().append("<img src='" + $item.attr("img_full") + "'/>").show().click(function () {
            $(this).hide();
            $('#map').show();
    		  });

    		  // Which cluster am I in??
          // console.log($item);


           // new L.Icon.Default()
          // _showFullImage($item);
          // console.log(markers_raw[1]);
          // markers_raw[1].openPopup();
        }
      });
    }
    // console.log("Total pics: " + total + " - Geotagged pics: " + nrGeo);
    // Add markers to the map
    // map.addLayer(markers);
    
    // // Fit map to bounds
    // if (bounds.length > 0) {
    //   map.fitBounds(L.latLngBounds(bounds));
    // }
    
    // Add images to the slider
    // _bindElastislide();    
  }
);
});