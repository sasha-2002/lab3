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
MongoClient.connect(mongoUrl).then(function(client) {
    mongo = client.db();
}).catch(error => console.log(error.message));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


app.get('/l', function(req, res) {
    let code = req.param('id');
    mongo.collection("urls").findOne({url_code: code.toString}, function(err, doc){
        res.redirect(doc.main_url);
    });
});

app.post('/click', urlencodedParser, function (request, response) {
    let random_code = generation_code();
    mongo
    .collection('urls')
    .insertOne({
      main_url: request.body.input,
      url_code: random_code
    })
    .then(function() {
      console.log('Запис створено');
    });
    
    response.render('output', { url: "http://localhost:3000/l?id="+random_code });
});

function generation_code(){
    return 1;
}


app.listen(3000, function() {
    console.log('App started on http://localhost:3000');
});