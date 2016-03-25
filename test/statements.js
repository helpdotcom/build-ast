'use strict'

const test = require('tap').test
const common = require('./common')
const ast = require('../lib/ast')
const e = ast.expression
const S = ast.statement
const E = S.EXPRESSION
const D = ast.declaration
const gen = common.gen

test('EXPRESSION', (t) => {
  const out = E(ast.identifier('a'))
  t.equal(gen(out), 'a;')
  t.end()
})

test('FOR', (t) => {
  const i = ast.identifier('i')

  const v = D.VAR([
    { type: 'VariableDeclarator'
    , id: i
    , init: ast.literal(0)
    }
  ])

  const out = S.FOR(
    v
  , e.BINARY(i, '<', ast.literal(5))
  , e.UPDATE('++', i, false)
  , S.BLOCK()
  )

  t.equal(gen(out), 'for (var i = 0; i < 5; i++) {\n}')
  t.end()
})

test('RETURN', (t) => {
  const a = ast.identifier('a')

  const out = D.FUNCTION(a, [], S.BLOCK([
    S.RETURN(ast.literal(true))
  ]))
  t.equal(gen(out), 'function a() {\n  return true\n}')
  t.end()
})

test('IF', (t) => {
  const out = S.IF(ast.literal(true), S.BLOCK())
  t.equal(gen(out), 'if (true) {\n}')
  t.end()
})
