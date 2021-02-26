const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

exports.fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '_' + file.originalname);
    },
});

exports.fileFilter = (req, file, cb) => {
    const mymeType = ['image/png', 'image/jpeg', 'image/jpg'];
    cb(null, mymeType.includes(file.mimetype));
};
