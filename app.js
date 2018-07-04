if (process.env.NODE_ENV === 'production') {
  require('dotenv').config()
} else {
  require('dotenv').config({ path: './.env.dev' })
}
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cron = require('cron')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const webhookRouter = require('./routes/webhook')
const sendReminder = require('./sendReminder')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const MongoConnection = require('./MongoConnection')
/**
 * Connect to MongoDB.
 * Wrap everyting in order to wait for succesfull connection
 */
MongoConnection.connect().then(() => {
  console.log('Connected to Mongo database.')

  app.use('/', indexRouter)
  app.use('/users', usersRouter)
  app.use('/webhook', webhookRouter)

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404))
  })

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  })

  const CronJob = cron.CronJob
  const job = new CronJob('0 7 * * *', () => { sendReminder() })
  job.start()
  setTimeout(() => {
    sendReminder();
  }, 10000)

  // if the Node process ends, close the Mongoose connection
  const gracefulExit = () => {
    MongoConnection.client.close(() => {
      console.log('Mongo connection successfully disconnected through app termination')
      process.exit(0)
    })
  }
  process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit)
})
  .catch((e) => {
    console.error(e)
})

module.exports = app
