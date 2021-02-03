var mongoose = require('mongoose');
let accountShema = mongoose.Schema({
    username: String,
    password: String
});
let Account = module.exports = mongoose.model('Account',accountShema);