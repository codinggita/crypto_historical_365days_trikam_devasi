const logger = (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return next();
  }

  const start = Date.now();
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${req.ip}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    let colorStatus;

    if (status >= 200 && status < 300) {
      colorStatus = `\x1b[32m${status}\x1b[0m`; // green
    } else if (status >= 400) {
      colorStatus = `\x1b[31m${status}\x1b[0m`; // red
    } else {
      colorStatus = `\x1b[33m${status}\x1b[0m`; // yellow
    }

    const finishTimestamp = new Date().toISOString();
    console.log(`[${finishTimestamp}] ${req.method} ${req.originalUrl} - ${colorStatus} - ${duration}ms`);
  });

  next();
};

module.exports = logger;
