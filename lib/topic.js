var template = require('./template');
var db = require('./db');
var sanitizeHTML = require('sanitize-html');
var auth = require('../lib/auth');

exports.home = function(req,res){
  var fmsg = req.flash();
  var feedback='';
  if(fmsg.error){
    feedback = fmsg.error[0];
  }
  db.query('SELECT * from topic', function(err,results){
    if (err) throw err;
    var title = 'Welcome';
    var description = 'Hello, Node.js' + `<br><div style="color:red; font-size:45px;">${feedback}</div>`;
    var list = template.list(results);
    var loginStatusUI = auth.loginStatusUI(req,res);
    var control = auth.loginControlUI(req,res);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      control , loginStatusUI
    );
    res.send(html);
  });
}
exports.page = function(req,res){
  //If an unauthorized user access to "/topic/adsfa", how can i do ?
  db.query(`select * from topic left join author on topic.author_id = author.id
      where topic.id =?;`,[req.params.topicId], function(err,topic){ //security aspect..
    if(err) throw err;
    if(!topic[0]){
      req.flash('error', `That page doesn't exist!`);
      return res.redirect('/');
    }
    db.query('SELECT topic.id id,title,description, author_id from topic inner join author on topic.author_id = author.id', function(err2,topics){
      if (err2) throw err2;
      var list = template.list(topics);
      var loginStatusUI = auth.loginStatusUI(req,res);
      //상당히 구린 코드. 어떻게 수정할지 생각중..
      auth.loginControlUI(req,res, req.params.topicId,function(control){
        var html = template.HTML(sanitizeHTML(topic[0].title), list,
        `<h2>${sanitizeHTML(topic[0].title)}</h2>${sanitizeHTML(topic[0].description)}
        <p>by ${sanitizeHTML(topic[0].name)}</p>
        ${sanitizeHTML(topic[0].created)}`,
        control, loginStatusUI
        );
      res.send(html);
      });
    });
  });
}

exports.create=function(req,res){
  if(!auth.checkUser(req,res)){
    return res.redirect('/');
  }
  db.query('SELECT * from topic', function(err,topics){
    if(err) throw err;
    var title = 'WEB - create';
    var list = template.list(topics);
    var loginStatusUI = auth.loginStatusUI(req,res);
    var html = template.HTML(title, list,  `
    <form action="/topic/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p><textarea style ="width:300px; height:200px;" name="description" placeholder="description"></textarea></p>
      <p><input type="submit"></p>
    </form>`, '',loginStatusUI);
    res.send(html);
  });
}

exports.createProcess=function(req,res){
  var post = req.body;
  db.query(`INSERT INTO topic(title, description, created,author_id)
      VALUES(?,?,NOW(),?)`,[post.title, post.description, req.user.author_id], function(err, result){
      if(err) throw err;
      res.redirect(`/topic/${result.insertId}`);
  });
}

exports.update= function(req,res){
  db.query(`SELECT * from topic where id=?`,[req.params.topicId], function(err, topic){
    if (err) throw err;
    if(topic[0].author_id !== req.user.author_id){
      req.flash('error', `That's not yours !`);
      return res.redirect('/');
    }
    db.query('SELECT * from topic', function(err2,topics){
      if(err2) throw err2;
      var list = template.list(topics);
      var html = template.HTML(sanitizeHTML(topic[0].title), list,
      `
      <form action="/topic/update_process" method="post">
        <input type="hidden" name="id" value="${topic[0].id}">
        <p><input type="text" name="title" placeholder="title" value="${sanitizeHTML(topic[0].title)}"></p>
        <p><textarea name="description" placeholder="description">${sanitizeHTML(topic[0].description)}</textarea></p>
        <p><input type="submit"></p>
      </form>
      `,
      ``, ``
      );
      res.send(html);
    });
  });
}
exports.updateProcess=function(req,res){
  var post = req.body;
  db.query(`SELECT * from topic where id=?`,[post.id], function(err, topic){
    if (err) throw err;
    if(topic[0].author_id !== req.user.author_id){
      req.flash('error', `That's not yours !`);
      return res.redirect('/');
    }
  });
  db.query(`UPDATE topic SET title=?, description=?, created=NOW(), author_id =? WHERE id=?`,[post.title, post.description, req.user.author_id, post.id], function(err, result){
      if(err) throw err;
      res.redirect(`/topic/${post.id}`);
  });
}

exports.deleteProcess = function(req,res){
  db.query(`SELECT * from topic where id=?`,[req.params.topicId], function(err, topic){
    if (err) throw err;
    if(topic[0].author_id !== req.user.author_id){
      req.flash('error', `That's not yours !`);
      return res.redirect('/');
    }
  });
  db.query(`DELETE FROM topic WHERE id=?`, [req.params.topicId],function(err,result){
    res.redirect('/');
  });
}