const express = require('express');
const router = express.Router()
const SpeechController = require('../../src/controllers/SpeechController')

router.get('/speech', SpeechController.speech)

module.exports = router