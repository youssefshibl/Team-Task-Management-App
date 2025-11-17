import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';

const logDir = join(process.cwd(), 'logs');

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf((info) => {
          const timestamp = String(info.timestamp);
          const level = String(info.level);
          const message = String(info.message);
          const stack =
            info.stack && typeof info.stack === 'string'
              ? `\n${info.stack}`
              : '';
          return `${timestamp} [${level}]: ${message}${stack}`;
        }),
      ),
    }),

    // File transport for all logs
    new winston.transports.File({
      filename: join(logDir, 'combined.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // File transport for errors only
    new winston.transports.File({
      filename: join(logDir, 'error.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
};
