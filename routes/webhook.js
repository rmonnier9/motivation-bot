const request = require('request')
const router = require('express').Router()
const MongoConnection = require('../MongoConnection')


const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

// Sends response messages via the Send API
function callSendAPI (senderPsid, response) {
  // Construct the message body
  let request_body = {
    'recipient': {
      'id': senderPsid
    },
    'message': response
  }
  console.log(request_body)

  // Send the HTTP request to the Messenger Platform
  request({
    'uri': 'https://graph.facebook.com/v2.6/me/messages',
    'qs': { 'access_token': PAGE_ACCESS_TOKEN },
    'method': 'POST',
    'json': request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error('Unable to send message:' + err)
    }
  })
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
    'tag': 'SHIPPING_UPDATE'
  }
  console.log(request_body)

  // Send the HTTP request to the Messenger Platform
  request({
    'uri': 'https://graph.facebook.com/v2.6/me/messages',
    'qs': { 'access_token': PAGE_ACCESS_TOKEN },
    'method': 'POST',
    'json': request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error('Unable to send message:' + err)
    }
  })
}

// NON_PROMOTIONAL_SUBSCRIPTION

// Handles messages events
function sendMessage (senderPsid, toSend) {
  let response

  // Create the payload for a basic text message
  response = {
    'text': toSend
  }

  // Sends the response message
  callSendAPI(senderPsid, response)
}

// Handles messages events
function handleMessage (senderPsid, received_message) {
  let response

  // Check if the message contains text
  if (received_message.text) {
    sendMessage(senderPsid, 'Salut ! Je suis Joe, ton coach sportif 💪')
    setTimeout(() => { sendMessage(senderPsid, 'J\'espère que tu as le coeur accroché parce que tes muscles vont chauffer.') }, 1000)
    // Create the payload for a basic text message
    response = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'button',
          'text': 'Quel est ton objectif d\'entrainement ?',
          'buttons': [{
            'type': 'postback',
            'title': 'Rester en forme!',
            'payload': 'START_REGULAR'
          },
          {
            'type': 'postback',
            'title': 'Half Iron Man',
            'payload': 'START_HALF_IRON_MAN'
          },
          {
            'type': 'postback',
            'title': 'Iron Man',
            'payload': 'START_IRON_MAN'
          }]
        }
      }
    }
  }

  // Sends the response message
  setTimeout(() => { callSendAPI(senderPsid, response) }, 2000)
}

// Handles messaging_postbacks events
function handlePostback (senderPsid, received_postback) {
  let response

  // Get the payload for the postback
  let payload = received_postback.payload

  // Set the response based on the postback payload
  if (payload === 'START_REGULAR') {
    response = { 'text': 'Tu n\'es donc pas très ambitieux. Cours un peu le matin et ça ira, pas besoin d\'un expert de pointe comme moi.' }
  } else if (payload === 'START_HALF_IRON_MAN') {
    response = { 'text': 'A moitié courageux, c\'est déjà ça.' }
  } else if (payload === 'START_IRON_MAN') {
    response = { 'text': 'Excellent choix! Les prochaines semaines vont être difficile parce que... ça va chier.' }
  }
  const newUser = {
    senderPsid: senderPsid,
    program: payload,
    day: 0,
  }
  const usersCollection = MongoConnection.db.collection('users');
  usersCollection.insertOne(newUser);

  // Send the message to acknowledge the postback
  callSendAPI(senderPsid, response)
}

const handleAlreadySent = async (senderPsid, received_message) => {
  let message

  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ senderPsid });
  
  // Check if the message contains text
  if (received_message.text) {
    message = `You are enrolled in the ${user.program} training.`
    sendMessage(senderPsid, message)
  }
}


// Accepts POST requests at /webhook endpoint
router.post('/', async (req, res) => {
  // Parse the request body from the POST
  let body = req.body

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(async (entry) => {
      // Get the webhook event. entry.messaging is an array, but
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0]
      console.log(webhook_event)

      // Get the sender PSID
      let senderPsid = webhook_event.sender.id
      console.log('Sender PSID: ' + senderPsid)
      console.log(MongoConnection)

      // check if the user has already sent a message
      const usersCollection = MongoConnection.db.collection('users');
      const user = await usersCollection.findOne({ senderPsid });
      if (!user) {
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          handleMessage(senderPsid, webhook_event.message)
        } else if (webhook_event.postback) {
          handlePostback(senderPsid, webhook_event.postback)
        }
      } else {
        handleAlreadySent();
      }

    })

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED')
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404)
  }
})

// Accepts GET requests at the /webhook endpoint
router.get('/', (req, res) => {
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = 'Toto75017'

  // Parse params from the webhook verification request
  let mode = req.query['hub.mode']
  let token = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED')
      res.status(200).send(challenge)
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403)
    }
  }
})

module.exports = router
