var express = require('express');
var router = express.Router()
var speechRoute = require('./routes/speechRoute')

router.use((req, res, next) => {
    console.log("Called: ", req.path)
    next()
})

router.use(speechRoute)

module.exports = router