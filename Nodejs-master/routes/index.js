const express = require('express');
const router = express();
const template = require('../lib/template');

router.get("/", (request, response) => {
  const title = "Welcome";
  const description = "Hello Node Js + Express";
  let list = template.list(request.list);
  let html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}
      <img src = 'image/hello.jpg' style = 'width: 500px; display: block; margin: 10px;'>`,
    `<a href = '/topic/create'>Create</a>`
  );
  response.send(html);
});

module.exports = router;