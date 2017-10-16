
# CIFAR 10 Library for Javascript

As you know, [CIFAR-10](https://www.cs.toronto.edu/~kriz/cifar.html) is famous library in Deep Learning. In python, this library is easy to test, while it is difficult to manuplate it in Javascript. 

## Features

- based on stream : use less memory
- exclude data file : only adapter without data files
- general purpose : this is not design for only CIFAR-10


## How to use

This is quite simple, but you should run the `get_datasets.sh`, which is download an actual data file(CIFAR-10 binary version). 

```
var CIFAR10 = require('cifar-10');
var data = CIFAR10.load();

/*
   data = {
      X_train,
      y_train,
      X_test,
      y_test
   }
*/
```

### load(option) 

Returns train and test sets. You can give an option for mapper, path, filename, etc.

```


```
