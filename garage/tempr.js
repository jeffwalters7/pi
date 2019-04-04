
var sensor = require('ds18x20');
var async = require('async');
var fs = require('fs');
var id =
[
    {'id':'28-0114328ea9cf'},
    {'id':'28-0114328ea9cf'}
]

setInterval(goTmp, 30000);

function goTmp() {
    var tempF=[];
    async.eachSeries(
      id,
      function iterator(id, callback) {
          var temp = sensor.get(id.id);
          var tempF1 = ((temp*9)/5+32).toFixed(1);
          tempF.push(tempF1);
          setTimeout(() => {
              fs.writeFile('./temperature.json', JSON.stringify(tempF));
          }, 500);
          callback(null);

       }
    );
}



