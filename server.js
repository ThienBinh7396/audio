const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

const app = express()
const logger = require('morgan');
const api = require('./src/server/api/index.js')


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//access cross domain
const allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, x-access-token");

    let allowedOrigins = ['*', 'http://localhost:3000', 'http://audio-sleepy-bilby.mybluemix.net', 'https://audio-sleepy-bilby.mybluemix.net', 'http://127.0.0.1:8080', 'http://localhost:8080', 'https://my-audio-46a92.firebaseapp.com'];
    let origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    console.log()
    next();
}
app.use(allowCrossDomain);


//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, '/dist')))

app.use('/api', api)

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function(req, res) {
    res.sendFile(path.join(__dirname, '/dist/index.html'))
})
app.use(logger('dev'));
const port = process.env.PORT || 7000
app.listen(port)
console.log(`app is listening on port: ${port}`)