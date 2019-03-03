var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb+srv://admin0:admin@cluster0-8tyfi.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })

//Create a chema - this is like a blueprint
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);
// var itemOne = Todo({item: 'buy flowers'}).save(function(err){
//     if(err) throw err;
//     console.log('item saved');
// });

// var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];
var urlencodeParser = bodyParser.urlencoded({extended: false});

module.exports = function (app){

    app.get('/todo', function(req, res) {
        //get data from mongodb and pass it to view
        Todo.find({}, function(err, data) {
            if(err) throw err;
            res.render('todo', {todos: data});

        });
    });

    app.post('/todo', urlencodeParser, function(req, res) {
        //get data from the view and add it to mongodb
        var newTodo = Todo(req.body).save(function(err, data){
            if(err) throw err;
            res.json(data);
        });
        // data.push(req.body);
        // console.log(data);
    });

    app.delete('/todo/:item', function(req, res) {
        //delete the requested item from mongodb
        Todo.find({item: req.params.item.replace(/\-/g," ")}).remove(function(err, data) {
            if(err) throw err;
            res.json(data);
        });
        // console.log(req.params.item);
        // data = data.filter(function(todo){
        //     return todo.item.replace(/ /g, '-') !== req.params.item;
        // });
        
        // console.log(data);
        // res.json(data);
    });
};