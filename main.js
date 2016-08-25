var http = require("http");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var config = require('config');


var app = express();
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
mongoose.Promise = global.Promise;


// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect('mongodb://localhost:27017/todoAppTest');
// Create a schema
var TodoSchema = new mongoose.Schema({
   name: String,
   completed: Boolean,
   note: String,
   updated_at: { type: Date, default: Date.now }
});
// Create a model based on the schema
var Todo = mongoose.model('Todo', TodoSchema);

var callback = function (err, data) {
   if (err) { return console.error(err); }
   else { console.log(data); }
};

/*Todo.create({name: 'Create something with Mongoose', completed: true, note: 'this is one'}, function(err, todo){
   if(err) console.log(err);
   else console.log(todo);
});*/

Todo.find(function (err, todos) {
   if (err) return console.error(err);
   console.log(todos)
});

var server = app.listen(config.get('port'), function () {
   var port = server.address().port;
   console.log("App now running on port", port);
});

function handleError(res, reason, message, code) {
   console.log("ERROR: " + reason);
   res.status(code || 500).json({"error": message});
}

app.use(function (req, res, next) {
   var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
   console.log('Client IP:', ip);
   next();
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

/*var todo = new Todo({name: 'Master NodeJS', completed: false, note: 'Getting there...'});
// Save it to database
todo.save(function(err){
   if(err)
      console.log(err);
   else
      console.log(todo);
});*/

/*http.createServer(function (request, response) {

   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(8081);*/

// Console will print the message
//console.log('Server running at http://127.0.0.1:8081/');