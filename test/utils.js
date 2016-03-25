'use strict'

const test = require('tap').test
const utils = require('../lib/utils')

test('validIdentifier', (t) => {
  const v = utils.validIdentifier
  t.equal(v('a'), true)
  t.equal(v('-'), false)
  t.equal(v('abv_'), true)
  t.equal(v('$test'), true)
  t.equal(v('^test'), false)
  t.end()
})
