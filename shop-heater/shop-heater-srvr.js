var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser= require('body-parser');

app.use(express.static('client'));
app.use(express.static('gpio'));
app.use(cors());
app.use(bodyParser.json());


app.get('/temp', function(req, res) {
  var sensor = require ('ds18x20');
  var temp = sensor.get('10-0008037aa2ff');
  var tempF = (temp * 9) / 5 + 32;
  res.send(JSON.stringify(tempF));
  console.log("Temperature is: "+ tempF);
  res.statusCode=200;
  res.end();
  });

app.listen(5922);
