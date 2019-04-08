const SpeechController = {}
const apiAdapter = require('../api/apiAdapter')

const baseURL = 'http://localhost:8088'
const api = apiAdapter(baseURL)

SpeechController.speech = (req, res) => {
    res.send(req.path + " called")
    // api.get(req.path).then(resp => {
    //     res.send(resp.data)
    // })
}

module.exports = SpeechController