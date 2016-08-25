var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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

module.exports = Todo;
