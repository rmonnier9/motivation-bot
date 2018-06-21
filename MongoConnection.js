
const { MongoClient } = require('mongodb');

const MongoConnection = {
  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
        if (err) {
          reject(err);
        }
        this.db = client.db('motivation');
        resolve();
      });
    });
  },
};

module.exports = MongoConnection;