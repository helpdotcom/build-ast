'use strict'

const test = require('tap').test
const Builder = require('../')
const common = require('./common')
const gen = common.gen
const ast = Builder.ast
const S = ast.statement

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
        .throws(Builder.new('Error', [Builder.string('NOPE')]))
        .body[0]
    ])
    .assign('Event.prototype.checkEquality', Builder.function('', [
      'a', 'b', 'c'], [
      Builder.if(
        Builder.and(
          ast.objectPath('a')
        , ast.objectPath('b')
        , ast.objectPath('c')
      )
      , Builder.block(
          Builder.returns(ast.objectPath('true'))
        )
      , Builder.block(
          Builder.returns(ast.objectPath('false'))
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
    .throws(Builder.new('Error', [
      ast.templateLiteral([Builder.id('variable_name')], [
        ast.templateElement('Weird ', 'Weird ', false)
      , ast.templateElement('', '', true)
      ])
    ]))
    .assign('Event.debug', Builder.and(
      Builder.equals(
        ast.objectPath('process.env.DEBUG')
      , Builder.number(1)
      )
    , Builder.equals(
        ast.objectPath('process.env.NODE_DEBUG')
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
throw new Error(\`Weird \$\{ variable_name \}\`);
Event.debug = process.env.DEBUG === 1 && process.env.NODE_DEBUG === 1`)

  t.end()
})
