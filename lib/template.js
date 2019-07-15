var sanitizeHTML = require('sanitize-html');
module.exports = {
  HTML:function(title, list, body, control, loginStatusUI=`<a href="/auth/login">login</a>`){
    return `
    <!doctype html>
    <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <div>${loginStatusUI}</div>
        <a href="/author">author</a>
        ${list}
        ${control}
        ${body}
      </body>
    </html>
    `;
  },list:function(results){
    var list = '<ul>';
    var i = 0;
    while(i < results.length){
      list = list + `<li><a href="/topic/${results[i].id}">${sanitizeHTML(results[i].title)}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },SelectAuthor:function(authors, author_id){
    var tag='<select name ="author">'
    for(var i=0;i<authors.length;i++){
      var selected='';
      if(authors[i].id === author_id){
        selected =' selected';
      }
      tag +=`<option value="${authors[i].id}"${selected}>${sanitizeHTML(authors[i].name)}</option>`
    }
    tag +='</select>'
    return tag;
  },AuthorTable:function(authors){
    tag =`<style>
    table{
      border-collapse:collapse;
      border:1px solid black;
    }
    </style>`
    tag += `<table border="1"><thead><td>Name</td><td>email</td></thead>`
    for(var i=0;i<authors.length;i++){
      tag+=`<tr><td>${sanitizeHTML(authors[i].name)}</td><td>${sanitizeHTML(authors[i].email)}</td>
      </tr>`;
    }
    tag+='</table>';
    return tag;
  },
  loginUI:function(req,res){
    var fmsg = req.flash();
    var feedback='';
    if(fmsg.error){
      feedback = fmsg.error[0];
    }
    return `
    <!doctype html>
    <html>
        <head>
        <meta charset="utf-8">
        <title> Login </title>
        <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
        <form class="box" action="/auth/login_process" method="post">
            <h1>Login</h1>
            <div style="color:red">${feedback}</div>
            <input type="text" name="id" placeholder="Username">
            <input type="password" name="password" placeholder="Password">
            <input type="submit" value="Login">
        </form>
        </body>
    </html>`
  },
  signUpUI:function(){
    return `<!doctype html>
    <html>
        <head>
        <meta charset="utf-8">
        <title> Sign Up </title>
        <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
        <form class="box" action="/auth/signUp_process" method="post">
            <h1>Sign Up</h1>
            <input type="text" name="id" placeholder="UserID">
            <input type="password" name="password" placeholder="Password">
            <input type="password" name="password2" placeholder="Confirm password">
            <input type="text" name="name" placeholder="name">
            <input type="submit" value="Sign up">
        </form>
        </body>
    </html>`
  }
}
