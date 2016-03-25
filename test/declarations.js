'use strict'

const test = require('tap').test
const common = require('./common')
const ast = require('../lib/ast')
const d = ast.declaration
const gen = common.gen

test('FUNCTION', (t) => {
  const id = ast.identifier('a')
  const out = d.FUNCTION(id, [], {
    type: 'BlockStatement'
  , body: []
  })
  t.equal(gen(out), `function a() {\n}`)
  t.end()
})

test('VARIABLE', (t) => {
  const decls = [
    { type: 'VariableDeclarator'
    , id: ast.identifier('a')
    , init: ast.literal(1)
    }
  ]

  let out = d.VARIABLE(decls, 'const')
  t.equal(gen(out), 'const a = 1;')

  out = d.VARIABLE(decls, 'let')
  t.equal(gen(out), 'let a = 1;')

  out = d.VARIABLE(decls, 'var')
  t.equal(gen(out), 'var a = 1;')

  out = d.CONST(decls)
  t.equal(gen(out), 'const a = 1;')

  out = d.VAR(decls)
  t.equal(gen(out), 'var a = 1;')

  out = d.LET(decls)
  t.equal(gen(out), 'let a = 1;')

  t.end()
})
