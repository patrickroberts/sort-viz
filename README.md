# ![logo](http://i.imgur.com/Z7OeWcu.png) sort-viz

Sorting Algorithm Visualizations

[![NPM Version][npm-image]][npm-url] [![Node Version][node-image]][npm-url] [![devDependencies][devdep-image]][npm-url] [![License][license-image]][license-url] [![Standard][style-image]][style-url] [![Github File Size][filesize-image]][filesize-url]

## About

This library of utilities for visualizing sorting algorithms is intended for educational purposes. Using an object-oriented approach, each algorithm is implemented by extending the native `Array` object with an overriden `Array#sort()` generator function, for interruptable control-flow. This allows each fundamental step in the process to be displayed and facilitate learning through observation.

### Contributions

Currently, this does not implement all sorting algorithms, nor does it visualize operations on auxillary data structures within any of the implementations that are not in-place.

Please help to make this project even better by submitting pull-requests with additional algorithms or support for arbitrary visualizations of operations other than `compare`, `swap`, `put`, and `key`.

#### To Do

- [x] `AbstractSortArray` base classes for core functionality of interruptable sorting algorithms.
- [x] Support for generic, externally supplied `compare` and `key` methods.
- [x] Displays the state of the array at each step.
- [ ] Displays the state of auxillary data structures at each step.
- [ ] Support for arbitrary extensions to interruptable operations.

## Installation

#### Via [`npm`][npm-url]

```bash
$ npm i sort-viz
```

#### Via [`git`][git-url]

```bash
$ git clone https://github.com/patrickroberts/sort-viz.git
$ cd sort-viz
$ npm i # install dependencies
```

### Demo

Available on [Heroku][demo-url].

### Documentation

Available on [gh-pages][docs-url].


## License

Available under the MIT License
(c) 2017 Patrick Roberts

[npm-url]: https://www.npmjs.com/package/sort-viz
[npm-image]: https://img.shields.io/npm/v/sort-viz.svg

[node-image]: https://img.shields.io/node/v/sort-viz.svg

[devdep-image]: https://img.shields.io/david/dev/patrickroberts/sort-viz.svg

[license-url]: https://github.com/patrickroberts/sort-viz/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg

[style-url]: https://standardjs.com/
[style-image]: https://img.shields.io/badge/style-standard-brightgreen.svg

[filesize-url]: https://github.com/patrickroberts/sort-viz/blob/master/umd/sort.min.js
[filesize-image]: https://img.shields.io/github/size/patrickroberts/sort-viz/umd/sort.min.js.svg

[git-url]: https://git-scm.com/

[demo-url]: https://sorts.herokuapp.com/
[docs-url]: https://patrickroberts.github.io/sort-viz
