const db = require('./db');
const templateModule = require('./template');
const url = require('url');
const qs = require('querystring');

exports.home = function(request, response) {
  db.query('SELECT * FROM topic', (error, topic) =>{
  const title = 'Welcome';
  const description = 'Hello, Node.js';
  const list = templateModule.List(topic);
  const template = templateModule.HTML(title, list, `<h2>${title}</h2>${description}`, `<a href = create>Create</a> <a href = ./authors>author</a>`);

  response.writeHead(200);
  response.end(template);
  });
}

exports.page = function(request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  db.query('SELECT * FROM topic', (error, topic) => {
    if(error) {
      throw error;
    }
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id =?`, [queryData.id], (error, topic) => {
      if(error) {
        throw error;
      }
        const title = topic[0].title;
        const description = topic[0].description;
        const list = templateModule.List(topic);
        const template = templateModule.HTML(title, list, 
          `
          <h2>${title}</h2>
          ${description}
          <p>${topic[0].name}</p>
          `, 
          `<a href = create>Create</a>
            <a href = /update?id=${queryData.id}>Update</a>
            <form action = 'delete_process' method = 'post'>
              <input type = 'hidden' name ='id' value = '${queryData.id}'>
              <input type = 'submit' value = 'delete'>
            </form>
          `);

        response.writeHead(200);
        response.end(template);
    })
  });
}

exports.create = function (request, response) {
  db.query('SELECT * FROM topic', (error, topic) =>{
    db.query('SELECT * FROM author', (error, authors) =>{
      const title = 'Create';
      const list = templateModule.List(topic);
      const template = templateModule.HTML(title, list,
    ` 
      <form action = 'create_process' method = 'post'>
        <input type = 'text' name = 'title' placeholder = 'title'>
        <input type = 'textarea' name ='description' placeholder = 'description'>
        ${templateModule.authorSelect(authors)}
        <input type = 'submit' name = 'submit'>
      </form>`,
      `<a href = '/create'>create</a>`
    );
    response.writeHead(200);
    response.end(template);
    })
  });
}

exports.createPage = function (request, response) {
    let body = '';

    request.on('data', (data) => {
        body += data;
    });

    request.on('end', () => {
      const post = qs.parse(body);

        db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, now(), ?)`,
        [post.title, post.description, post.author],
        (error, result) => {
          if(error) {
            throw error;
          }
          response.writeHead(302, {Location: `/?id=${result.insertId}`});
          response.end();
        }
      )
    });
}

exports.update = function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  db.query('SELECT * FROM topic', (error, topic) => {
    if(error) {
      throw error;
    }
    db.query(`SELECT * FROM topic WHERE id =?`, [queryData.id], (error, topic) => {
      if(error) {
        throw error;
      }
      db.query('SELECT * FROM author', (error, authors) => {
      const list = templateModule.List(topic);
      const template = templateModule.HTML(topic[0].title, list, 
        
      `
      <form action = 'update_process' method = 'post'>
        <input type = 'hidden' name = 'id' value = '${topic[0].id}''>
        <input type = 'text' name = 'title' placeholder = 'title' value = ${topic[0].title}>
        <input type = 'textarea' name ='description' placeholder = 'description' value = ${topic[0].description}>
        <p>
          ${templateModule.authorSelect(authors,topic[0].author_id)}
        </p>
        <input type = 'submit' name = 'submit'>
      </form>
      `,
      `<a href = "create">Create</a> <a href ="update?id=${topic[0].id}">Update</a>`);
    response.writeHead(200);
    response.end(template);
      })

    });
  });
}

exports.updatePage = function(request, response) {
  let body = '';

  request.on('data', (data) => {
    body += data;
  });

  request.on('end', () => {
    const post = qs.parse(body);

    db.query('UPDATE topic SET title = ?,  description = ?, author_id = ? WHERE id = ?', [post.title, post.description, post.author, post.id],
    (error, result) => {
      if(error) {
        throw error;
      }
      response.writeHead(302, {Location: `/?id=${post.id}`});
      response.end();
    });
  });
}

exports.delete = function(request, response) {
  let body = '';

  request.on('data', (data) => {
    body += data;
  });

  request.on('end', () => {
    const post = qs.parse(body);

    db.query('DELETE FROM topic WHERE id = ?', [post.id], (error, result) =>{
      if(error) {
        throw error;
      }

      response.writeHead(302, {Location: `/`});
      response.end();
    });
  });
}