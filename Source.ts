class Shape{
  
}

class Source<T>{
  elem: T;

  constructor(elem: T) {
    this.elem = elem;
  }

  // next(f: (elem: T) => U) {
  //   end(f)
  // }

  end(f: (elem: T) => void): void {
    f(this.elem)
  }
}

class Sink<T>{
  // elem: T;
}

namespace Source {
  export function single<T>(elem: T) { return new Source<T>(elem) }
}

namespace Flow {
  export function single<T>(elem: T) { return new Source<T>(elem) }
}

namespace Sink {
  export const forEach = <T>(f: (elem: T) => void) => (elem: T) => f(elem)

  export const asyncForEach = <T>(f: (elem: T) => void) => async (elem: T) => { forEach(f)(elem) }
}

function f<T>(elem: T) {
  console.info(elem)
}

Source.single<number>(1).end(Sink.asyncForEach(f))

async function abc() {

}
