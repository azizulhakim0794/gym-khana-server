const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hsgbd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()
app.use(bodyParser.json())
app.use(cors());
const port = 5000;
app.get('/', (req, res) => {
  res.send("hello from db it's working working")
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const personCollection = client.db("jym-khana").collection("joinedPerson");
    const exerciseCollection = client.db("jym-khana").collection("exersice-item");

  app.get('/trainingItem',(req, res) => {
    exerciseCollection.find({})
    .toArray((err , documents) => {
        res.send(documents)
    })
  })
  app.post('/ourClass',(req, res) => {
    const id = req.body.id
    exerciseCollection.find({_id:ObjectId(id)})
        .toArray((err , document) => {
        res.send(document[0])
    })
  })
  app.post('/addPerson',(req, res) => {
    const data = req.body.data
    personCollection.insertOne(data)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })
  app.post('/myOrders', (req, res) => {
    const email = req.body.email;
    personCollection.find({userEmail: email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
// 
})

app.listen(process.env.PORT || port)