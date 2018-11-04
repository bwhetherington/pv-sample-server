// This file allows us to use import/export syntax

require = require('esm')(module);
module.exports = require('./main.js');
