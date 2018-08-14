//setup04
var express= require('express');
var app=express();
var mongoose=require('mongoose');
var morgan= require('morgan');
var bodyParser=require('body-parser');
var methodOverride= require('method-override');


// config

mongoose.connect('mongodb://saqib:pakistan12@ds121652.mlab.com:21652/tddapi');


app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());



//model
var Todo= mongoose.model('Todo',{
    text: String ,
    done: Boolean ,
    description: String
});



//routes-----

//appi
// api ---------------------------------------------------------------------
    // get all todos
    app.get('/todo/api/v1.0/tasks/', function(req, res) {

        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });
    //get by id
    app.get('/todo/api/v1.0/tasks/:task_id',function(req,res){
        Todo.findById(req.params.task_id, function(err,todo){
                if(err)
                    res.send(err);
                res.json(todo);
        });
    });

    // create todo and send back all todos after creation
    app.post('/todo/api/v1.0/tasks/', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text : req.body.text,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

    //update 
    app.put('/todo/api/v1.0/tasks/:task_id', function(req,res){
        Todo.findById(req.params.task_id,function(err,todo){
            if(err)
                res.send(err);
            todo.text=req.body.text;
            todo.save(function(err,updatedTodo){
                if(err)
                    res.send(err);
                res.send(updatedTodo);
            });
        });
    });

    // delete a todo
    app.delete('/todo/api/v1.0/tasks/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });


//application
app.get('*',function(req,res){
  res.sendfile('./public/index.html');
});




//start
let port = process.env.PORT || process.argv[2] || 8080;
app.listen(port);
console.log("I am up on 8000");
