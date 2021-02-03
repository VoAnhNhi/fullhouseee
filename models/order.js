const { Int32 } = require('mongodb');
var mongoose = require('mongoose');

let orderShema =   mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    email: String,
    totalcost: String,
    year: String,
    month: String,
    day:String,
    date: String,
    time: String,
    dateTime:String
});
let Orders = module.exports = mongoose.model('Orders',orderShema);
