const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017/lab3';
const domen = 'http://localhost:3000';
const urlencodedParser = bodyParser.urlencoded({extended: false});

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/public'));


let mongo;
let counter_global;

MongoClient
    .connect(mongoUrl, {useUnifiedTopology: true})
    .then(function(client) {
      mongo = client.db();
      mongo
          .collection('urls')
          .findOne({id: 'main_counter'}, function(err, doc) {
            counter_global = doc.counter;
          });
    }).catch((error) => console.log(error.message));


app.get('/', function(request, response) {
  response.render('index', {url: '', m_url: ''});
});


app.get('/:id', function(request, response) {
  const code = request.params.id;
  mongo.collection('urls')
      .findOne({url_code: Number(code)}, function(err, doc) {
    doc != null ? response.redirect(doc.main_url) : response.render('invalid');
      });
});

app.post('/', urlencodedParser, function(request, response) {
  // eslint-disable-next-line max-len
  if (request.body.input.match(/https?:\/\/[^\s]+/g) != null && request.body.input != '') {
    counter_global++;
    mongo.collection('urls')
        .updateOne(
            {id: 'main_counter'},
            {$set: {counter: counter_global}},
        );

    mongo.collection('urls')
        .insertOne({
          url_code: counter_global,
          main_url: request.body.input,
        })
        .then(function() {
          console.log('Запис створено');
        });

    response.render('index',
        {url: domen + '/' + counter_global, m_url: request.body.input});
  } else {
    response.render('invalid');
  }
});

app.get('*', function(req, res) {
  res.render('not_found');
});

app.listen(3000, function() {
  console.log('App started on '+ domen);
});

