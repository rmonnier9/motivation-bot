
const { MongoClient } = require('mongodb')

const MongoConnection = {
  connect () {
    return new Promise((resolve, reject) => {
      MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
        if (err) {
          reject(err)
        }
        this.db = client.db('motivation')
        this.client = client
        resolve()
      })
    })
  }
}

module.exports = MongoConnection
