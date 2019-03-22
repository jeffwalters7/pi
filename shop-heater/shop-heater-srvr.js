var clearRequire = require('clear-require');
var bodyParser = require('body-parser');
var express = require('express');
var cron = require('node-cron');
var gpio = require('rpi-gpio');
var async = require('async');
var cors = require('cors');
var fs = require('fs');
var app = express();

pins=
[
  {"pin":"37"},
  {"pin":"38"},
  {"pin":"40"}
]

pins1=
[
  {"pin":"36"},
  {"pin":"11"}
]


data=pins;
data1=pins1;

app.use(express.static('shop-heater'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send(pins);
  res.statusCode=200;
  res.end();
});

app.get('/temp', function (req, res) {
  //var tempF = require('./shop-heater/temperature.json');
  var tmp = require('./shop-heater/temperature.js');
  res.send(JSON.stringify(tmp.tempF));
  clearRequire('./shop-heater/temperature.js');
  res.statusCode=200;
  res.end();
});

app.get('/getStatus', function(req, res) {
  buildStatus(function(err, statdata) {
    if (err) {
    } else {
      res.statusCode = 200;
      res.json(statdata);
    }
  });
});


//------------------Set zone manually-------------------------
app.post('/manual', function (req, res) {
  var man = req.body;
     if(man.length==1){
       turnPinOn(man[0].pin);
      }else{
        turnPinOff(lastOn);
      }
      res.statusCode=200;
      res.end();
});

function startExpress(callback) {
  var server = app.listen(5922, function() {
    var host = server.address().address;
    var port = server.address().port;
    callback(null);
  });
}

function reRun(callback) {
  async.each(
    pins,
    function iterator(pinobj, arrayCallback) {
      gpio.setup(pinobj.pin, gpio.DIR_HIGH, arrayCallback);
    },
    callback
  );
}

function reRun1(callback) {
  async.each(
    pins1,
    function iterator(pinobj, arrayCallback) {
      gpio.setup(pinobj.pin, gpio.DIR_OUT, arrayCallback);
    },
    callback
  );
}

//--------for Pi hat relay board---------------
function setRelays(){
  async.eachSeries(
      pins,
        function iterator(pinobj, arraycallback) {
        turnPinOff(pinobj.pin);
        arraycallback(null);
        },
        function() {
        }
  );
}

function cycleBegin(){
  async.eachSeries(
      pins,
        function iterator(pinobj, arraycallback) {
        turnPinOn(pinobj.pin);
        setTimeout(function() {
          turnPinOff(pinobj.pin);
          arraycallback(null);
        }, pinobj.delayBeforeOff*60000);
      },
      function() {
        logger.info('<-----END----->');
      }
  );
}

function turnPinOn(pin) {
  gpio.write(pin, false, function(err) {
    if (err) throw err;
    lastOn=pin;
  });
}

function turnPinOff(pin) {
  gpio.write(pin, true, function(err) {
    lastOn=pin;
    if (err) throw err;
  });
}

function buildStatus(callback) {
  var statData = [];
  async.eachSeries(
    pins,
    function iterator(pinobj, arrayCallback) {
      gpio.read(pinobj.pin, function(err, value) {
        if (err) {
          arrayCallback(err);
        } else {
          statData.push(value);
          //console.log(statData);
          arrayCallback(null);
        }
      });
    },
    function wrapUp(err) {
      if (callback) {
        if (err) {
          callback(err);
        } else {
          callback(null, statData);
        }
      }
    }
  );
}

(function startup() {
  async.series(
    [
      function(seriesCallback) {
        reRun(seriesCallback);
      },
      function(seriesCallback) {
        reRun1(seriesCallback);
      },
      function(seriesCallback) {
        startExpress(seriesCallback);
      },
      /*function(seriesCallback) {
        setRelays(seriesCallback);
      },*/
    ],
    function(err) {
      if (err) {
        //console.log(err);
      }
    }
  );
}());
