# chop-delimited-stream

[![build status](http://img.shields.io/travis/chiefbiiko/chop-delimited-stream.svg?style=flat)](http://travis-ci.org/chiefbiiko/chop-delimited-stream) [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/chop-delimited-stream?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/chop-delimited-stream)

***

## Get it!

```
npm install --save chop-delimited-stream
```

***

## Usage

``` js
var chop = require('chop-delimited-stream')

var choppa = chop(Buffer.from('chop')) // delimiter must be a buffer

process.stdin.pipe(choppa).pipe(process.stdout)
```

***

## API

### `chop([delimiter][, trailing])`

Create a new choppa stream. `delimiter` must be a buffer, defaults to: `00 04 01 09 04 01 09 00`. `trailing` indicates whether to flush any non-delimited chunks at the end of the stream, defaults to `false`.

***

## License

[MIT](./license.md)
