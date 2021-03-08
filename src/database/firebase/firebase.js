const admin = require('firebase-admin');
const serviceAccount = require('../../credentials/firebase/serviceAccountKey.json');

let database;

const firebaseConnection = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://online-store-52b2d-default-rtdb.firebaseio.com',
    });
    database = admin.database();
};

const getDB = () => {
    if (database) return database;
    throw 'Firebase is not found';
};

module.exports = {
    firebaseConnection,
    getDB,
};
