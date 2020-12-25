const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require('helmet');
app.use(helmet());

const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.get("*", (request, response, next) => {
  fs.readdir("./data", (error, filelist) => {
    request.list = filelist;
    next();
  });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);

app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));

