var passthru = require('stream').PassThrough
var tape = require('tape')
var chop = require('./index')

var BUF419 = Buffer.from([ 0x00, 0x04, 0x01, 0x09, 0x04, 0x01, 0x09, 0x00 ])

tape('default delimiter is 419', function (t) {
  t.true(chop.DEFAULT_DELIMITER.equals(BUF419), 'default 419')
  t.end()
})

tape('chops', function (t) {

  var choppa = chop()

  var actual = []
  var expected = [ 'chop', 'this', 'buffer', 'up' ]

  var input = expected.map(function (piece, i) {
    return Buffer.concat([ Buffer.from(piece), BUF419 ])
  })

  function ondata (chunk) {
    actual.push(chunk.toString())
  }

  function onend () {
   t.same(actual, expected, 'same arrays')
   t.end()
  }

  choppa.on('data', ondata)
  choppa.on('end', onend)

  var pending = input.length

  input.forEach(function (chunk) {
    choppa.write(chunk)
    if (!--pending) choppa.end()
  })

})
