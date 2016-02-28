'use strict';

const bluebird = require('bluebird');
const fs = require('fs');

let blogs = [];

function findAll() {
  // Read all of the blogs into memory - this is NOT recommended ;-)
  let files = fs.readdirSync('./blogs');
  console.log(files);
}

// Populate the blogs array.
findAll();

// Exports
// TODO
