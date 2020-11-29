const winston = require("winston")

// init logger configs
const loggerConfigs = process.env.NODE_ENV === "production"
    ? ({
        level: process.env.RB_LOG_LEVEL || "error",
        format: winston.format.json(),
        defaultMeta: {
            service: "rbs"
        },
        transports: [
            new winston.transports.Console()
        ],
    })
    : ({
        level: "debug",
        format: winston.format.simple(),
        defaultMeta: {
            service: "rbs"
        },
        transports: [
            new winston.transports.Console()
        ],
    })

// export logger
module.exports = winston.createLogger(loggerConfigs)
