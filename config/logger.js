const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

/* EXAMPLE LOGS
[0] 2019-10-17 14:56:22 || info || Express || Server started on port 5000
[0] 2019-10-17 14:56:23 || warn || React   || MongoDB Connected....
*/

//Formatter
const logFormat = winston.format.combine(
	winston.format.colorize(),
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	winston.format.printf(log => {
		//Supports logging from React frontend or express backend
		let source = log.source;
		//Sets the source depending on who sent it
		if (source === undefined) {
			return `${log.timestamp} || ${log.level} || Express || ${log.message}`;
		} else
			return `${log.timestamp} || ${log.level} || ${log.source}   || ${log.message}`;
	})
);
//Create logger
winston.loggers.add("serverLogger", {
	format: logFormat,
	transports: [
		// new DailyRotateFile({
		// 	filename: "./logs/express-%DATE%.log",
		// 	datePattern: "YYYY-MM-DD",
		// 	level: "info"
		// }),
		// new DailyRotateFile({
		// 	filename: "./logs/express-%DATE%.log",
		// 	datePattern: "YYYY-MM-DD",
		// 	level: "warn"
		// }),
		// new DailyRotateFile({
		// 	filename: "./logs/express-%DATE%.log",
		// 	datePattern: "YYYY-MM-DD",
		// 	level: "error"
		// }),
		// new DailyRotateFile({
		// 	filename: "./logs/express-exceptions-%DATE%.log",
		// 	datePattern: "YYYY-MM-DD",
		// 	level: "error",
		// 	handleExceptions: true
		// }),
		new winston.transports.Console({
			level: "info",
			handleExceptions: true
		}),
		new winston.transports.Console({
			level: "warn",
			handleExceptions: true
		}),
		new winston.transports.Console({
			level: "error",
			handleExceptions: true
		})
	]
});
/*  HOW TO USE LOGGER
logger.error("error");
logger.warn("warn");
logger.debug("debug");
*/
//Exports logger
const logger = winston.loggers.get("serverLogger");
module.exports = logger;
