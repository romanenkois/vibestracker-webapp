import { Observable } from 'rxjs';

export function runInWorker<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult,
  ...args: TArgs
): Observable<TResult> {
  return new Observable<TResult>((observer) => {
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
      if (error) {
        observer.error(new Error(error));
        observer.complete();
      } else {
        observer.next(result);
        observer.complete();
      }
      worker.terminate();
    };

    worker.onerror = (err) => {
      observer.error(new Error(err.message));
      observer.complete();
      worker.terminate();
    };

    worker.postMessage([fnString, args]);

    // Return cleanup function for when observable is unsubscribed
    return () => {
      worker.terminate();
    };
  });
}
