import winston from "winston";

const logger = winston.createLogger({
    level: "info",   // level thấp nhất sẽ được ghi (info trở lên: info, warn, error)
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),                          // in ra terminal
        new winston.transports.File({ filename: "logs/error.log", level: "error" }), // chỉ ghi error vào file
    ],
});

export default logger;