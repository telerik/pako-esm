/* eslint-disable */

function _has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function assign(obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    var source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (var p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
}


// reduce buffer size, avoiding mem copy
export function shrinkBuf(buf, size) {
  if (buf.length === size) { return buf; }
  if (buf.subarray) { return buf.subarray(0, size); }
  buf.length = size;
  return buf;
}

var fnTyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
      return;
    }
    // Fallback to ordinary array
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    var i, l, len, pos, chunk, result;

    // calculate data length
    len = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }

    // join chunks
    result = new Uint8Array(len);
    pos = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  },
  Buf8: function(size) {
    return new Uint8Array(size);
  },
  Buf16: function(size) {
    return new Uint16Array(size);
  },
  Buf32: function(size) {
    return new Int32Array(size);
  }
};

var fnUntyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    return [].concat.apply([], chunks);
  },
  Buf8: function(size) {
    return new Array(size);
  },
  Buf16: function(size) {
    return new Array(size);
  },
  Buf32: function(size) {
    return new Array(size);
  }
};

let typedOK = () => {
  const supported =
    (typeof Uint8Array !== 'undefined') &&
    (typeof Uint16Array !== 'undefined') &&
    (typeof Int32Array !== 'undefined');

  typedOK = () => supported;
  return supported;
}

export let arraySet = (dest, src, src_offs, len, dest_offs) => {
  arraySet = typedOK() ?
    fnTyped.arraySet : fnUntyped.arraySet;

  return arraySet(dest, src, src_offs, len, dest_offs);
}

export let flattenChunks = (chunks) => {
  flattenChunks = typedOK() ?
    fnTyped.flattenChunks : fnUntyped.flattenChunks;

  return flattenChunks(chunks);
}

export let Buf8 = (size) => {
  Buf8 = typedOK() ? fnTyped.Buf8 : fnUntyped.Buf8;
  return Buf8(size);
}

export let Buf16 = (size) => {
  Buf16 = typedOK() ? fnTyped.Buf16 : fnUntyped.Buf16;
  return Buf16(size);
}

export let Buf32 = (size) => {
  Buf32 = typedOK() ? fnTyped.Buf32 : fnUntyped.Buf32;
  return Buf32(size);
}

export function setTyped(on) {
  arraySet = on ? fnTyped.arraySet : fnUntyped.arraySet;
  flattenChunks = on ? fnTyped.flattenChunks : fnUntyped.flattenChunks;
  Buf8 = on ? fnTyped.Buf8 : fnUntyped.Buf8;
  Buf16 = on ? fnTyped.Buf16 : fnUntyped.Buf16;
  Buf32 = on ? fnTyped.Buf32 : fnUntyped.Buf32;
}
