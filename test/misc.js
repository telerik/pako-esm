/*global describe, it*/


'use strict';


import fs from 'fs';
import path from 'path';
import assert from 'assert';
import pako from '../lib/main';
import { cmpBuf as cmp } from './helpers';

describe('ArrayBuffer', function () {

  var file   = path.join(__dirname, 'fixtures/samples/lorem_utf_100k.txt');
  var sample = new Uint8Array(fs.readFileSync(file));
  var deflated = pako.deflate(sample);

  it('Deflate ArrayBuffer', function () {
    assert.ok(cmp(deflated, pako.deflate(sample.buffer)));
  });

  it('Inflate ArrayBuffer', function () {
    assert.ok(cmp(sample, pako.inflate(deflated.buffer)));
  });

  it('Simplified minified version test', function () {
    // At some point minifier started to corrupt str2buf function
    // https://github.com/nodeca/pako/issues/161#issuecomment-468420555
    var minified = require('../dist/pako.min.js');

    assert.ok(cmp(minified.deflate('→'), pako.deflate('→')));
  });
});
