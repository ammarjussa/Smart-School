const express = require('express');
const http = require('http');
const path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// provide static files
app.use(express.static(path.join(__dirname,'client/build')))

//production mode
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    //
    app.get('*', (req, res) => {
      res.sendfile(path.join(__dirname = 'client/build/index.html'));
    })
  }
  //build mode
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/public/index.html'));
  })

require('./routes/route')(app);

const port = process.env.PORT || 8080;

app.listen(port, ()=> {
    console.log(`Listening on port ${port}`);
});


module.exports = app;