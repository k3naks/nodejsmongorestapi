var http = require("http");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var Todo = require('./db');
var config = require('config');


var app = express();
app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/templates');
app.set('view engine' , 'ejs');

app.use(bodyParser.json());

var server = app.listen(config.get('port'), function () {
   var port = server.address().port;
   console.log("App now running on port", port);
});

function handleError(res, reason, message, code) {
   console.log("ERROR: " + reason);
   res.status(code || 500).json({"error": message});
}

app.get('/', function (req, res, next) {
   res.render('index', { title : 'Template Title'})
});

app.get("/todos", function(req, res, next) {
   Todo.find(function (err, todos) {
      if (err) return next(err);
      res.json(todos);
   });
});

app.get('/todos/:id', function(req, res, next) {
   Todo.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
   });
});

app.post('/todos', function(req, res, next) {
   Todo.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
   });
});

app.put('/todos/:id', function(req, res, next) {
   Todo.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
   });
});

app.delete('/todos/:id', function(req, res, next) {
   Todo.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
   });
});

app.use(express.static(path.join(__dirname,'public')));
app.use(function (req, res, next) {
   var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
   console.log('Client IP:', ip);
   next();
});