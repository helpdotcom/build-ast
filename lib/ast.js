'use strict'

exports.declaration = require('./declarations')
exports.expression = require('./expressions')
exports.statement = require('./statements')
exports.utils = require('./utils')

exports.literal = function literal(value, raw) {
  if (arguments.length === 2) {
    return {
      type: 'Literal'
    , value: value
    , raw: raw
    }
  }

  return {
    type: 'Literal'
  , value: value
  }
}

exports.string = function string(val) {
  return exports.literal(String(val))
}

exports.number = function number(val) {
  const item = +val
  if (item < 0) {
    return exports.expression.UNARY('-', exports.literal(item * -1), true)
  }
  return exports.literal(item)
}

exports.regex = function regex(val, raw, pattern, flags) {
  return {
    type: 'Literal'
  , value: val
  , raw: raw
  , regex: {
      pattern: pattern
    , flags: flags
    }
  }
}

exports.identifier = function identifier(name) {
  return {
    type: 'Identifier'
  , name: name
  }
}

exports.property = function property(key, val, kind) {
  return {
    type: 'Property'
  , method: false
  , shorthand: false
  , computed: false
  , key: key
  , value: val
  , kind: kind || 'init'
  }
}

exports.templateElement = function templateElement(raw, cooked, tail) {
  return {
    type: 'TemplateElement'
  , value: {
      raw: raw
    , cooked: cooked
    }
  , tail: tail
  }
}

exports.templateLiteral = function templateLiteral(exprs, quasis) {
  return {
    type: 'TemplateLiteral'
  , expressions: exprs
  , quasis: quasis
  }
}

exports.objectPath = function objectPath(str) {
  if (!~str.indexOf('.')) {
    return exports.identifier(str)
  }

  const splits = str.split('.')

  var prop = splits.pop()
  const out = exports.expression.MEMBER(null, null, false)
  if (prop[0] === '^') {
    prop = prop.slice(1)
    out.computed = true
  }
  if (exports.utils.validIdentifier(prop)) {
    out.property = exports.identifier(prop)
  } else {
    out.property = exports.literal(prop)
    out.computed = true
  }

  if (splits.length === 1) {
    const s = splits.pop()
    out.object = exports.identifier(s)
  } else {
    out.object = exports.objectPath(splits.join('.'))
  }

  return out
}
