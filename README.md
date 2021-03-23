# circllhist.js

[![Build Status](https://www.travis-ci.org/openhistogram/circllhist.js.svg?branch=master)](https://www.travis-ci.org/openhistogram/circllhist.js)

This is a javascript implementation of the OpenHistogram [libcircllhist](https://github.com/openhistogram/libcircllhist) library.


## Usage

```
var circllhist = require('./circllhist.js');

var h = new circllhist();
h.insert(1, 1);
h.insert(2, 2);
h.insert(3, 1);

