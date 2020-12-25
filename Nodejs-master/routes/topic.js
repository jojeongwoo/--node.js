const express = require("express");
const router = express.Router();
const fs = require("fs");
const template = require("../lib/template");
const sanitizeHtml = require("sanitize-html");
const path = require("path");


router.get("/create", (request, response) => {
  const title = "WEB - create";
  let list = template.list(request.list);
  let html = template.HTML(
    title,
    list,
    `
        <form action="/topic/create_process" method="post">
          <p>
            <input type="text" name="title" placeholder="title">  
          </p>
  
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
  
          <p>
            <input type="submit">
          </p>
        </form>
      `,
    ""
  );

  response.send(html);
});

router.post("/create_process", (request, response) => {
  const post = request.body;
  const title = post.title;
  const description = post.description;
  fs.writeFile(`data/${title}`, description, "utf8", (error) => {
    response.redirect(`/topic/${title}`);
  });
});

router.get("/update/:pageId", (request, response) => {
  const filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", (error, description) => {
    const title = request.params.pageId;
    const list = template.list(request.list);
    const html = template.HTML(
      title,
      list,
      `
        <form action="/topic/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
      `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
    );
    response.send(html);
  });
});

router.post("/update_process", (request, response) => {
  const post = request.body;
  const id = post.id;
  const title = post.title;
  const description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, (error) => {
    fs.writeFile(`data/${title}`, description, "utf8", (error) => {
      response.redirect(`/topic/${title}`);
    });
  });
});
``;

router.post("/delete_process", (request, response) => {
  const post = request.body;
  const id = post.id;
  const filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    response.redirect("/");
  });
});

router.get("/:pageId", (request, response, next) => {
  const filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", (error, description) => {
    if (error) {
      next(error);
    } else {
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ["h1"],
      });
      var list = template.list(request.list);
      var html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/topic/create">create</a>
              <a href="/topic/update/${sanitizedTitle}">update</a>
              <form action="/topic/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`
      );
      response.send(html);
    }
  });
});

module.exports = router;