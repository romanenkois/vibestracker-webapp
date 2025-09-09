export function runInWorker<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult,
  ...args: TArgs
): Promise<TResult> {
  return new Promise((resolve, reject) => {
    const fnString = fn.toString();

    const workerBlob = new Blob(
      [
        `
        self.onmessage = async (e) => {
          const [fnString, args] = e.data;
          const fn = new Function('return (' + fnString + ')')();
          try {
            const result = await fn(...args);
            self.postMessage({ result });
          } catch (err) {
            self.postMessage({ error: err.toString() });
          }
        };
      `,
      ],
      { type: 'application/javascript' },
    );

    const worker = new Worker(URL.createObjectURL(workerBlob));

    worker.onmessage = (e) => {
      const { result, error } = e.data;
      if (error) reject(error);
      else resolve(result);
      worker.terminate();
    };

    worker.onerror = (err) => {
      reject(err.message);
      worker.terminate();
    };

    worker.postMessage([fnString, args]);
  });
}
