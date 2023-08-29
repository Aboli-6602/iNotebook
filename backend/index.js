const connectToMongo = require("./db");
const express = require('express');
const bodyParser = require('body-parser')
const cors = require("cors");
const https = require("https");
require('dotenv').config();


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

const apiKey = process.env.NEWSLETTER_API_KEY;
//"45b3a79c9389f53d71fd12a91e9a3775-us9";
const listId = process.env.NEWSLETTER_LIST_ID;

app.post("/newsletter", (req, res)=> {      // from user to our website
   console.log("reached backend");
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
      members: [
          {
              email_address: email,
              status: "subscribed",
              merge_fields: {
                  FNAME: firstName,
                  LNAME: lastName
              }
          }
      ]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://us9.api.mailchimp.com/3.0/lists/"+listId;
  const options = {
      method: "POST",
      auth: "aboli:"+apiKey,
  }

  const request = https.request(url, options, function(response){   // from our server to mailchimp
      response.on("data", function(data){
          console.log(JSON.parse(data));
      })

      if(response.statusCode === 200){
        res.send("success")
          // res.sendFile(__dirname + "/success.html");
      }
      else{
        res.send("failure")
          // res.sendFile(__dirname +"/failure.html");
      }
  })

  request.write(jsonData);
  request.end();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})