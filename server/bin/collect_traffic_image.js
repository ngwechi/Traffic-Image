var loopback = require("loopback");
var app = require('../server');

var Trafficdb = app.models.Trafficdb;

var Trafficapi = app.models.Trafficapi;


//while(true){
  var runApp = function()
  {
    Trafficapi.getTrafficImage(function(err,data){
      if(err) throw err;
      
      images = processAPI(data);
    
      isDuplicateImage(images, function(err,result){
        if(err) throw err;
   
         if(!result) {
           insertImage({"value":images},function(err,result)
           {
             if(err) throw err;
   
             if(result){
               console.log('Successfully save');
             }else console.log('Fail to Save');
             setTimeout(function() {
              console.log('complete');
               runApp();
               
             }, 60000);
           });
         } else {
           console.log("duplicate");
         setTimeout(function() {
          console.log('complete');
           runApp();
           
         }, 60000);
        }
      });
      
    });
  }

//}

runApp();
var processAPI = function(data)
{
  return data.value.map(function(camera){
    link = camera.ImageLink.split('/');
    return {
     'coordinate': {type:"Point",coordinates:[ camera.Longitude,camera.Latitude]},
     'image':camera.ImageLink,
     'cameraID':camera.CameraID,
     'date':link[4]+" "+link[5]
    };
  });

}

var isDuplicateImage = function(data, cb)
{
 
  Trafficdb.find({'where':{'value.date':data[0].date}},function(err,result){
    if(err){
       cb(err,null);
      }
     
    if(result.length)
     cb(null,true);
    else cb(null,false);
  });
}

var insertImage = function (data,cb){
    
    if(data){
      Trafficdb.create(data, function(err, data) {
        if (err)
          cb(err,null);
        cb(null,true);
      });
    }else{
      cb(null,false);
      }

};
