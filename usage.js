var chop = require('./index')

var choppa = chop(Buffer.from('chop'))

process.stdin.pipe(choppa).pipe(process.stdout)
