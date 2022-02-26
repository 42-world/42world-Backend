import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import 'process';
import appRoot from 'app-root-path';

const logDir = `${appRoot}/logs`;

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const options = {
  file: {
    level: 'info',
    filename: `%DATE%.log`,
    dirname: logDir,
    maxFiles: 30,
    zippedArchive: true,
    format: combine(timestamp(), format.json()),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: combine(
      format.colorize(),
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      logFormat,
    ),
  },
};

export const logger = createLogger({
  transports: [
    new transports.DailyRotateFile(options.file),
    new transports.DailyRotateFile({
      ...options.file,
      level: 'error',
      filename: `%DATE%.error.log`,
    }),
  ],
  exceptionHandlers: [
    new transports.DailyRotateFile({
      ...options.file,
      level: 'error',
      filename: `%DATE%.exception.log`,
    }),
  ],
});

if (process.env.NODE_ENV !== 'prod') {
  logger.add(new transports.Console(options.console));
}
