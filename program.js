

var program =
{

    Initiate:function(event)
    {
        mailAPI.handleAuthClick(event);
            //mailAPI.listMessages("me", null, null);
    },
    
    InitiateMapMarkers:function()
    {
        
        MapAPI.placeMarker();
    }

        
};