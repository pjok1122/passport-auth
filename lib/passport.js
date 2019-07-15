db = require('../lib/db');
bcrypt = require('bcrypt');
module.exports = function(app){
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    app.use(passport.initialize());
    app.use(passport.session());

    //Session 관리
    passport.serializeUser(function(user, done) {             
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        db.query(`select member.id as id, name, author_id from member inner join author on member.author_id = author.id where member.id=?`, [id], function(err,user){
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
    googleCredentials = require('../config/google.json');
    
    passport.use(new GoogleStrategy({
        clientID: googleCredentials.web.client_id,
        clientSecret: googleCredentials.web.client_secret,
        callbackURL: googleCredentials.web.redirect_uris[0]
      },
      function(accessToken, refreshToken, profile, done) {
        db.query('Select id from member where id=?', [profile.id], function(err,user){
            if(err) throw err;
            if(user[0]){
                done(null, user[0]);
            }
            else{
                db.query('Insert into author(name,email) values(?,?)', [profile.displayName, profile.emails[0].value], function(err2, result){
                    if(err2) throw err2;
                    var hash = String(Math.random()); //패스워드는 의미없으므로 랜덤하게 저장한다.
                    db.query('Insert into member(id, password, author_id) values(?,?,?)',[profile.id, hash,result.insertId],function(err3, result3){
                        if(err3) throw err3;
                        done(null, result3[0]);
                    });
                });
            }
        });
    }));

    //auth/google로 이동했을 때, google으로 redirect 시켜줌.
    app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','email'] }));

   //authorization code를 받는 주소(authorized redirect url)로 들어왔을 때!
    app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    function(req, res) {
        res.redirect('/');
    });
    return passport;
}