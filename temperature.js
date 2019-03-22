var sensor= require('ds18x20');
var garage = '10-0008037aa2ff';
var shop = '28-0114328ea9cf';

var temp= sensor.get(shop);
//var tmp = sensor.get(garage);

exports.tempF=(temp*9)/5+32;
//exports.tmp=(tmp*9)/5+32;