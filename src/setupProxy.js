const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        // '^/xmu-bj-server',
        '^/interactive',
        createProxyMiddleware({
            // target: 'http://localhost',
            target: 'http://10.10.13.246:8090',
            changeOrigin: true
        })
    )
}