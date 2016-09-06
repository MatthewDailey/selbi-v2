import fs from 'fs';
import path from 'path';
import register from 'babel-core/register';
import Module from 'module';
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
const mock = require('mock-require');
chai.use(dirtyChai);

global.expect = expect;

const originalFindPath = Module._findPath;

// This code is copy pasta from http://lidatang.com/setup-mocha-testing-react-native/
// It always prefers the iOS version of a module.

Module._findPath = (request, paths) => {
  let filename = originalFindPath(request, paths);
  if (!filename) {
    const cacheKey = JSON.stringify({ request: request, paths: paths });
    for (let i = 0, numPaths = paths.length; i < numPaths; i++) {
      const basePath = path.resolve(paths[i], request);
      try {
        filename = fs.realpathSync(path.resolve(basePath, 'index.ios.js'), Module._realpathCache);
      } catch (ex) {
        try {
          filename = fs.realpathSync(`${basePath}.ios.js`, Module._realpathCache);
        } catch (e) {
          // Do nothing, fileName undefined.
        }
      }
      if (filename) {
        Module._pathCache[cacheKey] = filename;
      }
    }
  }
  return filename;
};

// Ignore all node_modules except these
const modulesToCompile = [
  'react-native-gifted-chat',
  'react-native-material-kit',
  'react-native-vector-icons',
  'react-native-scrollable-tab-view',
].map((moduleName) => new RegExp(`/node_modules/${moduleName}`));
const rcPath = path.join(__dirname, '..', '.babelrc');
const source = fs.readFileSync(rcPath).toString();
const config = JSON.parse(source);
config.ignore = (filename) => {
  if (!(/\/node_modules\//).test(filename)) {
    return false;
  }
  const matches = modulesToCompile.filter((regex) => regex.test(filename));
  const shouldIgnore = matches.length === 0;
  return shouldIgnore;
};

register(config);
// Setup globals / chai
global.__DEV__ = true;

mock('Dimensions', {
  get() {
    return { width: 100, height: 100 };
  },
});
