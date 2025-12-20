import { PrismaClient } from '@prisma/client';
import { camelCase, isEmpty } from 'es-toolkit/compat';
import * as faker from '../src/generated/faker/data';
import { parseArgs, ParseArgsOptionsConfig } from 'node:util';
import { USER_AI_MODEL_EMAIL } from '../src/common/services/ai/consts/ai.const';

const options: ParseArgsOptionsConfig = {
  environment: { type: 'string' },
};

const prisma = new PrismaClient();

const getModelDependencies = () => {
  const runtimeDataModel = (prisma as any)._runtimeDataModel;
  const models = runtimeDataModel.models;
  const dependencies = {};

  Object.keys(models).forEach((modelName) => {
    const modelData = models[modelName];
    dependencies[modelName] = {};

    const fields = modelData.fields;

    if (fields) {
      fields.forEach((field) => {
        const { name: fieldName } = field;

        if (
          field.relationName &&
          field.relationFromFields &&
          field.relationFromFields.length > 0
        ) {
          const referencedModel = field.type;

          dependencies[modelName][fieldName] = referencedModel;
        }
      });
    }
  });

  return dependencies;
};

const sortModelsByDependency = () => {
  const dependencies = getModelDependencies();
  const models = Object.keys(dependencies);
  const sorted: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(modelName: string) {
    if (visited.has(modelName) || visiting.has(modelName)) return;

    visiting.add(modelName);

    const referencedModels = new Set(
      Object.values<string>(dependencies[modelName]),
    );

    for (const refModel of referencedModels) {
      if (models.includes(refModel)) {
        visit(refModel);
      }
    }

    visiting.delete(modelName);
    visited.add(modelName);
    sorted.push(modelName);
  }

  for (const model of models) {
    visit(model);
  }

  const data = {};
  for (const modelSorted of sorted) {
    data[modelSorted] = dependencies[modelSorted];
  }

  return data;
};

const createUserAIModel = async () => {
  const userModel = await prisma.user.findUnique({
    where: { email: USER_AI_MODEL_EMAIL },
  });
  if (!isEmpty(userModel)) return;

  await prisma.user.create({
    data: {
      email: USER_AI_MODEL_EMAIL,
      firstName: 'User AI Model',
      fullAddress: '',
      password: crypto.randomUUID(),
    },
  });
};

const migrateForDevelopment = async () => {
  const models = sortModelsByDependency();
  const fieldsRelationSkip = new Set(['parent']);
  for (const model of Object.keys(models)) {
    let quantityGenerate = 10;
    while (quantityGenerate > 0) {
      quantityGenerate--;
      const prismaModel = prisma[camelCase(model)];
      const skip = await prismaModel.count();

      const modelReferences = models[model];
      const idsReference = {};
      if (!isEmpty(modelReferences)) {
        for (const field of Object.keys(modelReferences)) {
          if (fieldsRelationSkip.has(field)) continue;

          const modelReference = modelReferences[field];
          const modelReferenceCamel = camelCase(modelReference);
          const [rootDataModelFirst] = await prisma[
            modelReferenceCamel
          ].findMany({
            select: { id: true },
            take: 1,
            skip,
          });
          if (!rootDataModelFirst) continue;

          idsReference[`${modelReferenceCamel}ID`] = rootDataModelFirst.id;
        }
      }

      const dataCreate = faker[`fake${model}`]?.() ?? {};
      await prismaModel.create({
        data: { ...dataCreate, ...idsReference },
      });
    }
  }
  await createUserAIModel();
};

const main = async () => {
  const {
    values: { environment },
  } = parseArgs({ options });

  switch (environment) {
    case 'dev':
      return await migrateForDevelopment();
    case 'prod':
      break;
    default:
      break;
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
