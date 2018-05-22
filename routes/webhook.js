const request = require('request')
const router = require('express').Router()

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

// Handles messages events
function sendMessage (sender_psid, toSend) {
  let response

  // Create the payload for a basic text message
  response = {
    'text': toSend
  }

  // Sends the response message
  callSendAPI(sender_psid, response)
}

// Handles messages events
function handleMessage (sender_psid, received_message) {
  let response

  // Check if the message contains text
  if (received_message.text) {
    sendMessage(sender_psid, 'Salut ! Je suis Joe, ton coach sportif 💪')
    sendMessage(sender_psid, 'J\'éspère que tu as le coeur accroché parce que tes muscles vont chauffer.')
    // Create the payload for a basic text message
    response = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'button',
          'text': 'Pour quoi tu veux t\'entrainer ?',
          'buttons': [{
            'type': 'postback',
            'title': 'Juste rester forme!',
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
  callSendAPI(sender_psid, response)
}

// Handles messaging_postbacks events
function handlePostback (sender_psid, received_postback) {
  let response

  // Get the payload for the postback
  let payload = received_postback.payload

  // Set the response based on the postback payload
  if (payload === 'START_REGULAR') {
    response = { 'text': 'Ah donc tu n\'est pas très ambitieux. Je reviens vers toi dès que ton programme d\'entraînement est prêt!' }
  } else if (payload === 'START_HALF_IRON_MAN') {
    response = { 'text': 'A moitié courageux, c\'est toujours ça.' }
  } else if (payload === 'START_IRON_MAN') {
    response = { 'text': 'Excellent choix! Les prochaines semaines vont être difficile parce que... ça va chier.' }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response)
}

// Sends response messages via the Send API
function callSendAPI (sender_psid, response) {
  // Construct the message body
  let request_body = {
    'recipient': {
      'id': sender_psid
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

// Accepts POST requests at /webhook endpoint
router.post('/', (req, res) => {
  // Parse the request body from the POST
  let body = req.body

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Get the webhook event. entry.messaging is an array, but
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0]
      console.log(webhook_event)

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id
      console.log('Sender PSID: ' + sender_psid)

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message)
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback)
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
