const admin = require('firebase-admin');

const serviceAccount = require('../../credentials/firebase/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://online-store-52b2d-default-rtdb.firebaseio.com',
});

const database = admin.database();

module.exports = {
    rdb: database,
};
