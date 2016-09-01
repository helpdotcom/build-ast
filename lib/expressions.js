'use strict'

exports.UNARY = function UNARY(op, arg, prefix) {
  return {
    type: 'UnaryExpression'
  , operator: op
  , prefix: prefix == null ? true : prefix
  , argument: arg
  }
}

exports.TYPEOF = function TYPEOF(arg) {
  return exports.UNARY('typeof', arg, true)
}

exports.BINARY = function BINARY(left, op, right) {
  return {
    type: 'BinaryExpression'
  , left: left
  , operator: op
  , right: right
  }
}

exports.LOGICAL = function LOGICAL(left, op, right) {
  return {
    type: 'LogicalExpression'
  , left: left
  , operator: op
  , right: right
  }
}

exports.ASSIGNMENT = function ASSIGNMENT(left, op, right) {
  return {
    type: 'AssignmentExpression'
  , left: left
  , operator: op
  , right: right
  }
}

exports.OBJECT = function OBJECT(props) {
  return {
    type: 'ObjectExpression'
  , properties: props
  }
}

exports.ARRAY = function ARRAY(items) {
  return {
    type: 'ArrayExpression'
  , elements: items
  }
}

exports.MEMBER = function MEMBER(obj, prop, computed) {
  return {
    type: 'MemberExpression'
  , object: obj
  , property: prop
  , computed: computed
  }
}

exports.NEW = function NEW(callee, args) {
  return {
    type: 'NewExpression'
  , callee: callee
  , arguments: args
  }
}

exports.CALL = function CALL(callee, args) {
  return {
    type: 'CallExpression'
  , callee: callee
  , arguments: args
  }
}

exports.THIS = function THIS() {
  return {
    type: 'ThisExpression'
  }
}

exports.UPDATE = function UPDATE(op, arg, pre) {
  return {
    type: 'UpdateExpression'
  , operator: op
  , prefix: pre || false
  , argument: arg
  }
}

exports.ARROW = function ARROW(args, body) {
  return {
    type: 'ArrowFunctionExpression'
  , id: null
  , generator: false
  , expression: false
  , params: args || []
  , body: body
  }
}

exports.FUNCTION = function(id, params, body, gen = false, exp = false) {
  return {
    type: 'FunctionExpression'
  , generator: gen
  , expression: exp
  , id: id
  , params: params
  , body: body
  }
}
