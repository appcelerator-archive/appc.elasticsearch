'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../server')
const method = require('../../../lib/methods/findAll')()

var arrow
var connector
var testModel

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      arrow = inst

      // Set-up
      connector = arrow.getConnector('appc.elasticsearch')
      testModel = arrow.getModel('testUser')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should return all records ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const cbSpy = sandbox.spy()

  // Mocks
  const queryMock = sandbox.mock(connector).expects('query').once().withArgs(testModel, {limit: 1000}, cbSpy).yieldsAsync()

  // Function call
  method.call(connector, testModel, cbSpy)

  setImmediate(function () {
    // Asserts
    queryMock.verify()
    t.ok(cbSpy.calledOnce)

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Should return an error ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Error
  const err = new Error('Fail')

  // Spies
  const cbSpy = sandbox.spy()

  // Mocks
  const queryMock = sandbox.mock(connector).expects('query').once().withArgs(testModel, {limit: 1000}, cbSpy).yieldsAsync(err)

  // Function call
  method.call(connector, testModel, cbSpy)

  setImmediate(function () {
    // Asserts
    queryMock.verify()
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(err))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
