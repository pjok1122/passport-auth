db = require('../lib/db');
bcrypt = require('bcrypt');
module.exports = function(app){
    var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    //Session 관리
    passport.serializeUser(function(user, done) {             
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        db.query(`select * from member where id=?`, [id], function(err,user){
            if(err) done(err);
            done(null, user[0]);
        });
    });
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password'
        },
        function(id, password, done) {
        db.query(`Select * from member where id=?`, [id], function(err,user){
            if (err) { return done(err); }                                                               
            if (!user[0]) { //undefined
                return done(null, false, { message: 'Incorrect username.' });
            }
            bcrypt.compare(password, user[0].password,function(err,res){
                if(err) done(err);
                if(res){
                    return done(null, user[0]);
                }
                return done(null, false, { message: 'Incorrect password.' });           
            });
        });
    }));
    return passport;
}