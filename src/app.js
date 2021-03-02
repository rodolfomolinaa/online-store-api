const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const serverConfig = require('./configs/server-config');
const filesConfig = require('./configs/files-config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    multer({
        storage: filesConfig.fileStorage,
        fileFilter: filesConfig.fileFilter,
    }).single('image'),
);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTION, PATCH',
    );
    res.setHeader('Access-Control-Allow-Header', '*');
    next();
});

//Set public routes
app.use(express.static(path.join(__dirname, '../public')));

//Set API Routes
app.use('/api/products', require('./routes/product'));

app.listen(serverConfig.port, serverConfig.ip, () =>
    console.log(
        `Server started at ${serverConfig.server} on port ${serverConfig.port}`,
    ),
);
