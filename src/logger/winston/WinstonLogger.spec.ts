import 'reflect-metadata';

import { WinstonLogger } from './WinstonLogger';

describe('WinstonLogger Test Suite', () => {
    it('should be defined', () => {
        const logger = new WinstonLogger();
        expect(logger.debug).toBeDefined();
        expect(logger.error).toBeDefined();
        expect(logger.info).toBeDefined();
    });
    it('should be called successfully', async () => {
        const logger = new WinstonLogger('America/Bogota', true);
        logger.debug('Debug');
        logger.info('Info %s', 'Info');
        logger.error('Error');
    });
});
