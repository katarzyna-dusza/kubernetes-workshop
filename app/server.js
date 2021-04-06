const express = require('express')
const app = express()

const htmlPath = __dirname + '/index.html'
let count = 1

const logRequest = () => {
    console.log('Your pod is working! :D, request -> ', count)
    count++
}

app.get('/', (req, res) => {
    logRequest()
    res.sendFile(htmlPath)
})

app.get('/healthz', (req, res) => {
    res.sendStatus(200)
})

app.get('*', function(req, res){
    res.status(500).send('unhealthy');
  });

app.listen(3000)
console.log('Running on http://localhost:3000');