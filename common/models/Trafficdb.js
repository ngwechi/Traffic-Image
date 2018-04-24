'use strict';

var loopback = require('loopback');
module.exports = function(Trafficdb) {

    
    
    Trafficdb.remoteMethod('nearLocation',
    {
      accepts:  [
                  {arg: 'lat', type: 'number', required: true},
                  {arg: 'lng', type: 'number', required: true},
                  {arg: 'radius', type:'number', required: false, default:2000},
                  {arg: 'radiusType', type:'string', required: false, default:'meters'}
                ],
      http:     {path: '/nearLocation', verb: 'get'},
      returns:  {arg: 'camera', type: 'Object'}
    });
  
    Trafficdb.nearLocation = function(lat, lng, radius, radiusType, cb){
      var here = new loopback.GeoPoint({lat, lng});
      Trafficdb.find( {
          where: {
              "value.coordinate": { 
                  near: here, maxDistance:radius, unit:radiusType
              }
                }, 
                limit:1,
                filter:{id:0,'value.$':1}
                },
                  function(err, result) {
                        console.info(result); 
                        cb(null, result);
                  }
               );
    }

};
