'use strict';

const bluebird = require('bluebird');
const fs = require('fs');
const _ = require('lodash');
const marked = require('marked');

const BLOG_DIRECTORY = './_blogs';
const FILENAME_REGEX = /^(\d{4}-\d{2}-\d{2})-([^(.md)]+).md$/;

let blogsBySlug = {};

function findAll() {
  // Read all of the blogs into memory - this is NOT recommended ;)
  let fileNames = fs.readdirSync(BLOG_DIRECTORY);
  _.forEach(fileNames, fileName => {
    try {
      let contents = fs.readFileSync(`${BLOG_DIRECTORY}/${fileName}`).toString();
      let timeAndSlug = parseTimeAndSlug(fileName);
      let slug = timeAndSlug.slug;
      let time = timeAndSlug.time;
      let lines = contents.split('\n');
      let res = parseMetadata(lines);
      let metadata = res.metadata;
      let body = parseSingleBlog(res.contents.join('\n'));
      blogsBySlug[slug] = { slug, time, metadata, body };
    } catch (err) {
      log.error({ err: err }, `unable to process blog: ${fileName}`);
    }
  });
}

function parseTimeAndSlug(fileName) {
  let match = fileName.match(FILENAME_REGEX);
  if (!match) {
    throw new Error('unable to parse time/slug from blog filename');
  }
  return {
    time: match[1],
    slug: match[2]
  };
}

function parseMetadata(lines) {
  let metadata = {};
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    let line = lines.shift();
    if (line.indexOf('---') === 0) {
      if (count === 0) { 
        count++;
      } else {
        break;
      }
    } else if (count === 1) {
      let res = parseMetadataLine(line);
      metadata[res['key']] = res['value'];
    }
  }
  return {
    metadata: metadata,
    contents: lines
  }
}

function parseMetadataLine(line) {
  let tokens = line.split(':');
  return {
    key: tokens[0],
    value: tokens[1].trim()
  }
}

function parseSingleBlog(contents) {
  return marked(contents);
}

function getBlogs() {
  return blogsBySlug;
}

// Populate the blogs array.
findAll();

// Exports
module.exports.getBlogs = getBlogs;
