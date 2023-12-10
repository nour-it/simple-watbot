import express from "express";
import http from "node:http"
import * as socketIO from 'socket.io'
let server, io, socket, code;

let app = express()

function render(res, path, options) {
    // res.render(path, { cache: mode == "prod", ...options })
    res.render(path, options)
}

let options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: true,
    setHeaders: function (res, path, stat) { }
}


app.use(express.static('public', options))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'pug')

app.use(function (req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    console.log(req.protocol, req.ip, req.path)
    req.acceptsLanguages();
    res.set('x-timestamp', Date.now())
    res.set('x-powered-by', 'nour-it')
    if (req.originalUrl.lenght > 2 && req.originalUrl.match(new RegExp(`^(.*)/$`, "g"))) {
        res.redirect(301, RegExp.$1)
    } else {
        next()
    }
})

app.get('*', (req, res) => {
    render(res, 'index', { code })
})


export function lunch(qr) {
    code = qr
    console.log(code)
    server = http.Server(app);
    server.listen(process.env.PORT || 80);
    console.log('serveur listen on port ', 80)
    io = new socketIO.Server(server);
    io.on('connection', function (sock) {
        socket = sock
    });
}
export function changeQr(qrCode) {
    code = qrCode
    console.log(code)
    socket.emit('new:qrcode', code)
}
