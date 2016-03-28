'use strict'

exports.EXPRESSION = function EXPRESSION(expr) {
  return {
    type: 'ExpressionStatement'
  , expression: expr
  }
}

exports.FOR = function FOR(init, test, update, body) {
  return {
    type: 'ForStatement'
  , init: init
  , test: test
  , update: update
  , body: body
  }
}

exports.THROWS = function THROWS(arg) {
  return {
    type: 'ThrowStatement'
  , argument: arg
  }
}

exports.BLOCK = function BLOCK(body) {
  return {
    type: 'BlockStatement'
  , body: body || []
  }
}

exports.RETURN = function RETURN(arg) {
  return {
    type: 'ReturnStatement'
  , argument: arg
  }
}

exports.IF = function IF(test, block, alt) {
  if (alt) {
    return {
      type: 'IfStatement'
    , test: test
    , consequent: block
    , alternate: alt
    }
  }

  return {
    type: 'IfStatement'
  , test: test
  , consequent: block
  }
}
