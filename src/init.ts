import { cleanupOpenApiDoc } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { applyMiddlewares } from './common/middlewares/common.middleware';

const removeFieldsAndRelations = (document: any) => {
  const auditFields = new Set([
    'id',
    'userID',
    'createdAt',
    'updatedAt',
    'createdBy',
    'deletedAt',
    'data',
  ]);

  const schemas = document?.components?.schemas;
  if (!schemas) return document;

  for (const schema of Object.values<any>(schemas)) {
    if (!schema.properties) continue;

    const newProps: Record<string, any> = {};

    for (const [propName, prop] of Object.entries<any>(schema.properties)) {
      if (auditFields.has(propName)) continue;

      // If it's a relation (object type) and singular (doesn't end with 's')
      if (prop?.type === 'object' && !propName.endsWith('s')) {
        newProps[`${propName}ID`] = { type: 'string' };
      } else if (prop?.type !== 'object') {
        // Keep non-relation fields
        newProps[propName] = prop;
      }
    }

    schema.properties = newProps;

    // Filter required fields
    if (Array.isArray(schema.required)) {
      schema.required = schema.required.filter(
        (field) => !auditFields.has(field),
      );
    }
  }

  return document;
};

const initOpenAPI = (app: INestApplication) => {
  const { APP_NAME, APP_PREFIX = '' } = process.env;
  let openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(`${APP_NAME} API`)
      .setDescription(`${APP_NAME} API description`)
      .setVersion('1.0.0')
      .build(),
  );

  openApiDoc = removeFieldsAndRelations(openApiDoc);
  SwaggerModule.setup(APP_PREFIX, app, cleanupOpenApiDoc(openApiDoc));
};

const initApp = (app: INestApplication) => {
  const { APP_PREFIX = '/api', FE_URL } = process.env;
  app.setGlobalPrefix(APP_PREFIX);
  app.enableCors({
    origin: FE_URL ? JSON.parse(FE_URL) : ['*'],
  });
  // app.enableVersioning({
  //   type: VersioningType.HEADER,
  //   header: 'x-api-version',
  //   defaultVersion: '1',
  // });
  applyMiddlewares(app);
  initOpenAPI(app);
  app.enableShutdownHooks();
  return app;
};
export { initApp };
