'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../server')
const method = require('../../../lib/methods/count')()

var arrow
var connector
var testModel

test('### Start Arrow ###', (t) => {
  server()
    .then((inst) => {
      arrow = inst

      // Set-up
      connector = arrow.getConnector('appc.elasticsearch')
      connector.client = {
        count: () => { }
      }
      testModel = arrow.getModel('testUser')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should return a count ###', (t) => {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Stubs
  const getIndexStub = sandbox.stub(connector, 'getIndex').returns(5)
  const getTypeStub = sandbox.stub(connector, 'getType').returns('string')
  // Mocks
  const countMock = sandbox.mock(connector.client).expects('count').once().withArgs({index: 5, type: 'string'}).yieldsAsync(null, { count: 5 })
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    countMock.verify()
    t.ok(cbSpy.calledOnce)
    t.ok(getIndexStub.calledOnce)
    t.ok(getTypeStub.calledOnce)
    t.ok(cbSpy.alwaysCalledWithExactly(null, 5))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Should return an error ###', (t) => {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Error
  const err = new Error('Fail')

  // Stubs
  const getIndexStub = sandbox.stub(connector, 'getIndex').returns(5)
  const getTypeStub = sandbox.stub(connector, 'getType').returns('string')
  // Mocks
  const countMock = sandbox.mock(connector.client).expects('count').once().withArgs({index: 5, type: 'string'}).yieldsAsync(err)
  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    countMock.verify()
    t.ok(cbSpy.calledOnce)
    t.ok(getIndexStub.calledOnce)
    t.ok(getTypeStub.calledOnce)
    t.ok(cbSpy.alwaysCalledWithExactly(err))

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(() => {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
