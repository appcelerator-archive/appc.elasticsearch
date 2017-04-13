'use strict'

const test = require('tap').test
const sinon = require('sinon')

const metadata = require('../../../lib/bindings/metadata')({
  Model: {
    extend: () => {}
  }
})

test('### Should fetch schema ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const cbSpy = sandbox.spy()
  const normalizeElasticSearchTypesSpy = sandbox.spy()

  // Stubs
  const getClientIndicesStub = sandbox.stub().yieldsAsync(null, {
    'my_type': {
      'mappings': [{
        'properties': {
          'first': {
            'type': 'string'
          }
        }
      }]
    }
  })

  // Function call
  metadata.fetchSchema.call({
    client: {
      indices: {
        get: getClientIndicesStub
      }
    },
    normalizeElasticSearchTypes: normalizeElasticSearchTypesSpy
  }, cbSpy)

  // Asserts
  setImmediate(() => {
    t.ok(cbSpy.calledOnce)
    t.ok(normalizeElasticSearchTypesSpy.calledWithNew)

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Should generate models from schema ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Function call
  metadata.generateModelsFromSchema.call({
    config: {
      modelAutogen: true
    },
    pkginfo: {
      name: 'appc.elasticsearch'
    }
  }, {
    test: {
      fields: {
        label: {
          type: String
        }
      }
    }
  })

  // Asserts
  setImmediate(() => {
    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})
