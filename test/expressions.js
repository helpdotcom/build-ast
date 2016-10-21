'use strict'

const test = require('tap').test
const common = require('./common')
const ast = require('../lib/ast')
const e = ast.expression
const S = ast.statement
const E = S.EXPRESSION
const D = ast.declaration
const gen = common.gen

test('UNARY', (t) => {
  const lit = ast.literal(true)

  const out = e.UNARY('!', lit)
  t.equal(gen(out), '!true')
  t.end()
})

test('TYPEOF', (t) => {
  const lit = ast.literal(true)

  const out = e.TYPEOF(lit)
  t.equal(gen(out), 'typeof true')
  t.end()
})

test('BINARY', (t) => {
  const lit = ast.literal(true)

  const out = e.BINARY(lit, '===', lit)
  t.equal(gen(out), 'true === true')
  t.end()
})

test('CONDITIONAL', (t) => {
  const a = ast.literal(true)
  const b = ast.literal(false)

  const out = e.CONDITIONAL(a, a, b)
  t.equal(gen(out), 'true ? true : false')
  t.end()
})

test('LOGICAL', (t) => {
  const a = ast.identifier(true)
  const b = ast.literal('b')
  const out = E(e.LOGICAL(a, '||', b))
  t.equal(gen(out), 'true || \'b\';')
  t.end()
})

test('ASSIGNMENT', (t) => {
  const vara = ast.identifier('a')
  const A = e.ASSIGNMENT
  const out = E(A(e.MEMBER(vara, vara, false), '=', ast.literal('1')))
  t.equal(gen(out), 'a.a = \'1\';')
  t.end()
})

test('OBJECT', (t) => {
  const decls = [
    { type: 'VariableDeclarator'
    , id: ast.identifier('a')
    , init: e.OBJECT([
        ast.property(ast.identifier('name'), ast.literal('evan'))
      ])
    }
  ]
  const out = D.CONST(decls, 'const')
  t.equal(gen(out), 'const a = { name: \'evan\' };')
  t.end()
})

test('ARRAY', (t) => {
  const out = e.ARRAY([])
  t.equal(gen(out), '[]')
  t.end()
})

test('NEW', (t) => {
  const out = e.NEW(ast.identifier('Error'), [])
  t.equal(gen(out), 'new Error()')
  t.end()
})

test('CALL', (t) => {
  const a = ast.identifier('a')
  const callee = e.MEMBER(a, ast.identifier('call'), false)
  const out = E(e.CALL(callee, [ast.literal(null)]))
  t.equal(gen(out), 'a.call(null);')
  t.end()
})

test('THIS', (t) => {
  const out = e.THIS()
  t.equal(gen(out), 'this')
  t.end()
})

test('UPDATE', (t) => {
  const out = E(e.UPDATE('++', ast.identifier('i'), false))
  t.equal(gen(out), 'i++;')
  t.end()
})

test('ARROW', (t) => {
  const out = E(e.ARROW([], S.BLOCK()))
  t.equal(gen(out), '() => {\n};')
  t.end()
})
