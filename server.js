let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

var express = require('express');
var app = express();
const server =  app.listen(port);
app.use(express.static('public'));
console.log("My server is running");
