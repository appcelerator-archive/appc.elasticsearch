/**
 * NOTE: This file is simply for testing this connector and will not
 * be used or packaged with the actual connector when published.
 */
var Arrow = require('arrow')
var server = new Arrow()

// lifecycle examples
server.on('starting', function () {
  server.logger.debug('server is starting!')
})

server.on('started', function () {
  server.logger.debug('server started!')
})

// create some users programmatically
var users = [
  { name: 'Jeff' },
  { name: 'Nolan' },
  { name: 'Dawson' },
  { name: 'Rick' },
  { name: 'Isaac' }
]

// start the server
server.start(function (err) {
  if (err) {
    return server.logger.fatal(err)
  }
  server.logger.info('server started on port', server.port)

  var User = Arrow.Model.extend('user', {
    fields: {
      name: { type: String, required: false, validator: /[a-zA-Z]{3,}/ }
    },
    connector: 'appc.elasticsearch'
  })

  User.create(users, function (err, users) {
    if (err) {
      server.logger.error(err)
    } else {
      server.logger.info('Created some users')
    }
  })
})
