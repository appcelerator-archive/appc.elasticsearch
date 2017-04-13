'use strict'

const test = require('tap').test
const sinon = require('sinon')
const _ = require('lodash')

const config = require('../../../lib/bindings/config.js')

const Arrow = require('arrow')

test('### Should creates connector ###', function (t) {
  // The method

  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Stubs
  const createLoggerStub = sandbox.stub(Arrow, 'createLogger')
  const loadModelsForConnectorStub = sandbox.stub(Arrow, 'loadModelsForConnector')
  const pickStub = sandbox.stub(_, 'pick')

  // Function call
  config(Arrow, {})

  // Asserts
  t.ok(createLoggerStub.calledOnce)
  t.ok(loadModelsForConnectorStub.calledOnce)
  t.ok(pickStub.calledOnce)

  // Restore
  sandbox.restore()

  // End
  t.end()
})
