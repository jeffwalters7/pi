var express = require('../node_modules/express');
var cors = require('../node_modules/cors');
var app = express();
var bodyParser= require('../node_modules/body-parser');
var gpio = require('../node_modules/rpi-gpio');
var cron = require('../node_modules/node-cron');
var async = require('../node_modules/async');
var fs = require('fs');
var log4js = require("../node_modules/log4js");
var sensor = require('../node_modules/ds18x20');
temp = 0;
tempF = 0;

//-----------------Set up logger----------------------------
log4js.configure({
  appenders: [
	            /*{
	            	type: "console"
	            },*/
	            {
	            	type: "file",
	            	filename: "test.log",
	            	category: "rman-srvr.js",
                        maxLogSize: 1792
	            }
    	]
});
var logger = log4js.getLogger("rman-srvr.js");
logger.setLevel("INFO");

var n= new Date();
var dt= n.getDay();
var h= n.getHours();
var days = require('./days.json');
var m = n.getMinutes();
days = [];
days = require('./days.json');
dow=days;

var pins = require('./pinstest.json');
  data=pins;

var hhmm = require('./hrsMins.json');
  hm=hhmm;

app.use(express.static('../rman'));
app.use(express.static('../garage'));

app.use(cors());
app.use(bodyParser.json());

//--------------------Get zone data--------------------------
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
//-----------------Get Log-----------------------------
app.get('/log', function(req, res) {
  res.download(__dirname + './test.log', 'test.log');
});

//-----------------Get Log1----------------------------
app.get('/log1', function(req, res) {
  res.download(__dirname + './test.log.1', 'test.log.1');
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

//---------------Receive Zone operating parameters------------
app.post('/zones', function (req, res) {
  rxdata=req.body;
  fs.writeFile('./pinstest.json', JSON.stringify(rxdata));
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
  fs.writeFile('./days.json', JSON.stringify(dow));
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

//----------------Post start hours & minutes-----------------------

app.post('/hm1', function (req, res) {
   hm = req.body;
   fs.writeFile('./hrsMins.json', JSON.stringify(hm));
   //console.log(JSON.stringify(hm));
   hhmm=hm;
   //scheduleCron();
   res.statusCode=200;
   res.end();
});

function startExpress(callback) {
  var server = app.listen(5922, function() {

    var host = server.address().address;
    var port = server.address().port;

    //console.log("Server13.jw.js listening at http://%s:%s", host, port);
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
  /*console.log(Array.isArray(dow));
  console.log("DOW = "+dow);
  console.log("Day = "+dt);
  console.log("Days = "+days);
  console.log("Hours = "+h);
  console.log("Minutes = "+m);*/
//  console.log("DS = "+ds);
   if (dow.includes(dt) && h==data[0].strt && m==data[1].strt){
       //logger.info("<----Begin---->");
        cycleBegin();
        //logger.info("GPIO #"+pin+" is ON!");
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
        //logger.info('<-----END----->');
      }
    );
  }


/*  if (callback) {
    callback(null);
  }*/



function turnPinOn(pin) {
  gpio.write(pin, true, function(err) {

    if (err) throw err;
      lastOn=pin;
      //logger.info("GPIO #"+pin+" is ON!")
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
     // function(seriesCallback) {
     //   scheduleCron(seriesCallback);
     // },
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
