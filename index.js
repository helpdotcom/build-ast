'use strict'

const ast = require('./lib/ast')
const S = ast.statement
const E = ast.expression
const D = ast.declaration

const id = ast.identifier

Builder.ast = ast

module.exports = Builder

function Builder() {
  if (!(this instanceof Builder))
    return new Builder()

  this.body = []
}

Builder.id = id

Builder.prototype.program = function program() {
  this.type = 'Program'
  return this
}

Builder.block = function(body) {
  if (body && !Array.isArray(body)) {
    body = [body]
  }
  return S.BLOCK(body)
}

Builder.prototype.block = function block(body) {
  return this.push(Builder.block(body))
}

Builder.prototype.reset = function reset() {
  return new Builder()
}

Builder.prototype.push = function push() {
  for (var i = 0; i < arguments.length; i++) {
    this.body.push(arguments[i])
  }
  return this
}

Builder.prototype.build = function build() {
  return this.body
}

Builder.prototype.use = function use(n) {
  const str = `use ${n}`
  const ele = S.EXPRESSION(ast.string(str))
  return this.push(ele)
}

Builder.require = function(str, prop) {
  const callee = ast.identifier('require')
  const c = E.CALL(callee, [
    Builder.string(str)
  ])

  if (prop) {
    return E.MEMBER(c, ast.identifier(prop), false)
  }

  return c
}

Builder.prototype.require = function(str, prop) {
  return this.push(Builder.require(str, prop))
}

Builder.string = ast.string
Builder.number = ast.number

Builder.prototype.string = function string(val) {
  return this.push(Builder.string(val))
}

Builder.prototype.number = function number(val) {
  return this.push(Builder.number(val))
}

Builder.regex = function(re) {
  const str = re.toString()
  let pattern = str.slice(1)
  const flags = str.match(/[gimuy]*$/)[0]
  if (flags.length) {
    pattern = pattern.slice(0, -flags.length - 1)
  } else {
    pattern = pattern.slice(0, -1)
  }
  const r = new RegExp(pattern, flags)
  return ast.regex(r, str, pattern, flags)
}

Builder.prototype.regex = function regex(re) {
  return this.push(Builder.regex(re))
}

Builder.declare = function(type, name, val) {
  return D.VARIABLE([
    { type: 'VariableDeclarator'
    , id: ast.identifier(name)
    , init: val
    }
  ], type)
}

Builder.prototype.declare = function declare(type, name, val) {
  return this.push(Builder.declare(type, name, val))
}

Builder.module = function(name) {
  return S.EXPRESSION(E.ASSIGNMENT(
    E.MEMBER(id('module'), id('exports'), false)
  , '='
  , id(name)
  ))
}

Builder.prototype.module = function(name) {
  return this.push(Builder.module(name))
}

Builder.assign = function(key, val, op) {
  op = op || '='
  return S.EXPRESSION(E.ASSIGNMENT(
    ast.objectPath(key)
  , op
  , val
  ))
}

Builder.prototype.assign = function assign(key, val, op) {
  return this.push(Builder.assign(key, val, op))
}

Builder.array = E.ARRAY

Builder.prototype.array = function array(items) {
  return this.push(Builder.array(items))
}

Builder.function = function(name, args, body) {
  if (!Array.isArray(args)) {
    throw new TypeError('args must be an array')
  }

  args = args.map((item) => {
    return id(item)
  })

  name = name ? id(name) : null

  return D.FUNCTION(name, args, S.BLOCK(body))
}

Builder.prototype.function = function(name, args, body) {
  return this.push(Builder.function(name, args, body))
}

Builder.if = function(test, block, alt) {
  return S.IF(test, block, alt)
}

Builder.prototype.if = function(test, block, alt) {
  return this.push(Builder.if(test, block, alt))
}

Builder.not = function(arg) {
  return E.UNARY('!', arg, true)
}

Builder.prototype.not = function not(arg) {
  return this.push(Builder.not(arg))
}

Builder.ifNot = function(test, block, alt) {
  return Builder.if(Builder.not(test), block, alt)
}

Builder.prototype.ifNot = function ifNot(test, block, alt) {
  return this.push(Builder.ifNot(test, block, alt))
}

Builder.instanceOf = function(left, right) {
  return E.BINARY(left, 'instanceof', right)
}

Builder.prototype.instanceOf = function instanceOf(left, right) {
  return this.push(Buffer.instanceOf(left, right))
}

Builder.this = E.THIS

Builder.returns = function(arg) {
  return S.RETURN(arg)
}

Builder.prototype.returns = function returns(arg) {
  return this.push(Builder.returns(arg))
}

Builder.new = function(fnName, args) {
  args = (args || []).map((item) => {
    if (typeof item === 'string')
      return id(item)

    return item
  })
  return E.NEW(id(fnName), args)
}

Builder.prototype.new = function(fnName, args) {
  return this.push(Builder.new(fnName, args))
}
