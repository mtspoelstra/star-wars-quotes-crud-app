const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();



MongoClient.connect('mongodb+srv://mtspoelstra:Iamabundance31@cluster0.uhvkidj.mongodb.net/?retryWrites=true&w=majority', {useUnifiedTopology: true})
    .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars')
    const quotesCollection = db.collection('quotes')
    
    app.set('view engine', 'ejs')
   

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
    

        db.collection('quotes').find().toArray()
            .then(results => {
                res.render('index.ejs', { quotes: results })
            })

            .catch(error => console.error(error))
    })

    

    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')
            })
            .catch(error => console.error(error))


    })

    app.put('/quotes', (req, res) => {
        // console.log(req.body)
        quotesCollection.findOneAndUpdate(
            { name: 'Yoda' },
            {
              $set: {
                name: req.body.name,
                quote: req.body.quote
              }
            },
            {
              upsert: true
            }
          )
            .then(result => {
                res.json('Success')
            })
            .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
            {name: "Darth Vader"},
          )
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No quote to delete')
                }
                res.json('Deleted Darth Vadars quote')
            })
            .catch(error => console.error(error))
    })

    app.listen(3000, function(){
        console.log('listening on port 3000')
})

  })
  .catch(error => console.error(error))




