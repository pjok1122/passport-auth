var template = require('./template');
var db = require('./db');
var sanitizeHTML = require('sanitize-html');
var auth = require('../lib/auth');

exports.home=function(request,response){
  db.query('SELECT * FROM topic', function(err1, topics){
    if(err1) throw err1;
    db.query('SELECT * from author', function(err2,authors){
      if (err2) throw err;
      var title = 'Author List';
      var description =template.AuthorTable(authors);
      var list = template.list(topics);
      var loginStatusUI = auth.loginStatusUI(request,response);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        ``, loginStatusUI
      );
      response.send(html);
    });
  });
}
exports.createProcess=function(request,response){
  var post= request.body;
  db.query(`INSERT INTO author(name, profile) VALUES(?,?)`, [post.name, post.profile],
  function(err, result){
    if(err) throw err;
    response.redirect(`/author`);
  });
}
exports.update=function(request,response){
  db.query('SELECT * FROM author WHERE id=?', [request.params.authorId],function(err,author){
    if(err) throw err;
    db.query('SELECT * FROM topic', function(err1, topics){
      if(err1) throw err1;
      db.query('SELECT * from author', function(err2,authors){
        if (err2) throw err;
        var title = 'Author List';
        var description =template.AuthorTable(authors);
        description += `<form action="/author/update_process" method="post">
        <p><input type="hidden" name="id" value="${author[0].id}"></p>
        <p><input type="text" name="name" value="${sanitizeHTML(author[0].name)}"></p>
        <p><textarea name="profile">${sanitizeHTML(author[0].profile)}</textarea></p>
        <p><input type="submit" value="Update"</p>
        </form>`;
        var list = template.list(topics);
        var loginStatusUI = auth.loginStatusUI(request,response);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          ``, loginStatusUI
        );
        response.send(html);
      });
    });
  });
}

exports.deleteProcess=function(request,response){
  var post = request.body;

  db.query('DELETE FROM topic WHERE author_id=?', [post.id], function(err1,result){
    if(err1) throw err1;
    db.query('DELETE FROM author WHERE id=?', [post.id],function(err2,result2){
      if(err2) throw err2;
      response.redirect('/author');
    });
  });
}

exports.updateProcess=function(request,response){
  var post = request.body;
  db.query('UPDATE author SET name=?, profile=? WHERE id=?',[post.name, post.profile, post.id],
  function(err, result){
    if(err) throw err;
    response.redirect('/author');
  });
}