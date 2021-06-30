import app from './backendSrc/app';
import logger from './backendSrc/logging/logger';

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    logger.info(`server.started.listening.port.${PORT}`)
});

export { }