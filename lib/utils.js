'use strict'

const validIDRE = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/

exports.validIdentifier = function validIdentifier(v) {
  return validIDRE.test(v)
}
