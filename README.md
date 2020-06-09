# speechkit-gate
Микросервис для Yandex speechkit с файл-кэшем
https://cloud.yandex.ru/docs/speechkit/tts/request

----
src/controllers/SpeechController.js
17 const oauthToken
Срок жизни OAuth-токена 1 год.
После этого необходимо получить новый OAuth-токен и повторить процедуру аутентификации.
https://cloud.yandex.ru/docs/iam/concepts/authorization/oauth-token
