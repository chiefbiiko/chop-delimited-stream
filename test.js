var passthru = require('stream').PassThrough
var tape = require('tape')
var chop = require('./index')

var BUF419 = Buffer.from([ 0x00, 0x04, 0x01, 0x09, 0x04, 0x01, 0x09, 0x00 ])

tape('default delimiter is 419', function (t) {
  t.true(chop.DEFAULT_DELIMITER.equals(BUF419), 'default 419')
  t.end()
})

tape('tidy chops', function (t) {

  var choppa = chop()

  var msgs = [ 'chop', 'this', 'buffer', 'up' ]
  var actual = []
  var expected = [ 'chop', 'this', 'buffer', 'up' ]

  var input = msgs.map(function (piece, i) {
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

tape('dirty chops', function (t) {

  var choppa = chop()

  var msgs = [ 'chop', 'that', 'buffer', 'up' ]
  var actual = []
  var expected = [ 'chop', 'thatbuffer', 'up' ]

  var input = msgs.map(function (piece, i) {
    if (i === 1) return Buffer.from(piece)
    else return Buffer.concat([ Buffer.from(piece), BUF419 ])
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

tape('endless chops', function (t) {

  var choppa = chop() // arg trailing defaults to false

  var msgs = [ 'chop', 'this', 'buffer', 'up' ]
  var actual = []
  var expected = [ 'chop', 'this', 'buffer' ]

  var input = msgs.map(function (piece, i) {
    if (i === msgs.length - 1) return Buffer.from(piece)
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

tape('trailing chops', function (t) {

  var choppa = chop(BUF419, true) // trailing=true

  var msgs = [ 'chop', 'this', 'buffer', 'up' ]
  var actual = []
  var expected = [ 'chop', 'this', 'buffer', 'up' ]

  var input = msgs.map(function (piece, i) {
    if (i === msgs.length - 1) return Buffer.from(piece)
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

tape('delimiter head chops', function (t) {

  var choppa = chop()

  var actual = []
  var msgs = [ 'chop', 'this', 'buffer', 'up' ]
  var expected = [ 'chop', 'this', 'buffer', 'up' ]

  var input = msgs.map(function (piece, i) {
    if (!i) return Buffer.concat([ BUF419, Buffer.from(piece), BUF419 ])
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
