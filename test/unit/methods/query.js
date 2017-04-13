'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../server')
const method = require('../../../lib/methods/query')()

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
        search: () => { }
      }
      testModel = arrow.getModel('testUser')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should return records ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Test data
  const payload = {}

  // Spies
  const cbSpy = sandbox.spy()

  // Fake model's instance
  const fakeInst = { id: 5 }

  // Stubs
  const createInstanceFromSourceStub = sandbox.stub(connector, 'createInstanceFromSource').returns(fakeInst)
  const calculateQueryParamsStub = sandbox.stub(connector, 'calculateQueryParams').returns(payload)
  const getIndexStub = sandbox.stub(connector, 'getIndex').returns(5)
  const getTypeStub = sandbox.stub(connector, 'getType').returns('string')

  // Mocks
  const indexMock = sandbox.mock(connector.client).expects('search').once().withArgs({ index: 5, type: 'string', body: payload }).yieldsAsync(null, { hits: { hits: [{ id: 5 }] } })

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    indexMock.verify()
    t.ok(createInstanceFromSourceStub.calledOnce)
    t.ok(calculateQueryParamsStub.calledOnce)
    t.ok(getIndexStub.calledOnce)
    t.ok(getTypeStub.calledOnce)
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(null, [fakeInst]))

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
  const payload = {}

  // Spies
  const cbSpy = sandbox.spy()

  // Stubs
  const calculateQueryParamsStub = sandbox.stub(connector, 'calculateQueryParams').returns(payload)
  const getIndexStub = sandbox.stub(connector, 'getIndex').returns(5)
  const getTypeStub = sandbox.stub(connector, 'getType').returns('string')

  // Mocks
  const indexMock = sandbox.mock(connector.client).expects('search').once().withArgs({ index: 5, type: 'string', body: payload }).yieldsAsync(err)

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    indexMock.verify()
    t.ok(calculateQueryParamsStub.calledOnce)
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
