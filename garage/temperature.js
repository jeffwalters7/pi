var sensor= require('ds18x20');
var garage = '10-0008037aa2ff';
var shop = '28-0114328ea9cf';

var temp = sensor.get(shop);
//----convert to farenheit; 1 digit resolution----
var ShopTemp=((temp*9)/5+32).toFixed(1);
//var tmp = sensor.get(shop);
//var GarageTemp=((temp*9)/5+32).toFixed(1);


module.exports = [ShopTemp];

