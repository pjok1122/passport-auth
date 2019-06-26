var auth = require('../lib/auth');
var express = require('express');
var router = express.Router();

module.exports = function(passport){
    router.get('/login', function(req,rsp){
        auth.home(req,rsp);
    });
    router.post('/login_process', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
        }) 
    );
    router.get('/signUp', function(req,rsp){
        auth.signUp(req,rsp);
    });
    router.post('/signUp_process', function(req,rsp){
        auth.signUp_process(req,rsp);
    })
    router.get('/logout', function(req,res){
      req.logout();
      res.redirect('/');
    })
    return router;
}