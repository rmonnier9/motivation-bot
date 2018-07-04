const MongoConnection = require('./MongoConnection')
const request = require('request')

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

// NON_PROMOTIONAL_SUBSCRIPTION

const sendReminder = async () => {
  // get users from DB
  const usersCollection = MongoConnection.db.collection('users');
  const users = await usersCollection.find().toArray();
  console.log(users)
  users.forEach((user) => {
    sendReminderMsg(user.senderPsid, 'Training needed today !');
  })
}

// Handles messages events
function sendReminderMsg(senderPsid, toSend) {
  let response

  // Create the payload for a basic text message
  response = {
    'text': toSend
  }

  // Sends the response message
  callSendAPIReminder(senderPsid, response)
}

// Sends response messages via the Send API
function callSendAPIReminder (senderPsid, response) {
  // Construct the message body
  let request_body = {
    'recipient': {
      'id': senderPsid
    },
    'message': response,
    'messaging_type': 'MESSAGE_TAG',
    'tag': 'NON_PROMOTIONAL_SUBSCRIPTION'
  }
  console.log(request_body)

  // Send the HTTP request to the Messenger Platform
  request({
    'uri': process.env.MESSAGING_PLATFORM,
    'qs': { 'access_token': PAGE_ACCESS_TOKEN },
    'method': 'POST',
    'json': request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
      console.log(res, body)
    } else {
      console.error('Unable to send message:' + err)
    }
  })
}

module.exports = sendReminder