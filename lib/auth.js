var template = require('./template');
var db = require('./db');
var bcrypt = require('bcrypt');

exports.home = function(req,rsp){
    rsp.send(template.loginUI(req,rsp));
}
exports.signUp = function(req,rsp){
    rsp.send(template.signUpUI());
}
exports.signUp_process = function(req,rsp){
    var post = req.body;
    db.query('select id from member where id =?', [post.id], function(err,result){
        if(err) throw err;
        if(result[0]===undefined && post.password===post.password2){
            db.query(`INSERT INTO author(name) VALUES(?)`,[post.name],function(err2, result){
                if(err2) throw err2;
                bcrypt.hash(post.password, 10, function(err3,hash){
                    if(err3) throw err3;
                    db.query(`INSERT INTO member(id,password,author_id) VALUES(?, ?, ?)`,[post.id,hash,result.insertId], function(err4, result2){
                        console.log(hash);
                        if(err4) throw err4;
                        db.query('SELECT * from member where id =?', [post.id],function(err5, user){
                            if(err5) throw err5;
                            req.login(user[0], function(err6){
                                if(err6) throw err6;
                                return rsp.redirect('/');
                            });
                        });
                    });
                });
            })    
        }else{
            req.flash('error', 'User information is not correct!');
            return rsp.redirect('/auth/signup');
        }
    });
}

exports.loginStatusUI = function(req,rsp){
    var loginStatusUI = `<p><a href="/auth/login">login</a> | 
    <a href="/auth/signUp">Sign Up</a> | 
    <a href="/auth/google">Login with Google</a></p>`
    if(req.user){
        loginStatusUI = `<p>${req.user.name}님 환영합니다. <a href="/auth/logout">logout</a></p>`
    }
    return loginStatusUI;
}

exports.loginControlUI = function(req,rsp, topicId=undefined,callback){
    var loginControlUI = '';
    if(req.user){
        loginControlUI += `<a href="/topic/create">create</a>`;
    }
    if(topicId ===undefined){
        return loginControlUI;
    } else{
        db.query(`Select * from topic where id=?`,[topicId], function(err,results){
            if(err) throw err;
            if(req.user && results[0].author_id == req.user.author_id){
                loginControlUI +=`  <a href="/topic/update/${topicId}">update</a>
                <form action="/topic/delete_process/${topicId}" method="post">
                <p><input type="submit" value="delete"></p>
                </form>`;
            }
            callback(loginControlUI);
        });
    }
}

exports.checkUser = function(req,res){
    if(!req.user){
        req.flash('error', 'Do not access this section without login !');
        return false;
      }
    else{ return true; }
}