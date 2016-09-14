export default undefined;

export function testSafeWorker(worker, done) {
  return (data, progress, resolve, reject) => {
    try {
      worker(data);
      resolve();
      done();
    } catch (e) {
      reject(e);
      done(e);
    }
  };
}
