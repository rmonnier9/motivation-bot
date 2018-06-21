const MongoConnection = require('./MongoConnection')

const sendReminder = async () => {
  // get users from DB
  const usersCollection = MongoConnection.db.collection('users');
  const users = await usersCollection.find().toArray();

  users.forEach((user) => {
    console.log(user)
  })
}

module.exports = sendReminder