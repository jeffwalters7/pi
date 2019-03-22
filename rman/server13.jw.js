var express = require('express');
var cors = require('cors');
var bodyParser= require('body-parser');
var gpio = require('rpi-gpio');
var cron = require('node-cron');
var async = require('async');
var fs = require('fs');
var log4js = require("log4js");
var app = express();

days = [];
days = require('./rman/days.json');
dow=days;

var pins = require('./rman/pinstest.json');
data=pins;

var hhmm = require('./rman/hrsMins.json');
hm=hhmm;

//-----------------Set up logger----------------------------
log4js.configure({
  appenders: [
	            /*{
	            	type: "console"
	            },*/
	            {
	            	type: "file",
	            	filename: "test.log",
	            	category: "server13.jw.js",
                        maxLogSize: 1792
	            }
    	]
});
var logger = log4js.getLogger("server13.jw.js");
logger.setLevel("INFO");
//--------------------End logger setup------------------------


app.use(express.static('client'));
app.use(express.static('gpio'));
app.use(cors());
app.use(bodyParser.json());


app.get('/', function (req, res) {
  res.send(data);
  res.statusCode=200;
  res.end();
});

app.get('/week', function (req, res) {
  res.send(days);
  res.statusCode=200;
  res.end();
});

app.get('/log', function(req, res) {
  res.download(__dirname + './rman/test.log', 'test.log');
});


app.get('/log1', function(req, res) {
  res.download(__dirname + './rman/test.log.1', 'test.log.1');
});

app.get('/temp', function (req, res) {
  var sensor = require('ds18x20');
  var temp = sensor.get('10-0008037aa2ff');
  var tempF = (temp*9)/5 + 32;
  //console.log(tempF);
  res.send(JSON.stringify(tempF));
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

//---------------Receive Zone operating parameters------------
app.post('/zones', function (req, res) {
  rxdata=req.body;
  fs.writeFile('pinstest.json', JSON.stringify(rxdata));
  data=rxdata;   //--New zone parameters-----//
  reRun(); //Restart GPIO setup
  res.statusCode=200;
  res.end();
});

//----------------Receive days of the week -------------------
app.post('/days', function (req, res) {
  days=req.body;
  dow=[];
  for (i = 0;i < days.length; i++){
    dow.push(parseInt(days[i]));
  }
  fs.writeFile('days.json', JSON.stringify(dow));
  res.statusCode=200;
  res.end();
});

//------------------Set zone manually-------------------------
app.post('/manual', function (req, res) {
  var man = req.body;
     if(man.length==1){
       //console.log("True enough");
         turnPinOn(man[0].pin);
         //var lastOn = man[0].pin;
       }else{
         //console.log("False it would seem");
             turnPinOff(lastOn);
             //reRun();
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

//--------------Original Rain Man 3000 GPIO code -----------------------
//-------------- By: Jason Walters (Node-Ninja) ------------------------
//----------------------------------------------------------------------
cron.schedule('*/1 * * * *', function(){
  var n= new Date();
  var dt= n.getDay();
  var h= n.getHours();
  var m = n.getMinutes();

   if (dow.includes(dt) && h==data[0].strt && m==data[1].strt){
       logger.info("<----BEGIN---->");
        cycleBegin();
   }
});

function reRun(callback) {
  async.each(
    pins,
    function iterator(pinobj, arrayCallback) {
      gpio.setup(pinobj.pin, gpio.DIR_OUT, arrayCallback);
    },
    callback
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
  gpio.write(pin, true, function(err) {

    if (err) throw err;
      lastOn=pin;
      logger.info("GPIO #"+pin+" is ON!")
  });
}

function turnPinOff(pin) {
  gpio.write(pin, false, function(err) {
    if (err) throw err;

    });
}

function manualPinOff() {
  gpio.destroy(function() {
     reRun();
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
        startExpress(seriesCallback);
      }
    ],
    function(err) {
      if (err) {
        //console.log(err);
      }
    }
  );
}());
