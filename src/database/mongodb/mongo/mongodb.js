const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let mdb;
const mongoConnect = (cb) => {
    MongoClient.connect(
        'mongodb+srv://enode:enode>@cluster0.rqjgm.mongodb.net/products?retryWrites=true&w=majority',
        { useUnifiedTopology: true },
    )
        .then((client) => {
            console.log('Mongo connected');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.mongoConnect = mongoConnect;
