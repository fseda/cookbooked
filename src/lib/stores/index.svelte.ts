export function createStore<T>(initial: T) {
  let value = $state(initial);

  return {
    get value() { return value },
    set value(newV) { value = newV },
  };
}