var Transform = require('stream').Transform
var inherits = require('util').inherits

var x040109 = Buffer.from([ 0x00, 0x04, 0x01, 0x09, 0x04, 0x01, 0x09, 0x00 ])
var ZBUF0 = Buffer.alloc(0)

function Chop (delimiter) {
  if (!(this instanceof Chop)) return new Chop(delimiter)
  Transform.call(this)

  this._D = Buffer.isBuffer(delimiter) ? delimiter : x040109

  this._D0 = this._D[0]
  this._stash = ZBUF0
}

inherits(Chop, Transform)

Chop.DEFAULT_DELIMITER = x040109

Chop.prototype._transform = function transform (chunk, _, next) {
  for (var i = 0, head = 0; i < chunk.length; i++) {
    if (chunk[i] === this._D0 &&
        chunk.slice(i, i + this._D.length).equals(this._D)) {
      this.push(Buffer.concat([ this._stash, chunk.slice(head, i)]))
      this._stash = ZBUF0
      head = i + this._D.length
    } else if (i === chunk.length - 1) {
      this._stash = chunk.slice(head, chunk.length)
      next()
    }
  }
}

Chop.prototype._final = function final (finish) {
  if (this._stash.length) this.push(this._stash)
  finish()
}

module.exports = Chop
