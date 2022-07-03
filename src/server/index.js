var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
const fetch = require('node-fetch')
const FormData = require('form-data')
const dotenv = require('dotenv')
dotenv.config()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const app = express()

const port = 8083

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})

app.post('/meaningApi', function (request, response){
    console.log("run post route");
    const formdata = new FormData();
    formdata.append("key", process.env.API_KEY);
    formdata.append("txt", request.body.text);
    formdata.append("lang", "en");  // 2-letter code, like en es fr ...
    console.log(formdata)

    const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    const responseApi = fetch("https://api.meaningcloud.com/sentiment-2.1", requestOptions)
        .then(response => {
            let body = response.json();
            console.log(body);
            return body;
        })
        .then(body => {
            const polarity = body.agreement;
            const irony = body.irony;
            const subjectivity = body.subjectivity;
            const textSnippet = body.sentence_list[0].text;

            apidata = {
                polarity,
                irony,
                subjectivity,
                textSnippet
            }
            console.log(apidata);
            response.send(apidata)
        })

        .catch(error => console.log('error', error));
});