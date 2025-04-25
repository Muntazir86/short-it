import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { Express } from 'express';

/**
 * Configure Swagger UI for API documentation
 * @param app Express application
 */
export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Short-It API Documentation',
  }));
  
  console.log('Swagger UI initialized at /api-docs');
};
