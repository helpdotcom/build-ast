'use strict'

const ast = require('./ast')
const E = require('./expressions')
const S = require('./statements')

module.exports = Class

function Class() {
  if (!(this instanceof Class))
    return new Class()

  this._body = []
  this._type = null // ClassDeclaration or ClassExpression
  this._name = null
  this._superClass = null
}

Class.prototype.declaration = function declaration(name, superClass = null) {
  this._type = 'ClassDeclaration'
  this._name = name
  this._superClass = superClass
  return this
}

Class.prototype.expression = function expression(name, superClass = null) {
  this._type = 'ClassExpression'
  this._name = name
  this._superClass = superClass
  return this
}

Class.prototype.ctor = function ctor(args, body) {
  return this.method('constructor', args, body)
}

Class.prototype.method = function method(name, args, body, options) {
  const opts = Object.assign({
    computed: false
  , static: false
  }, options)

  const kind = name === 'constructor'
    ? name
    : 'method'

  // Replace string args with identifiers
  const args_ = args.map((item) => {
    if (typeof item === 'string') return ast.identifier(item)
    return item
  })

  // If it is an array, wrap it in a BlockStatement
  // Otherwise, just pass through
  const body_ = Array.isArray(body)
    ? S.BLOCK(body)
    : body

  return this.push({
    type: 'MethodDefinition'
  , computed: opts.computed
  , static: opts.static
  , kind: kind
  , key: ast.identifier(name)
  , value: E.FUNCTION(null, args_, body_)
  })
}

Class.prototype.push = function push(item) {
  this._body.push(item)
  return this
}

Class.prototype.build = function build() {
  const s = this._superClass
    ? ast.identifier(this._superClass)
    : null
  return {
    type: this._type
  , id: ast.identifier(this._name)
  , superClass: s
  , body: {
      type: 'ClassBody'
    , body: this._body
    }
  }
}
