function* skip(iter, n) {
  let i = 0;
  for (const x of iter) {
    i++;
    if (i > n) {
      yield x;
    }
  }
}

function* map(iter, f) {
  for (const x of iter) {
    yield f(x);
  }
}

function* filter(iter, predicate) {
  for (const x of iter) {
    if (predicate(x)) {
      yield x;
    }
  }
}

function* use(iter, f) {
  for (const x of iter) {
    f(x);
    yield x;
  }
}

class Iterator {
  constructor(iter) {
    this.iter = iter;
  }

  use(f) {
    return iterator(use(this.iter, f));
  }

  take(n) {
    const collected = [];
    let i = 0;
    for (const x of this.iter) {
      if (i < n) {
        i++;
        collected.push(x);
      } else {
        break;
      }
    }
    return collected;
  }

  skip(n) {
    return iterator(skip(this.iter, n));
  }

  map(f) {
    return iterator(map(this.iter, f));
  }

  filter(predicate) {
    return iterator(filter(this.iter, predicate));
  }

  fold(init, reducer) {
    let val = init;
    for (const x of this.iter) {
      val = reducer(val, x);
    }
    return val;
  }

  collect() {
    const collected = [];
    for (const x of this.iter) {
      collected.push(x);
    }
    return collected;
  }

  forEach(f) {
    for (const x of this.iter) {
      f(x);
    }
  }
}

function iterator(iter) {
  return new Iterator(iter);
}

export default iterator;
