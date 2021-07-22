'use strict';

import { assert, describe, it } from 'vitest';

import zlib from 'zlib';
import * as pako from '../lib/main';
import * as helpers from './helpers';
import fs from 'fs';
import path from 'path';
import b from 'buffer-from';

describe('Deflate dictionary', function () {

  it('handles multiple pushes', function () {
    var dict = b('abcd');
    var deflate = new pako.Deflate({ dictionary: dict });

    deflate.push(b('hello'), false);
    deflate.push(b('hello'), false);
    deflate.push(b(' world'), true);

    if (deflate.err) { throw new Error(deflate.err); }

    var uncompressed = pako.inflate(b(deflate.result), { dictionary: dict });

    if (!helpers.cmpBuf(b('hellohello world'), uncompressed)) {
      throw new Error('Result not equal for p -> z');
    }
  });
});


describe('Deflate issues', function () {

  it('#78', function () {
    var data = fs.readFileSync(path.join(__dirname, 'fixtures', 'issue_78.bin'));
    var deflatedPakoData = pako.deflate(data, { memLevel: 1 });
    var inflatedPakoData = pako.inflate(deflatedPakoData);

    assert.equal(data.length, inflatedPakoData.length);
  });
});
