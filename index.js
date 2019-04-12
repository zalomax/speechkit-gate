const express = require('express');
const app = express();
const router = require('./config/router')
const bodyParser = require('body-parser');
const cors = require('cors')
// const server_options = {
//     key: fs.readFileSync(keys_dir + 'privatekey.pem'),
//     ca: fs.readFileSync(keys_dir + 'certauthority.pem'),
//     cert: fs.readFileSync(keys_dir + 'certificate.pem')
// }

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send("Simple API Gateway")
})

app.use(router)

console.log("Simple API Gateway run on localhost:3000")

app.listen(3000);