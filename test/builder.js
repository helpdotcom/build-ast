'use strict'

const test = require('tap').test
const Builder = require('../')
const common = require('./common')
const gen = common.gen
const ast = Builder.ast
const S = ast.statement

test('Builder API', (t) => {
  const ignores = [
    'ast'
  , 'expression'
  , 'statement'
  , 'declaration'
  ]
  const keys = Object.keys(Builder).filter((item) => {
    return !~ignores.indexOf(item)
  })
  for (const key of keys) {
    t.type(Builder[key], 'function')
  }
  t.end()
})

test('Builder', (t) => {
  const b = Builder()
    .use('strict')
    .declare('const', 'http', Builder.require('http'))
    .declare('let', 'join', Builder.require('path', 'posix.join'))
    .module('Event')
    .assign('Event.VERSION', Builder.string('1.0.0'))
    .function('Event', ['buffer'], [
      Builder.ifNot(
        Builder.instanceOf(
          Builder.this()
        , Builder.id('Event')
        )
      , Builder.block(
          Builder.returns(Builder.new('Event', ['buffer']))
        )
      )
    , S.EXPRESSION(Builder.callFunction('this.setName', [
        Builder.id('obj')
      ]))
    , Builder()
        .throws(Builder.Error('NOPE'))
        .body[0]
    ])
    .assign('Event.prototype.checkEquality', Builder.function('', [
      'a', 'b', 'c'], [
      Builder.if(
        Builder.and(
          Builder.objectPath('a')
        , Builder.objectPath('b')
        , Builder.objectPath('c')
      )
      , Builder.block(
          Builder.returns(Builder.objectPath('true'))
        )
      , Builder.block(
          Builder.returns(Builder.objectPath('false'))
        )
      )
    ]))
    .assign('Event.prototype.names', Builder.array([
      Builder.string('a')
    , Builder.string('b')
    , Builder.string('c')
    ]))
    .assign('Event.prototype.ages', Builder.array([
      Builder.number('1')
    , Builder.number('2')
    , Builder.number('3')
    ]))
    .assign('Event.prototype.re', Builder.regex(/abc$/i))
    .assign('Event.prototype.re2', Builder.regex('/abc$/'))
    .assign('Event.TYPE', Builder.typeof('thing.function'))
    .throws(Builder.TypeError(
      ast.templateLiteral([Builder.id('variable_name')], [
        ast.templateElement('Weird ', 'Weird ', false)
      , ast.templateElement('', '', true)
      ])
    ))
    .throws(Builder.RangeError('NOPE'))
    .assign('Event.debug', Builder.and(
      Builder.equals(
        Builder.objectPath('process.env.DEBUG')
      , Builder.number(1)
      )
    , Builder.notEquals(
        Builder.objectPath('process.env.NODE_DEBUG')
      , Builder.number(1)
      )
    ))
    .program()

  t.equal(gen(b), `'use strict';
const http = require('http');
let join = require('path').posix.join;
module.exports = Event;
Event.VERSION = '1.0.0';
function Event(buffer) {
  if (!(this instanceof Event)) {
    return new Event(buffer)
  }
  this.setName(obj);
  throw new Error('NOPE')
}
Event.prototype.checkEquality = function (a, b, c) {
  if (a && b && c) {
    return true
  } else {
    return false
  }
};
Event.prototype.names = [
  'a',
  'b',
  'c'
];
Event.prototype.ages = [
  1,
  2,
  3
];
Event.prototype.re = /abc$/i;
Event.prototype.re2 = /abc$/;
Event.TYPE = typeof thing.function;
throw new TypeError(\`Weird \$\{ variable_name \}\`);
throw new RangeError('NOPE');
Event.debug = process.env.DEBUG === 1 && process.env.NODE_DEBUG !== 1`)

  t.end()
})
