'use strict'

const test = require('tap').test
const sinon = require('sinon')

const utility = require('../../../lib/bindings/utility')()

test('### Should converts fields to source ###', function (t) {
  // Test object
  const hit = {
    fields: {
      f1: ['test']
    }
  }

  // Function call
  utility.convertFieldsToSource(hit)

  // Asserts
  t.ok(hit._source)
  t.ok(hit._source.f1)
  t.equal(hit._source.f1, 'test')

  // End
  t.end()
})

test('### Should get index ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const getMetaSpy = sandbox.spy()

  // Test object
  const Model = {
    getMeta: getMetaSpy
  }

  // Function call
  const index = utility.getIndex.call({
    config: {
      index: 'id'
    }
  }, Model)

  // Asserts
  t.ok(getMetaSpy.calledOnce)
  t.equal(index, 'arrow:id')

  // End
  t.end()
})

test('### Should get refresh ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const getMetaSpy = sandbox.spy()

  // Test object
  const Model = {
    getMeta: getMetaSpy
  }

  // Function call
  const refresh = utility.getRefresh.call({
    config: {
      refreshOnCreate: true,
      refreshOnDelete: true
    }
  }, Model)

  // Asserts
  t.ok(getMetaSpy.calledThrice)
  t.ok(refresh)
  t.ok(refresh.create)
  t.ok(refresh.delete)

  // End
  t.end()
})

test('### Should return type ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Spies
  const getMetaSpy = sandbox.spy()

  // Test object
  const Model = {
    getMeta: getMetaSpy,
    name: 'test'
  }

  // Function call
  const type = utility.getType(Model)

  // Asserts
  t.ok(getMetaSpy.calledOnce)
  t.ok(type)
  t.equal(type, 'test')

  // End
  t.end()
})

test('### Should create instance from result ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Test object
  const Model = {}

  // Spies
  const createInstanceFromResultStub = sandbox.stub().returns({})

  // Function call
  const instance = utility.createInstanceFromSource.call({
    createInstanceFromResult: createInstanceFromResultStub
  }, Model, {
    _id: 123,
    _source: null
  })

  // Asserts
  t.ok(createInstanceFromResultStub.calledOnce)
  t.ok(instance)

  // End
  t.end()
})

test('### Should create instance from result ###', function (t) {
  // Sinon sandbox
  const sandbox = sinon.sandbox.create()

  // Fake model
  const Model = {
    instance: () => { }
  }

  // Spies
  const setPrimaryKeySpy = sandbox.spy()

  // Mocks
  const instanceMock = sandbox.mock(Model).expects('instance').once().withArgs({ _id: 5 }, true).returns({
    setPrimaryKey: setPrimaryKeySpy
  })

  // Function call
  var result = utility.createInstanceFromResult(Model, { _id: 5 })

  // Asserts
  instanceMock.verify()
  t.ok(result)
  t.ok(setPrimaryKeySpy.calledWith(5))

  // Restore
  sandbox.restore()

  // End
  t.end()
})

test('### Should normalize elasticsearch types ###', function (t) {
  // Function call
  const type = utility.normalizeElasticSearchTypes('float')

  // Asserts
  t.equal(type, 'number')

  // End
  t.end()
})

test('### Should Should calculate query params ###', function (t) {
  // Test object
  const Model = {
    fields: {
      name: {
        type: String
      },
      label: {
        type: String
      }
    }
  }

  // Function call
  const shell = utility.calculateQueryParams(Model, {
    where: { label: 'test' },
    limit: 10,
    sel: { label: 1 },
    unsel: { name: 1 },
    order: { label: 1 }
  })

  // Asserts
  t.ok(shell)

  // End
  t.end()
})
