if (process.env.NODE_ENV == 'production') {
    module.exports = {
        scheme: 'https',
        server: 'online-store-312700.wn.r.appspot.com',
        ip: process.env.IP,
        port: process.env.PORT || 5000,
        imagePort: '',
    };
} else {
    module.exports = {
        scheme: 'http',
        server: 'localhost',
        ip: '127.0.0.1',
        port: process.env.PORT || 5000,
        imagePort: ':' + (process.env.PORT || 5000),
    };
}
