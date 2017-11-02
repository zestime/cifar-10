
# CIFAR 10 Library for Javascript


[![Build Status](https://travis-ci.org/zestime/cifar-10.svg?branch=master)](https://travis-ci.org/zestime/cifar-10) [![Coverage Status](https://coveralls.io/repos/github/zestime/cifar-10/badge.svg?branch=master)](https://coveralls.io/github/zestime/cifar-10?branch=master) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/cifar-10.png)](https://nodei.co/npm/cifar-10/)


As you know, [CIFAR-10](https://www.cs.toronto.edu/~kriz/cifar.html) is famous library in Deep Learning. In python, this library is easy to test, while it is difficult to manuplate it in Javascript. 

## Features

- based on stream : use less memory
- exclude data file : only adapter without data files
- general purpose : this is not design for only CIFAR-10


## How to use

This is quite simple, but you should run the `get_datasets.sh`, which downloads an actual data file(CIFAR-10 binary version). 

```
$ ./node_modules/cifar-10/get_datasets.sh
```

It will download data files and this script use `wget`. 
After that, you can access data by `load()`.

```
const CIFAR10 = require('cifar-10');
const { X_train, y_train, X_test, y_test } = await CIFAR10.load();

// or callback style

CIFAR10.load().then(function(data) {
  // data = { X_train, y_train, X_test, y_test }

});
```

## APIs

### Load(option) 

Return new promise to process data from given option.

```
option = {
  totalSize,    // the length of bytes for each case
  mapper,       // binary to matrix mapper
  trainFiles,   // array for files to be a training set
  testFiles,    // array for files to be a testing set
}
```
For example, [this example](https://github.com/zestime/cifar-10/blob/master/src/index.js#L42) is for CIFAR 10.

# Contributing

PR or issue reporting are always welcome.
Feel free to report or advice to this project.



