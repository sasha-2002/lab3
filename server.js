const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017/lab3';
const urlencodedParser = bodyParser.urlencoded({extended: false});

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/public'));


let mongo;
let counter_global;

MongoClient.connect(mongoUrl, { useUnifiedTopology: true }).then(function(client) {
    mongo = client.db();
    mongo.collection("urls").findOne({id: "main_counter"}, function (err, doc){
        counter_global = doc.counter;
    });
}).catch(error => console.log(error.message));




app.get('/', function(request, response) {
    response.render('index', { url: "",  m_url: ""});
});


app.get('/l', function(request, response) {
    
    let code = request.query.id;
    console.log("req.query.id ");
    console.log(code);
    mongo.collection("urls")
    .findOne({url_code: Number(code)}, function(err, doc){
        if(doc) {
            response.redirect(doc.main_url);
            
        }
        else {
            response.render('invalid');
        }
        
    }); 
    
});

app.post('/', urlencodedParser, function (request, response) {
    if(request.body.input.match(/https?:\/\/[^\s]+/g) != null && request.body.input != '') {
        counter_global++;
        mongo.collection("urls").updateOne(
            {id: "main_counter"}, 
            { $set: {counter: counter_global}}
        );

        mongo.collection('urls')
        .insertOne({
            url_code: counter_global,
            main_url: request.body.input
        })
        .then(function() {
            console.log('Запис створено');
        });
        
        response.render('index', { url: "http://localhost:3000/l?id="+counter_global, m_url: request.body.input});
    }
    else {
        response.render('invalid')
    }
    
});



app.get('*', function(req, res) {

    res.render('not_found');
});



app.listen(3000, function() {
    console.log('App started on http://localhost:3000');
});

