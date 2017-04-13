'use strict'

const Arrow = require('arrow')

module.exports = function (options) {
  return new Promise((resolve, reject) => {
    options = options || {}
    const arrow = new Arrow({}, true)
    const connector = arrow.getConnector('appc.azure')

    // Create test model - Car
    arrow.addModel(Arrow.createModel('testUser', {
      connector,
      fields: {
        fname: {
          type: String, required: false
        },
        lname: {
          type: String, required: false
        },
        age: {
          type: Number, required: false
        }
      },
      metadata: {
        'appc.elasticsearch': {
          refresh: true
        }
      }
    }))

    // Return the arrow instance
    resolve(arrow)
  })
}
