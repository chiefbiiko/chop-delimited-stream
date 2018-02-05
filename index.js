var Transform = require('stream').Transform
var inherits = require('util').inherits

var BUF419 = Buffer.from([ 0x00, 0x04, 0x01, 0x09, 0x04, 0x01, 0x09, 0x00 ])
var ZBUF0 = Buffer.alloc(0)

function Chop (delimiter, trailing) {
  if (!(this instanceof Chop)) return new Chop(delimiter, trailing)
  Transform.call(this)

  this._delimiter = Buffer.isBuffer(delimiter) ? delimiter : BUF419
  this._delimiter0 = this._delimiter[0]
  this._trailing = !!trailing
  this._stash = ZBUF0
}

inherits(Chop, Transform)

Chop.DEFAULT_DELIMITER = BUF419

Chop.prototype._transform = function transform (chunk, _, next) {
  for (var i = 0, head = 0, tail = chunk.length - 1; i < chunk.length; i++) {
    if (chunk[i] === this._delimiter0 &&
        chunk.slice(i, i + this._delimiter.length).equals(this._delimiter)) {
      this.push(Buffer.concat([ this._stash, chunk.slice(head, i) ]))
      this._stash = ZBUF0
      head = i + this._delimiter.length
    } else if (i === tail) {
      this._stash = chunk.slice(head, chunk.length)
      next()
    }
  }
}

Chop.prototype._final = function final (finish) {
  if (this._trailing && this._stash.length) this.push(this._stash)
  finish()
}

module.exports = Chop
