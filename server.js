const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
const fs = require("fs");

const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017/lab3';
const urlencodedParser = bodyParser.urlencoded({extended: false});

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

let mongo;

//const mongoClient = new MongoClient(mongoUrl, { useUnifiedTopology: true });

MongoClient.connect(mongoUrl, { useUnifiedTopology: true }).then(function(client) {
    mongo = client.db();
    
}).catch(error => console.log(error.message));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


app.get('/l', function(req, res) {
    
    let code = req.query.id;
    console.log("req.query.id ");
    console.log(code);
    mongo.collection("urls").findOne({url_code: Number(code)}, function(err, doc){
        console.log(doc);
        res.redirect(doc.main_url);
    }); 
});

app.post('/click', urlencodedParser, function (request, response) {
    let u_code_ = generation_code();
    
    console.log(u_code_);
    mongo
    .collection('urls')
    .insertOne({
      url_code: u_code_,
      main_url: request.body.input
    })
    .then(function() {
      console.log('Запис створено');
    });
    
    
    response.render('output', { url: "http://localhost:3000/l?id="+u_code_ });
});

function generation_code(){//todo
    let i = 0;
    /*mongo.collection("urls").findOne({id: "main_counter"}, function(err, doc){
        i = doc.counter;
        i++;
        mongo.collection("urls").updateOne(
            {id: "main_counter"}, 
            { $set: {counter: i}}
        );
    });*/
    return 0;                 
}


app.listen(3000, function() {
    console.log('App started on http://localhost:3000');
});

/*
{
    "id": "main_counter",
    "counter": 0
}
*/