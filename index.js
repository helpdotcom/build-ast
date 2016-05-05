'use strict'

const ast = require('./lib/ast')
const S = ast.statement
const E = ast.expression
const D = ast.declaration

const id = ast.identifier

Builder.array = E.ARRAY
Builder.ast = ast
Builder.id = id
Builder.number = ast.number
Builder.string = ast.string
Builder.this = E.THIS

module.exports = Builder

function Builder() {
  if (!(this instanceof Builder))
    return new Builder()

  this.body = []
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

Builder.prototype.reset = function reset() {
  return new Builder()
}

Builder.prototype.program = function program() {
  this.type = 'Program'
  return this
}

// Please do not add any additional helpers above this line.
// When adding a new helper, please put them in alphabetical order.
// It makes digging through the code significantly easier.

Builder.and = function() {
  if (arguments.length < 2) {
    throw new Error('and requires two arguments')
  }

  if (arguments.length === 2) {
    return E.LOGICAL(arguments[0], '&&', arguments[1])
  }

  const args = new Array(arguments.length)
  for (let i = 0; i < arguments.length; i++) {
    args[i] = arguments[i]
  }

  return AND(args)
}

Builder.prototype.and = function and(left, right) {
  return this.push(Builder.and(left, right))
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

Builder.prototype.array = function array(items) {
  return this.push(Builder.array(items))
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

Builder.callFunction = function(fnName, args) {
  return E.CALL(ast.objectPath(fnName), args)
}

Builder.prototype.callFunction = function callFunction(fnName, args) {
  return this.push(Builder.callFunction(fnName, args))
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

Builder.equals = function(left, right) {
  return E.BINARY(left, '===', right)
}

Builder.prototype.equals = function equals(left, right) {
  return this.push(Builder.equals(left, right))
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

Builder.not = function(arg) {
  return E.UNARY('!', arg, true)
}

Builder.prototype.not = function not(arg) {
  return this.push(Builder.not(arg))
}

Builder.prototype.number = function number(val) {
  return this.push(Builder.number(val))
}

Builder.or = function(left, right) {
  return E.LOGICAL(left, '||', right)
}

Builder.prototype.or = function or(left, right) {
  return this.push(Builder.or(left, right))
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

Builder.returns = function(arg) {
  return S.RETURN(arg)
}

Builder.prototype.returns = function returns(arg) {
  return this.push(Builder.returns(arg))
}

Builder.prototype.string = function string(val) {
  return this.push(Builder.string(val))
}

Builder.prototype.throws = function throws(arg) {
  return this.push(S.THROWS(arg))
}

Builder.typeof = function(str) {
  return E.TYPEOF(ast.objectPath(str))
}

Builder.prototype.typeof = function(str) {
  return this.push(Builder.typeof(str))
}

Builder.prototype.use = function use(n) {
  const str = `use ${n}`
  const ele = S.EXPRESSION(ast.string(str))
  return this.push(ele)
}

// say we have args.length === 3
// we will end up with this
// E.LOGICAL(args[0], '&&', E.LOGICAL(
//   args[1], '&&', args[2]
// ))
function AND(args) {
  args = args.slice()
  let right
  let left = args.shift()
  while (args.length) {
    right = args.shift()
    left = E.LOGICAL(left, '&&', right)
  }

  return left
}
