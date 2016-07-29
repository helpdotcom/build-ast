'use strict'

const test = require('tap').test
const common = require('./common')
const ast = require('../lib/ast')
const gen = common.gen
const D = ast.declaration

test('literal', (t) => {
  let out = ast.literal('obj', '\'obj\'')
  t.equal(gen(out), '\'obj\'', 'raw literal')
  out = ast.literal(1)
  t.equal(gen(out), '1', 'raw literal number')
  out = ast.literal('1')
  t.equal(gen(out), '\'1\'', 'raw literal string')
  out = ast.literal('obj')
  t.equal(gen(out), '\'obj\'', 'value literal')
  out = ast.literal('test\'a')
  t.equal(gen(out), '\'test\\\'a\'', 'with quote')
  t.end()
})

test('identifier', (t) => {
  let out = ast.identifier('obj')
  t.equal(gen(out), 'obj')

  // should these throw?
  out = ast.identifier('obj.fasdfadsf')
  t.equal(gen(out), 'obj.fasdfadsf', 'dots')
  out = ast.identifier('obj\'a')
  t.equal(gen(out), 'obj\'a')
  t.end()
})

test('string', (t) => {
  let out = ast.string('abc')
  t.equal(gen(out), '\'abc\'', 'string')
  out = ast.string(1)
  t.equal(gen(out), '\'1\'', 'coerces to string')
  t.end()
})

test('number', (t) => {
  let out = ast.number(1)
  t.equal(gen(out), '1', 'number')
  out = ast.number('1')
  t.equal(gen(out), '1', 'number')
  t.end()
})

test('templates', (t) => {
  const a = D.VAR([
    { type: 'VariableDeclarator'
    , id: ast.identifier('a')
    , init: ast.literal('1')
    }
  ])

  const init = ast.templateLiteral(
    [ ast.identifier('a') ]
  , [ ast.templateElement('', '', false)
    , ast.templateElement('', '', true)
    ]
  )

  const b = D.VAR([
    { type: 'VariableDeclarator'
    , id: ast.identifier('b')
    , init: init
    }
  ])

  const out = {
    type: 'Program'
  , body: [a, b]
  }

  t.equal(gen(out), 'var a = \'1\';\nvar b = `${ a }`')
  t.end()
})

test('objectPath', (t) => {
  let out = ast.objectPath('a.b.c')
  t.equal(gen(out), 'a.b.c')
  out = ast.objectPath('a')
  t.equal(gen(out), 'a')

  out = ast.objectPath('obj.^__IDX__.prop.thing.^__IDX__1')
  t.equal(gen(out), 'obj[__IDX__].prop.thing[__IDX__1]')
  t.end()
})
