'use strict'

const test = require('tap').test
const sinon = require('sinon')

const server = require('../../server')
const method = require('../../../lib/methods/create')()

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
        index: () => { }
      }
      testModel = arrow.getModel('testUser')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch(t.threw)
})

test('### Should create a record ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Test data
  const payload = {}
  const createFn = () => {}

  // Spies
  const cbSpy = sandbox.spy()

  // Fake model's instance
  const fakeInst = {
    setPrimaryKey: sandbox.spy(),
    toPayload: sandbox.stub().returns(payload)
  }

  // Stubs
  const instanceStub = sandbox.stub(testModel, 'instance').returns(fakeInst)
  const getRefreshStub = sandbox.stub(connector, 'getRefresh').returns({ create: createFn })
  const getIndexStub = sandbox.stub(connector, 'getIndex').returns(5)
  const getTypeStub = sandbox.stub(connector, 'getType').returns('string')

  // Mocks
  const indexMock = sandbox.mock(connector.client).expects('index').once().withArgs({ index: 5, type: 'string', body: payload, refresh: createFn }).yieldsAsync(null, { _id: 5 })

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    indexMock.verify()
    t.ok(instanceStub.calledOnce)
    t.ok(getRefreshStub.calledOnce)
    t.ok(getIndexStub.calledOnce)
    t.ok(getTypeStub.calledOnce)
    t.ok(fakeInst.toPayload.calledOnce)
    t.ok(fakeInst.setPrimaryKey.calledOnce)
    t.ok(fakeInst.setPrimaryKey.calledWith(5))
    t.ok(cbSpy.calledOnce)
    t.ok(cbSpy.calledWith(null, fakeInst))

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
  const createFn = () => {}

  // Spies
  const cbSpy = sandbox.spy()

  // Fake model's instance
  const fakeInst = {
    toPayload: sandbox.stub().returns(payload)
  }

  // Stubs
  const instanceStub = sandbox.stub(testModel, 'instance').returns(fakeInst)
  const getRefreshStub = sandbox.stub(connector, 'getRefresh').returns({ create: createFn })
  const getIndexStub = sandbox.stub(connector, 'getIndex').returns(5)
  const getTypeStub = sandbox.stub(connector, 'getType').returns('string')

  // Mocks
  const indexMock = sandbox.mock(connector.client).expects('index').once().withArgs({ index: 5, type: 'string', body: payload, refresh: createFn }).yieldsAsync(err)

  // Function call
  method.call(connector, testModel, {}, cbSpy)

  setImmediate(function () {
    // Asserts
    indexMock.verify()
    t.ok(instanceStub.calledOnce)
    t.ok(getRefreshStub.calledOnce)
    t.ok(getIndexStub.calledOnce)
    t.ok(getTypeStub.calledOnce)
    t.ok(fakeInst.toPayload.calledOnce)
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
