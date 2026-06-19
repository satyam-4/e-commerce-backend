import prisma from '../prisma/client.js';
import { logger } from '../config/logger.js';

export async function connectDB() {
    try {
        await prisma.$connect();    
        logger.info('PostgreSql Connected');
    } catch (error) {
        logger.error('PostgreSQL Connection Failed');
        throw error
    }
}