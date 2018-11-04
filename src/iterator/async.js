async function* skip(iter, n) {
  let i = 0;
  for await (const x of iter) {
    i++;
    if (i > n) {
      yield x;
    }
  }
}

async function* map(iter, f) {
  for await (const x of iter) {
    yield f(x);
  }
}

async function* filter(iter, predicate) {
  for await (const x of iter) {
    if (predicate(x)) {
      yield x;
    }
  }
}

async function* use(iter, f) {
  for await (const x of iter) {
    f(x);
    yield x;
  }
}

class AsyncIterator {
  constructor(iter) {
    this.iter = iter;
  }

  use(f) {
    return asyncIterator(use(this.iter, f));
  }

  async take(n) {
    const collected = [];
    let i = 0;
    for await (const x of this.iter) {
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
    return asyncIterator(skip(this.iter, n));
  }

  map(f) {
    return asyncIterator(map(this.iter, f));
  }

  filter(predicate) {
    return asyncIterator(filter(this.iter, predicate));
  }

  async fold(init, reducer) {
    let val = init;
    for await (const x of this.iter) {
      val = reducer(val, x);
    }
    return val;
  }

  async collect() {
    const collected = [];
    for await (const x of this.iter) {
      collected.push(x);
    }
    return collected;
  }

  async forEach(f) {
    for await (const x of this.iter) {
      f(x);
    }
  }
}

function asyncIterator(iter) {
  return new AsyncIterator(iter);
}

export default asyncIterator;
