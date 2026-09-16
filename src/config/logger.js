import pino from "pino";

export const logger = pino({
    serializers: {
        err: pino.stdSerializers.err
    }
});