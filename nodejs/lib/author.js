const db = require('./db');
const templateModule = require('./template');
const url = require('url');
const qs = require('querystring');

exports.home = function(request, response) {
  db.query('SELECT * FROM topic', (error, topic) => {
    if(error) {
      throw error;
    }

    db.query('SELECT * FROM author', (error, authors) => {
      if(error) {
        throw error;
      }

      const title = 'author';
      const list = templateModule.List(topic);
      const template = templateModule.HTML(title, list,
      `
        ${templateModule.authorTable(authors)}
        <style>
          table {
            border-collapse: collapse;
          }

          td {
            border: 1px solid black;
          }
        </style>
        <form action = 'authors_create' method = 'post'>
          <input type = 'text' name = 'name' placeholder = 'Input Name'>
          <input type = 'text' name = 'profile' placeholder = 'Input Profile'>
          <input type = 'submit' value = 'Create'>
        </form>
      `
      ,
      ``);
      response.writeHead(200);
      response.end(template);
      });
    });
}

exports.create = function(request, response) {
      let body = '';

      request.on('data', (data) => {
        body += data;
      });
      
      request.on('end', () => {
        const post = qs.parse(body);
        db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`,
        [post.name, post.profile],
        (error, authors) => {
          if(error) {
            throw error;
          }
          response.writeHead(302, {Location: `/authors`});
          response.end();
          }
        )
      });
}

exports.delete = function(request, response) {
  let body = '';

  request.on('data', (data) => {
     body += data;
  });

  request.on('end', () => {
    const post = qs.parse(body);
    db.query('DELETE FROM topic WHERE author_id = ?', [post.id], (error, topic) => {
      if(error) {
        throw error;
      }

      db.query('DELETE FROM author WHERE id = ?', [post.id], (error, result) =>{
        if(error) {
          throw error;
        }
        response.writeHead(302, {Location: `/authors`});
        response.end();
      });
    });
  });
}

exports.update = function(request, response) {

  db.query('SELECT * FROM topic', (error, topic) => {
    if(error) {
      throw error;
    }
    db.query(`SELECT * FROM author`, (error, authors) => {
      const _url = request.url;
      const queryData = url.parse(_url, true).query;
      if(error) {
        throw error;
      }
      const title = 'author';
      const list = templateModule.List(topic);
      const template = templateModule.HTML(title, list, 
        
        `${templateModule.authorTable(authors)}
        <style>
            table{
                border-collapse: collapse;
            }
            td{
                border:1px solid black;
            }
        </style>
        <form action="/authors_update_process" method="post">
            <p>
                <input type="hidden" name="id" value="${queryData.id}">
            </p>
            <p>
                <input type="text" name="name" value="${authors[0].name}" placeholder="name">
            </p>
            <p>
                <textarea name="profile" placeholder="description">${authors[0].profile}</textarea>
            </p>
            <p>
                <input type="submit" value="update">
            </p>
        </form>`,
        ``
      );
    response.writeHead(200);
    response.end(template);
      });
    });
}

exports.update_process = function(request, response) {
  let body = '';

  request.on('data', (data) => {
    body += data;
  });

  request.on('end', () => {
    const post = qs.parse(body);

    db.query('UPDATE topic SET name = ?,  profile = ?, WHERE id = ?', [post.name, post.profile, post.id],
    (error, result) => {
      if(error) {
        throw error;
      }
      response.writeHead(302, {Location: `/authors`});
      response.end();
    });
  });
}