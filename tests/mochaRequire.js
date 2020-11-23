const chai = require('chai');
const path = require('path');
const utils = require('./utils');

global.chai = chai;
global._root = path.resolve(require.main.filename);
global.utils = utils;
