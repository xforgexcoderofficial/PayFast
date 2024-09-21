const express = require('express')
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'trackshippro.com'
const port = parseInt(process.env.PORT, 10) || 3003

const app = next({ dev, hostname, port, dir: path.join(__dirname) })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()

    // Serve static files
    server.use('/pay', express.static(path.join(__dirname, 'public')))

    // Serve animation files
    server.use('/pay/animations', express.static(path.join(__dirname, 'public', 'animations')))

    // Specific route for the animation file
    server.get('/pay/animations/payfast_network_banner.json', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'animations', 'payfast_network_banner.json'));
    });

    // Handle API routes
    server.use('/pay/api', (req, res) => {
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl

        app.render(req, res, pathname, query)
    })

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://${hostname}:${port}`)
    })
})