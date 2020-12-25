const http = require('http');
const url = require('url');
const topic = require('./lib/topic');
const { authorSelect } = require('./lib/template');
const author = require('./lib/author');

const app = http.createServer((request,response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        topic.home(request, response);
      } else {
        topic.page(request,response);
      }
      } else if(pathname === '/create') {
        topic.create(request, response);
      } else if(pathname === '/create_process') {
        topic.createPage(request, response);
      } else if(pathname === '/update') {
        topic.update(request, response);
      } else if(pathname === '/update_process') {
        topic.updatePage(request, response);
      } else if(pathname === '/delete_process') {
        topic.delete(request, response);
      } else if(pathname === '/authors') {
        author.home(request, response);
      } else if(pathname === '/authors_create') {
        author.create(request, response);
      } else if(pathname === '/authors_update') {
        author.update(request, response);
      } else if(pathname === '/authors_update_process') {
        author.update_process(request, response);
      } else if(pathname === '/authors_delete') {
        author.delete(request, response);
      }
      else {
      response.writeHead(404);
      response.end('Not found');
      }
  });
app.listen(3000);
