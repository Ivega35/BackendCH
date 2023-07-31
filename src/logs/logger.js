import winston from 'winston'
import environmentConfig from '../config/environment.config.js'

const custom = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'cyan',
        fatal: 'red'
    }
}
winston.addColors(custom.colors)

const createLogger = env => {
    if (env === 'PROD') {
        return winston.createLogger({
            levels: custom.levels,
            transports: [
                new winston.transports.File({
                    filename: './logErrors.js',
                    level: 'fatal',
                    format: winston.format.simple()
                })
            ]
        })
    } else {
        return winston.createLogger({
            levels: custom.levels,
            transports: [
                new winston.transports.Console({
                    level: 'fatal',
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                }),
            ]
        })
    }
}

export default createLogger(environmentConfig.environment)