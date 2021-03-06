var clearRequire = require('clear-require');
var bodyParser = require('body-parser');
var express = require('express');
var cron = require('node-cron');
var gpio = require('rpi-gpio');
var async = require('async');
var cors = require('cors');
var fs = require('fs');
var app = express();

app.use(express.static('../garage'));
app.use(express.static('../rman'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send(allPins);
    res.statusCode=200;
    res.end();
});

app.get('/temp', function (req, res) {
    var tmp = require('../temperature.json');
    res.send(tmp);
    clearRequire('../temperature.json');
    res.statusCode=200;
    res.end();
});

app.get('/getStatus', function(req, res) {
    buildStatus(function(err, data) {
        if (err) {
            } else {
              res.statusCode = 200;
              res.json(data);
            }
    });
});

app.post('/manual', function (req, res) {
    var man = req.body;

        //if(man.length==1 && man[0].pin !==40){
        if(man.length==1){
            turnPinOn(man[0].pin);
        }else{
            turnPinOff(lastOn);
        }

     res.statusCode=200;
     res.end();
});

app.post('/momentary', function (req, res) {
    var man = req.body;
    momentary();
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

ins =
[
    {"pin":"15"},
    {"pin":"16"}
]

function setupInputs(callback) {
    async.each(
        ins,
        function iterator(pinobj, arrayCallback) {
            gpio.setup(pinobj.pin, gpio.DIR_IN, gpio.EDGE_BOTH, arrayCallback);
        },
        callback
    );
}

outs =
[
    {"pin":"22"},
    {"pin":"29"}
]

function setupMiscOuts(callback) {
    async.each(
        outs,
        function iterator(pinobj, arrayCallback) {
            gpio.setup(pinobj.pin, gpio.DIR_OUT, arrayCallback);
          },
          callback
    );
}

relays =
[
    {"pin":"37"},
    {"pin":"38"},
    {"pin":"40"}
]

function setupRelays(callback) {
    async.each(
        relays,
        function iterator(pinobj, arrayCallback) {
            gpio.setup(pinobj.pin, gpio.DIR_HIGH, arrayCallback);
        },
        callback
    );
}

allPins =
[
    {'pin':'15'},
    {'pin':'16'},
    {'pin':'22'},
    {'pin':'29'},
    {'pin':'37'},
    {'pin':'38'},
    {'pin':'40'}
]

data=allPins;

function buildStatus(callback) {
    var statData = [];
    async.eachSeries(
        allPins,
        function iterator(pinobj, arrayCallback) {
            gpio.read(pinobj.pin, function(err, value) {
                if (err) {
                    arrayCallback(err);
                }else {
                    statData.push(value);
                    arrayCallback(null);
                }
            });
        },
     function wrapUp(err) {
          if (callback) {
              if (err) {
                  callback(err);
              }else{
                  callback(null, statData);
              }
          }
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

function redBlink(){
    turnPinOff(22);
    setTimeout(function(){
        turnPinOn(22);
    }, 100);
}

function yelBlink(){
    turnPinOff(29);
    setTimeout(function(){
        turnPinOn(29);
    }, 100);
}

function toggle() {
    turnPinOn(22);
    turnPinOff(29);
    setTimeout(function(){
        turnPinOff(22);
        turnPinOn(29);
    }, 500);
}

function momentary() {
    //pin=40;
    turnPinOn(40);
    //lastOn=pin;
    setTimeout(function(){
        turnPinOff(40);
    }, 500);
}

var redBlinkInterval;
var yelBlinkInterval;
var toggleInterval;
var con = console.log;
var debounced = false;
var channel;


gpio.on('change', function(channel, value) {
    if (debounced === false) {
        debounced = true;
        setTimeout(function (){
            garageDoor();
            debounced = false;
        }, 350);
    }
});


function garageDoor(){
    clearInterval(toggleInterval);
    clearInterval(yelBlinkInterval);
    clearInterval(redBlinkInterval);
    turnPinOn(22);
    turnPinOn(29);
    buildStatus(function(err, data) {
        if(err){
            //throw(err);
        } else {
            if(data[0]==true && data[1]==false){
                redBlinkInterval = setInterval(redBlink, 1500);
            }
            if(data[0]==false && data[1]==true){
              yelBlinkInterval = setInterval(yelBlink, 1500);
            }
            if(data[0]==false && data[1]==false){
              toggleInterval = setInterval(toggle, 1000);
            }
        }
  });
}

(function startup() {
    async.series(
        [
            function(seriesCallback) {
                startExpress(seriesCallback);
            },
            function(seriesCallback) {
                setupInputs(seriesCallback);
            },
            function(seriesCallback) {
                setupRelays(seriesCallback);
            },
            function(seriesCallback) {
                setupMiscOuts(seriesCallback);
            },
            function() {
                garageDoor();
            }
        ],
    function(err) {
        if (err) {
        }
    }
    );
 }());
