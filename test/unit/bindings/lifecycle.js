'use strict'

const test = require('tap').test
const sinon = require('sinon')

const elasticsearch = require('elasticsearch')
const lifecycle = require('../../../lib/bindings/lifecycle')()

test('### Should connects ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const cbSpy = sandbox.spy()
  const putTemplateStub = sandbox.stub().yieldsAsync()

  // Stubs
  const clientStub = sandbox.stub(elasticsearch, 'Client').returns({
    indices: {
      putTemplate: putTemplateStub
    }
  })
  const fetchSchemaStub = sandbox.stub().yieldsAsync()
  const generateModelsFromSchemaStub = sandbox.stub()

  // Function call
  lifecycle.connect.call({
    logger: {
      debug: sandbox.spy()
    },
    config: {},
    fetchSchema: fetchSchemaStub,
    generateModelsFromSchema: generateModelsFromSchemaStub
  }, cbSpy)

  // Asserts
  setImmediate(() => {
    t.ok(clientStub.calledOnce)
    t.ok(clientStub.calledWithNew)
    t.ok(fetchSchemaStub.calledOnce)
    t.ok(generateModelsFromSchemaStub.calledOnce)
    t.ok(putTemplateStub.calledOnce)
    t.ok(cbSpy.calledOnce)

    // Restore
    sandbox.restore()

    // End
    t.end()
  })
})

test('### Should disconnects ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const cbSpy = sandbox.spy()

  // Function call
  lifecycle.disconnect.call({
    logger: {
      trace: sandbox.spy()
    }
  }, cbSpy)

  // Asserts
  t.ok(cbSpy.calledOnce)

  // Restore
  sandbox.restore()

  // End
  t.end()
})
