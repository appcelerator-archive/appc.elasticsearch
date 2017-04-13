'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../server')
const method = require('../../../lib/methods/findByID')()

var arrow
var connector
var testModel

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      arrow = inst

      // Set-up
      connector = arrow.getConnector('appc.elasticsearch')
      connector.client = {
        get: () => { }
      }
      testModel = arrow.getModel('testUser')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should return a record ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const cbSpy = sandbox.spy()

  // Stubs
  const getIndexStub = sandbox.stub(connector, 'getIndex').returns(5)
  const getTypeStub = sandbox.stub(connector, 'getType').returns('string')
  const createInstanceFromSourceStub = sandbox.stub(connector, 'createInstanceFromSource')

  // Mocks
  const indexMock = sandbox.mock(connector.client).expects('get').once().withArgs({ index: 5, type: 'string', id: '5' }).yieldsAsync(null, { })

  // Function call
  method.call(connector, testModel, '5', cbSpy)

  setImmediate(function () {
    // Asserts
    indexMock.verify()
    t.ok(getIndexStub.calledOnce)
    t.ok(getTypeStub.calledOnce)
    t.ok(cbSpy.calledOnce)
    t.ok(createInstanceFromSourceStub.calledOnce)

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

  // Stubs
  const getIndexStub = sandbox.stub(connector, 'getIndex').returns(5)
  const getTypeStub = sandbox.stub(connector, 'getType').returns('string')

  // Mocks
  const indexMock = sandbox.mock(connector.client).expects('get').once().withArgs({ index: 5, type: 'string', id: '5' }).yieldsAsync(err)

  // Function call
  method.call(connector, testModel, '5', cbSpy)

  setImmediate(function () {
    // Asserts
    indexMock.verify()
    t.ok(getIndexStub.calledOnce)
    t.ok(getTypeStub.calledOnce)
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
