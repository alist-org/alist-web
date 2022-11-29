export async function* asyncPool<IN, OUT>(
  poolLimit: number,
  array: Array<IN>,
  iteratorFn: (generator: IN, array?: Array<IN>) => Promise<OUT>
): AsyncIterableIterator<OUT> {
  const executing = new Set()
  async function consume() {
    const [promise, value] = (await Promise.race(executing)) as any
    executing.delete(promise)
    return value
  }
  for (const item of array) {
    // Wrap iteratorFn() in an async fn to ensure we get a promise.
    // Then expose such promise, so it's possible to later reference and
    // remove it from the executing pool.
    const promise: any = (async () => await iteratorFn(item, array))().then(
      (value) => [promise, value]
    )
    executing.add(promise)
    if (executing.size >= poolLimit) {
      yield await consume()
    }
  }
  while (executing.size) {
    yield await consume()
  }
}
