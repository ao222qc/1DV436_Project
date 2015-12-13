var loc;
var latitude;
var longitude;
var map;
var latlng;
var jsonLocation;
var arrayOfAddresses = [];
var arrayOfmails = [];

var MapAPI =
{
    
    sayHello:function()
    {
        alert("hello");        
    },
    
    initMap:function()
    {
        map = new google.maps.Map(document.getElementById('map'),
        {
            center: {lat: 15.5, lng:0.0},
            zoom: 2
        });
    },
    
    
    placeMarker:function(mailObject)
    {
        
        var geocoder = new google.maps.Geocoder();
        
        var address = mailObject.Location;
            
            geocoder.geocode( { 'address': address}, function(results, status)
            {
                if (status == google.maps.GeocoderStatus.OK) 
                {
                    
                    loc = results[0].geometry.location;
                      
                    latitude = loc.lat();
                    
                    longitude = loc.lng();
                    
                    
                     var contentString = '<div id="content">'+
                          '<h1 id="firstHeading" class="firstHeading"> ' + mailObject.Header + '</h1>'+
                          '<div id="bodyContent">'+
                          '<p>' + mailObject.MailContent +'</p>'+
                          '</div>'+
                          '</div>';
        
                    var marker = new google.maps.Marker(
                    {
                        position: {lat: Number(latitude), lng: Number(longitude)},
                        map:map,
                        animation: google.maps.Animation.DROP,
                        title: mailObject.Header
                    });
                    
                     var infowindow = new google.maps.InfoWindow(
                    {
                        content: contentString
                    });
                    
                    marker.addListener('click', function()
                    {
                        infowindow.open(map, marker);
                    });
                    
                   marker.setMap(map);
                
                }
                else
                {
                    setTimeout(function()
                        {
                            MapAPI.placeMarker(mailObject);
                        }, 5);
                }
               
            });
    }
    
};

    