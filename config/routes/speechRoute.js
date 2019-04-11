const express = require('express');
const router = express.Router()
const SpeechController = require('../../src/controllers/SpeechController')

router.get('/speech', SpeechController.speech)
router.get('/info', SpeechController.info)

module.exports = router