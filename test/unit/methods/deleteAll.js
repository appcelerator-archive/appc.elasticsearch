'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../server')
const method = require('../../../lib/methods/deleteAll')()

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
        deleteByQuery: () => { }
      }
      testModel = arrow.getModel('testUser')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should delete all records ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Test data
  const deleteFn = () => { }

  // Spies
  const cbSpy = sandbox.spy()

  // Stubs
  const getRefreshStub = sandbox.stub(connector, 'getRefresh').returns({ delete: deleteFn })
  const getIndexStub = sandbox.stub(connector, 'getIndex').returns(5)
  const getTypeStub = sandbox.stub(connector, 'getType').returns('string')

  // Mocks
  const indexMock = sandbox.mock(connector.client).expects('deleteByQuery').once().withArgs({
    index: 5,
    type: 'string',
    body: {
      query: {
        match_all: {}
      }
    },
    refresh: deleteFn
  }).yieldsAsync(null, { found: true })

  // Function call
  method.call(connector, testModel, cbSpy)

  setImmediate(function () {
    // Asserts
    indexMock.verify()
    t.ok(getRefreshStub.calledOnce)
    t.ok(getIndexStub.calledOnce)
    t.ok(getTypeStub.calledOnce)
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

  // Test data
  const deleteFn = () => { }

  // Spies
  const cbSpy = sandbox.spy()

  // Stubs
  const getRefreshStub = sandbox.stub(connector, 'getRefresh').returns({ delete: deleteFn })
  const getIndexStub = sandbox.stub(connector, 'getIndex').returns(5)
  const getTypeStub = sandbox.stub(connector, 'getType').returns('string')

  // Mocks
  const indexMock = sandbox.mock(connector.client).expects('deleteByQuery').once().withArgs({
    index: 5,
    type: 'string',
    body: {
      query: {
        match_all: {}
      }
    },
    refresh: deleteFn
  }).yieldsAsync(err)

  // Function call
  method.call(connector, testModel, cbSpy)

  setImmediate(function () {
    // Asserts
    indexMock.verify()
    t.ok(getRefreshStub.calledOnce)
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
