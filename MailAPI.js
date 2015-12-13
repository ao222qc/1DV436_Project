var arrayOfLocations = [];

//var mailArray = [];

var mailAPI = {
  
  mailArray:[],
  
  LabelPath: 'Location/',
    
  CLIENT_ID:'45160109899-ng4tv1u1jiefd6kt065ui26apunoipip.apps.googleusercontent.com',

  SCOPES:['https://www.googleapis.com/auth/plus.me','https://mail.google.com/'],
    
    callback: function(){
        
        console.log("called back! ");
    },
    
   checkAuth:function() 
   {
       gapi.auth.authorize(
      {
        'client_id': mailAPI.CLIENT_ID,
        'scope':  mailAPI.SCOPES.join(' '),
        'immediate': false
      },  mailAPI.handleAuthResult);
  },


  /**
   * Handle response from authorization server.
   *
   * @param {Object} authResult Authorization result.
   */
  handleAuthResult:function(authResult)
  {
    var authorizeDiv = document.getElementById('authorize-div');
    
    if (authResult && !authResult.error)
    {
      // Hide auth UI, then load client library.
      authorizeDiv.style.display = 'none';
      mailAPI.loadGmailApi();
    } 
    else
    {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
      authorizeDiv.style.display = 'inline';
    }
  },

  handleAuthClick:function(event)
  {
       gapi.auth.authorize(
      {client_id: mailAPI.CLIENT_ID, scope: mailAPI.SCOPES, immediate: false},
      mailAPI.handleAuthResult);
    return false;
  },

  loadGmailApi:function()
  {
    gapi.client.load('gmail', 'v1', mailAPI.listLabels);
  },
  
  //Recieves label that contains "Location/" and retrieves subject title, content and adds this and the location name to an object.
  getMailContent:function(label)
  {
        var request = gapi.client.gmail.users.messages.list(
            {
            'userId':"me",
            'labelIds': label.id
            });
           
         request.execute(function(Response)
         { 
               for (var j = 0; j < Response.messages.length; j++)
               {
                 
                     var getMailsRequest = gapi.client.gmail.users.messages.get({'userId': 'me', 'id':Response.messages[j].id});
                     
                     getMailsRequest.execute(function(mailResponse)
                     {
                         //http://stackoverflow.com/questions/24745006/gmail-api-parse-message-content-base64-decoding-with-javascript
                         
                         // - Shoutout to stackoverflow.
                         
                         var data = mailResponse.payload.parts[1].body.data;
                         
                         data = window.atob(data.replace(/-/g, '+').replace(/_/g, '/') ); 
                        
                         var mailObject =
                            {
                                 MailContent: data,
                                 Header: mailResponse.payload.headers[16].value,
                                 Location: label.name.substring(mailAPI.LabelPath.length),
                             };
                             
                             MapAPI.placeMarker(mailObject);

                     });
                     
               }
               
         });
      
  },


//Gets the labels from the gmail inbox, picks out the ones that contain "Location".
//Sends that label to function that gets the mail content.
  listLabels:function() 
  {
    var request = gapi.client.gmail.users.labels.list({
      'userId': 'me'
    });

    request.execute(function(resp) 
    {
      var labels = resp.labels;
      
      if (labels && labels.length > 0)
      {
         
        for (var i = 0; i < labels.length; i++)
        {
            var label = labels[i];

            if(label.name.indexOf(mailAPI.LabelPath) > -1)
            {
    
                mailAPI.getMailContent(label);
                
            }
          //MapAPI.SetListOfLocations(label.name.substring(mailAPI.LabelPath.length));
         
        }
        

    
        
      } 
             program.InitiateMapMarkers();
    });
    
  },
  
  appendPre:function(message)
  {
    
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
   // pre.appendChild(textContent);
  }
}

/* if(label.name.indexOf(mailAPI.LabelPath) > -1)
          {
            
             var request = gapi.client.gmail.users.messages.list({'userId':"me",'labelId':'label.id'});
           
             request.execute(function(Response)
             { 
                   for (var j = 0; j < Response.messages.length; j++)
                   {
                     
                     var getMailsRequest = gapi.client.gmail.users.messages.get({'userId': 'me', 'id':Response.messages[j].id});
                     
                     getMailsRequest.execute(function(mailResponse)
                     {
                         mailAPI.mailArray.push(
                             {
                                 Snippet:mailResponse.snippet,
                                 Header: mailResponse.payload.headers[16].value
                             });
                                        
                     });
                     
                   }

                 
             });
             
             
            
          }*/