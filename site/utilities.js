const MongoClient = require('mongodb').MongoClient;

/**
 * Connects to the <dbName> database from <collectionName> collection with the <critera>
 * The <callback> takes in a parameter, an array.
 */
const connectAndFind = async (url, dbName, collectionName, criteria, callback) => {
    console.log('yes')

    client = await MongoClient.connect(url + '/' + dbName, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });

    db = client.db(dbName);

    await find(db, collectionName, criteria)
        .then((items) => {
            callback(items);
        }).catch((err) => {
            console.log(err)
        });

    client.close();
}

/**
 * Finds an element in <db> from <collection> with <criteria>
 */
const find = (db, collection, criteria) => {

    return new Promise((resolve, reject) => {
        const items = db.collection(collection).find(criteria).toArray();
        resolve(items)
    })
}

exports.connectAndFind = connectAndFind;