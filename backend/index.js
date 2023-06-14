const connectToMongo = require("./db");
const express = require('express');
const bodyParser = require('body-parser')
const cors = require("cors");



connectToMongo();

const app = express();
app.use(express.json()); // ********************so that we can send data in application/json format***************************
app.use(bodyParser.urlencoded({ extended: true }));
const port = 5000;
app.use(cors());

// Available Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/notes', require('./routes/notes.js'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})