'use strict'

const tap = require('tap')

if (require.main === module) {
  tap.pass('ok')
  return
}

const generate = require('escodegen').generate

exports.gen = function gen(a) {
  return generate(a, exports.genOpts)
}

exports.genOpts = {
  format: {
    indent: {
      style: '  '
    , base: 0
    , adjustMultilineComment: false
    }
  , space: ' '
  , json: false
  , quotes: 'single'
  , semicolons: false
  , compact: false
  }
}
