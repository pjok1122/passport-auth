var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options ={
    host: '',
    port: 3306,
    user: '',
    password: '',
    database: ''
};

var sessionStore = new MySQLStore(options);

module.exports = sessionStore;