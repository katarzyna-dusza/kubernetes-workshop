const express = require('express')
const app = express()

const USER_NAME = process.env.USER_NAME
let count = 1

const logRequest = () => {
    console.log('Your pod is working! :D, request -> ', count)
    count++
}

app.get('/', (req, res) => {
    logRequest()
    res.send(`<html><style>body { background-color: aquamarine; text-align: center; } </style><body><h1>Your App is working, ${USER_NAME}!</h1></body></html>`

		)
})

app.get('/healthz', (req, res) => {
    res.sendStatus(200)
})

app.get('*', function(req, res){
    res.status(500).send('unhealthy');
  });

app.listen(3000)
console.log('Running on http://localhost:3000');