var loopback = require("loopback");
var app = require('../server');

var Trafficdb = app.models.Trafficdb;

var Trafficapi = app.models.Trafficapi;

Trafficdb.getDataSource().connector.connect(function(err,db){
    var collection = db.collection('Trafficdb');
   collection.find(
        [{
            "value.coordinate":
                {
                    $near:{
                    $geometry:
                        {   
                            coordinates:[103.787,1.426],
                            type:'Point'
                        },
                        $maxDistance:1000
                    }
                }
        },{limit:1},{filter:{id:0,'value.$':1}}]
        ,function(err,doc){
        console.info(doc)
       
    });
});
  



