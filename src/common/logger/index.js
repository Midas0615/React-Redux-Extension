const logger = {};

const callMethod = (type) => (...args) => console[type](...args);

['log', 'info', 'warn', 'error'].forEach((key) => {
  logger[key] = callMethod(key);
});

export default logger;
