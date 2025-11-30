import { cleanupOpenApiDoc } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { applyMiddlewares } from './common/middlewares/common.middleware';

const removeRelations = (document: any) => {
  if (!document?.components?.schemas) return document;

  const schemas = document.components.schemas;

  for (const schemaName of Object.keys(schemas)) {
    const schema = schemas[schemaName];

    if (!schema?.properties) continue;

    const newProps = Object.keys(schema.properties).reduce((acc, propName) => {
      if (propName === 'data') return acc;
      const prop = schema.properties[propName];
      const isRelation = prop.type === 'object';
      if (!isRelation) {
        acc[propName] = prop;
        return acc;
      }

      if (!propName.endsWith('s')) {
        acc[`${propName}ID`] = { type: 'string' };
      }
      return acc;
    }, {});

    schema.properties = newProps;
  }

  return document;
};

const removeAuditFields = (document: any) => {
  const auditFields = [
    'id',
    'createdAt',
    'updatedAt',
    'createdBy',
    'updatedBy',
    'deletedAt',
  ];
  for (const schema of Object.values<any>(document.components.schemas)) {
    if (!schema.properties) continue;

    auditFields.forEach((k) => delete schema.properties[k]);

    if (Array.isArray(schema.required)) {
      schema.required = schema.required.filter(
        (field) => !auditFields.includes(field),
      );
    }
  }
  return document;
};

const initOpenAPI = (app: INestApplication) => {
  const { APP_NAME } = process.env;
  let openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(`${APP_NAME} API`)
      .setDescription(`${APP_NAME} API description`)
      .setVersion('1.0.0')
      .build(),
  );

  openApiDoc = removeAuditFields(openApiDoc);
  // openApiDoc = removeRelations(openApiDoc);
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(openApiDoc));
};

const initApp = (app: INestApplication) => {
  const { APP_PREFIX = '/api', FE_URL } = process.env;
  app.setGlobalPrefix(APP_PREFIX);
  if (FE_URL) {
    app.enableCors({
      origin: FE_URL,
    });
  }
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
