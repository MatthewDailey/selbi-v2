Selbi - Mobile App
==================

This package implements the Selbi mobile app in React Native

Testing
-------

We use [enzyme](https://github.com/airbnb/enzyme) with the
[enzyme react-native](https://github.com/airbnb/enzyme/blob/master/docs/guides/react-native.md) add
on along with [mocha](https://mochajs.org/). Basically we're copying Airbnb's stack.

To install deps:
- `npm i --save-dev enzyme`
- `npm i --save-dev react-addons-test-utils`
- `npm i --save-dev react-dom`

In addition, to transpile React Native modules for test, it's important that you run `mocha` with
the `--require tests/setup.js`. The `node_modules` to transpile are listed in `modulesToCompile`.

This is cheifly necessary for the `react-native-material-kit` dependency.

Redux
-----
To manage data in a complex application we use
[Redux](http://redux.js.org/docs/introduction/index.html).


Immutability
------------
Immutability makes it easy to reason about complex logic in a large application. To enforce
immutable data throughout the application we use
[Immutable.js](https://facebook.github.io/immutable-js/)

Styling
-------
For styling we use Material Design cus it's hella fresh.

- [react-native-material-kit](https://github.com/xinthink/react-native-material-kit)

For icons we use [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons).


Useful links
------------
- [React Reusble Components](https://facebook.github.io/react/docs/reusable-components.html) -
Includes info about property validation.