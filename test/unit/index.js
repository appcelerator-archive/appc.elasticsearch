'use strict'

const test = require('tap').test
const sinon = require('sinon')
const mockery = require('mockery')

const _ = require('lodash')
const Arrow = require('arrow')

test('### Init mockery ###', function (t) {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./bindings/config', () => { })
  mockery.registerMock('./bindings/lifecycle', () => { })
  mockery.registerMock('./bindings/metadata', () => { })
  mockery.registerMock('./methods/count', () => { })
  mockery.registerMock('./methods/create', () => { })
  mockery.registerMock('./methods/findAll', () => { })
  mockery.registerMock('./methods/findByID', () => { })
  mockery.registerMock('./methods/findOne', () => { })
  mockery.registerMock('./methods/query', () => { })
  mockery.registerMock('./methods/save', () => { })
  mockery.registerMock('./methods/delete', () => { })
  mockery.registerMock('./methods/deleteAll', () => { })
  mockery.registerMock('./bindings/utility', () => { })

  t.end()
})

test('### Should creates connector ###', function (t) {
  // The method
  const connectorCreate = require('../../lib').create

  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Stubs
  const connectorExtendStub = sandbox.stub(Arrow.Connector, 'extend')
  const defaultsStub = sandbox.stub(_, 'defaults')
  const pickStub = sandbox.stub(_, 'pick')

  // Function call
  connectorCreate(Arrow, {})

  // Asserts
  t.ok(connectorExtendStub.calledOnce)
  t.ok(defaultsStub.calledOnce)
  t.ok(pickStub.calledOnce)

  // Restore
  sandbox.restore()

  // End
  t.end()
})

test('### Disable Mockery ###', function (t) {
  mockery.deregisterAll()
  mockery.disable()

  t.end()
})
