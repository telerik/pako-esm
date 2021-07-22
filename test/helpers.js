'use strict';

import { assert } from 'vitest';
import fs from 'fs';
import path from 'path';
import b from 'buffer-from';
import { setTyped, Buf8 } from '../lib/utils/common';
import * as pako from '../lib/main';

// Load fixtures to test
// return: { 'filename1': content1, 'filename2': content2, ...}
//
function loadSamples(subdir) {
  var result = {};
  var dir = path.join(__dirname, 'fixtures', subdir || 'samples');

  fs.readdirSync(dir).sort().forEach(function (sample) {
    var filepath = path.join(dir, sample),
        extname  = path.extname(filepath),
        basename = path.basename(filepath, extname),
        content  = new Uint8Array(fs.readFileSync(filepath));

    if (basename[0] === '_') { return; } // skip files with name, started with dash

    result[basename] = content;
  });

  return result;
}


// Compare 2 buffers (can be Array, Uint8Array, Buffer).
//
function cmpBuf(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  for (var i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      console.log('pos: ' +i+ ' - ' + a[i].toString(16) + '/' + b[i].toString(16));
      return false;
    }
  }

  return true;
}

function testInflate(samples, inflateOptions, deflateOptions) {
  var name, data, deflated, inflated;

  // inflate options have windowBits = 0 to force autodetect window size
  //
  for (name in samples) {
    if (!samples.hasOwnProperty(name)) continue;
    data = samples[name];

    // always use the same data type to generate sample
    setTyped(true);
    deflated = pako.deflate(data, deflateOptions);

    // with untyped arrays
    setTyped(false);
    inflated = pako.inflate(deflated, inflateOptions);
    assert.deepEqual(new Uint8Array(inflated), data);

    // with typed arrays
    setTyped(true);
    inflated = pako.inflate(deflated, inflateOptions);
    assert.deepEqual(inflated, data);
  }
}

export { cmpBuf, testInflate, loadSamples };
