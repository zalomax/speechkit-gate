const {promisify} = require('util');
const {resolve} = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const path = require('path');
const SpeechController = {}
const apiAdapter = require('../api/apiAdapter')
const axios = require('axios')
const FormData = require('form-data');
const request = require('request');

const baseURL = 'http://localhost:8088'
const api = apiAdapter(baseURL)
const oauthToken = "AQAAAAAypLHMAATuwfvBnphEvEeDqmasQOJ_zPI"; // OAuth-токен в сервисе Яндекс.OAuth

// async function getFiles(dir) {
//     const subdirs = await readdir(dir);
//     const files = await Promise.all(subdirs.map(async (subdir) => {
//         const res = resolve(dir, subdir);
//         return (await stat(res)).isDirectory() ? getFiles(res) : res;
//     }));
//     return files.reduce((a, f) => a.concat(f), []);
// }

let crypto;
try {
    crypto = require('crypto');
} catch (err) {
    console.log('crypto support is disabled!');
}

SpeechController.speech = async (req, res, next) => {
    const text = req.query.text
    const project = req.query.project //папка для отдельного проекта, где будут хранится записи
    const entity = req.query.entity || 'uploads' // тип текста (новости - news)
    const id = req.query.id // entity id
    // entity-id-md5.ogg если такой файл сущ - отправить его если нет сделать запрос и создать
    // попытаться прочитать файл с таким именем

    if (!project) {
        console.log('Отсутствует параметр project', project)
        res.sendFile(path.resolve("public/speech.ogg"))
        return
    }
    if (!id) {
        console.log('Отсутствует параметр id', id)
        res.sendFile(path.resolve("public/speech.ogg"))
        return
    }

    if (!text) {
        console.log('Отсутствует text', text)
        res.sendFile(path.resolve("public/speech.ogg"))
        // next()
        return
    }

    const secret = 'abcdefg';
    const hash = crypto.createHmac('md5', secret)
        .update(text)
        .digest('hex');
    console.log('hash ', hash);

    const audioBasePath = 'public/'
    filePathString = audioBasePath + project + "/" + entity + "-" + id + "-" + hash + ".ogg"
    const filePath = path.resolve(filePathString)

    console.log('path.resolve(filePathString) ', filePath)

    if (fs.existsSync(filePath)) {
        console.log('Файл обнаружен ', filePath)
        res.sendFile(filePath)
        return
    }

    console.log('Файл отсутствует ', filePath)
    // надо проверить наличие папки project если таковой нет - создать
    if (!fs.existsSync(path.resolve(audioBasePath + project + "/"))) {
        fs.mkdirSync(path.resolve(audioBasePath + project + "/"));
    }

    const iAMToken = await getIAMToken()
    if (iAMToken.status !== 200) {
        console.log('Статус при получении токена ', iAMToken.status)
        res.sendFile(path.resolve("public/speech.ogg"))
    }
    const speechedText = await getSpeechFile(text, iAMToken.data.iamToken, filePath)

    res.sendFile(filePath)
    return
}

SpeechController.info = (req, res) => {
    // console.log('req', req.query)

    // res.send(req.path + " called")
    res.sendFile(path.resolve("public/speech2.ogg"))
    // api.get(req.path).then(resp => {
    //     res.send(resp.data)
    // })
}

const getIAMToken = async () => {
    const url = "https://iam.api.cloud.yandex.net/iam/v1/tokens";
    try {
        return await axios.post(url, {
            yandexPassportOauthToken: oauthToken,
        })
    } catch (error) {
        console.error(error)
    }
}

const getSpeechFile = (text, iamToken, filePath) => {
    const folderId = "b1g0l1kccj8hvmi1gm09"; // Идентификатор каталога
    const config = {
        headers: {
            'Authorization': "bearer " + iamToken,
            'Content-Type': 'multipart/form-data'
        }
    };
    // var bodyFormData = new FormData();
    var formData = {
        // Pass a simple key-value pair
        text: text,
        lang: 'ru-RU',
        folderId: folderId,
    };
    // bodyFormData.append('text', text);
    // bodyFormData.append('lang', 'ru-RU');
    // bodyFormData.append('folderId', folderId);
    // const bodyParameters = {
    //     text: text,
    //     lang: 'ru-RU',
    //     folderId: folderId,
    // }
    const url = "https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize";
    try {
        // return await fetch(url, {
        //     method: 'POST',
        //     body: bodyFormData,
        //     headers: headers,
        // })
        return new Promise(function (resolve, reject) {
            request.post({
                headers: config.headers,
                url: url,
                formData: formData
            }, function (err, httpResponse, body) {
                if (err) {
                    reject(err);
                    // return console.error('upload failed:', err);
                }
                // console.log('11111111', body)
                // console.log('Upload successful!  Server responded with:', body);
                // fs.writeFileSync(path.resolve("public/speech3.ogg"), body, function (err) {
                //     if (err) {
                //         return console.log('error 333333', err);
                //     }
                //
                //     console.log("The file was saved!");
                // });

                resolve(true);
            }).pipe(fs.createWriteStream(filePath))
        })
    } catch (error) {
        // console.error('333')
        console.error(error)
    }
}

module.exports = SpeechController