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

let mongo;
let counter_global;


MongoClient.connect(mongoUrl, { useUnifiedTopology: true }).then(function(client) {
    mongo = client.db();
    mongo.collection("urls").findOne({id: "main_counter"}, function (err, doc){

        counter_global = doc.counter;
        
    });
    
}).catch(error => console.log(error.message));

app.get('/', function(request, response) {
    //response.render('index', { url: " ",  m_url: " "});
    response.sendFile(path.join(__dirname + '/index.html'));
});


app.get('/l', function(request, response) {
    
    let code = request.query.id;
    console.log("req.query.id ");
    console.log(code);
    mongo.collection("urls").findOne({url_code: Number(code)}, function(err, doc){
        console.log(doc);
        response.redirect(doc.main_url);
    }); 
});

app.post('/', urlencodedParser, function (request, response) {
    counter_global++;
    mongo.collection("urls").updateOne(
        {id: "main_counter"}, 
        { $set: {counter: counter_global}}
    );

    console.log("code " + counter_global);

    mongo
    .collection('urls')
    .insertOne({
      url_code: counter_global,
      main_url: request.body.input
    })
    .then(function() {
      console.log('Запис створено');
    });
    
    response.render('index', { url: "http://localhost:3000/l?id="+counter_global, m_url: request.body.input});
    //response.render('output', { url: "http://localhost:3000/l?id="+counter_global });
});

app.listen(3000, function() {
    console.log('App started on http://localhost:3000');
});

