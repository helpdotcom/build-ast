# build-ast

Make build AST nodes easy

## Install

```bash
$ npm install [--save] @helpdotcom/build-ast
```

## Test

```bash
$ npm test
```

## Example

```js
'use strict'

const B = require('@helpdotcom/build-ast')
const toCode = require('escodegen').generate

// 'use strict'
const b = B().use('strict')

// `typeof opts.name`
const left = B.typeof('opts.name')

// `'string'`
const right = B.string('string')

// `typeof opts.name !== 'string'`
const check = B.notEquals(left, right)

// new TypeError('name must be a string')
const error = B.TypeError('name must be a string')

// const er = new TypeError('name must be a string')
// return setImmediate(cb, er)
const errorBlock = B()
  .declare('const', 'er', error)
  .returns(
    B.callFunction('setImmediate', [
      B.id('cb')
    , B.id('er')
    ])
  ).build()

// if (typeof opts.name !== 'string') {
//   const er = new TypeError('name must be a string')
//   return setImmediate(cb, er)
// }
const block = B()
block.if(check, B.block(errorBlock))
block.returns(
  B.callFunction('setImmediate', [
    B.id('cb')
  , B.ast.literal(null)
  , B.id('opts')
  ])
)

// module.exports = function validate(opts, cb) {}
b.module(B.function('validate', ['opts', 'cb'], block.build()))

console.log(toCode(b.program()))
```

which will print out:

```js
'use strict';
module.exports = function validate(opts, cb) {
  if (typeof opts.name !== 'string') {
    const er = new TypeError('name must be a string')
    return setImmediate(cb, er)
  }
  return setImmediate(cb, null, opts)
}
```

## API

See [`DOCS.md`](DOCS.md)

## Author

Evan Lucas

## License

MIT (See `LICENSE` for more info)
