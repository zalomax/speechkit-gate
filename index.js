const express = require('express');
const app = express();
const router = require('./config/router')
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const keys_dir = '/etc/ssl/auth.mmkc.su/'
const fs = require('fs')
const https = require('https')
console.log('environment:', process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'development') {
    const server_options = {
        key: fs.readFileSync(keys_dir + 'key.pem'),
        ca: fs.readFileSync(keys_dir + 'chain.pem'),
        cert: fs.readFileSync(keys_dir + 'chain.pem')
    }
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send("Simple API Gateway")
})

app.use(router)

console.log("Simple API Gateway run on localhost:3000")

if (process.env.NODE_ENV !== 'development') {
    https.createServer(server_options, app).listen(7000);
}
app.listen(3000);