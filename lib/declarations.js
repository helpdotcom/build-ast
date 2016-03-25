'use strict'

exports.FUNCTION = function FUNCTION(id, params, body, gen, exp) {
  return {
    type: 'FunctionDeclaration'
  , generator: gen || false
  , expression: exp || false
  , id: id
  , params: params
  , body: body
  }
}

exports.VARIABLE = function VARIABLE(decls, type) {
  return {
    type: 'VariableDeclaration'
  , declarations: decls
  , kind: type
  }
}

exports.CONST = function CONST(decls) {
  return exports.VARIABLE(decls, 'const')
}

exports.VAR = function VAR(decls) {
  return exports.VARIABLE(decls, 'var')
}

exports.LET = function LET(decls) {
  return exports.VARIABLE(decls, 'let')
}
