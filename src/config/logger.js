import { createLogger, transports, format } from 'winston';

const { combine, timestamp, printf, colorize } = format;
const { Console } = transports;

const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

const logger = createLogger({
  format: combine(
    colorize(),
    timestamp(),
    printf(info => {
      return `${info.timestamp} [${info.level}]: ${info.message}`;
    })
  ),
  transports: [new Console(options.console)]
});

export default logger;
