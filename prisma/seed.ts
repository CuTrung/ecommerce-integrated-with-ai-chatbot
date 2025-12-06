import { PrismaClient } from '@prisma/client';
import { camelCase, isEmpty } from 'es-toolkit/compat';
import * as faker from '../src/generated/faker/data';

const prisma = new PrismaClient();

const getModelDependencies = () => {
  const runtimeDataModel = (prisma as any)._runtimeDataModel;
  const models = runtimeDataModel.models;
  const dependencies = {};

  // Duyệt qua từng model
  Object.keys(models).forEach((modelName) => {
    const modelData = models[modelName];
    dependencies[modelName] = {};

    // Kiểm tra các fields của model
    const fields = modelData.fields;

    if (fields) {
      fields.forEach((field) => {
        const { name: fieldName } = field;

        // Nếu field có relationName và relationFromFields (là relation field)
        if (
          field.relationName &&
          field.relationFromFields &&
          field.relationFromFields.length > 0
        ) {
          const referencedModel = field.type;

          // Sử dụng tên field relation (ví dụ: "user")
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
    if (visited.has(modelName)) return;
    if (visiting.has(modelName)) {
      // Phát hiện circular dependency, thêm vào cuối
      return;
    }

    visiting.add(modelName);

    // Lấy tất cả các models được reference
    const referencedModels = new Set(
      Object.values<string>(dependencies[modelName]),
    );

    // Đệ quy visit các models được reference trước
    for (const refModel of referencedModels) {
      if (models.includes(refModel)) {
        visit(refModel);
      }
    }

    visiting.delete(modelName);
    visited.add(modelName);
    sorted.push(modelName);
  }

  // Visit tất cả models
  for (const model of models) {
    visit(model);
  }

  const data = {};
  for (const modelSorted of sorted) {
    data[modelSorted] = dependencies[modelSorted];
  }

  return data;
};

async function main() {
  const models = sortModelsByDependency();

  const relationModels = new Set([
    'RolePermission',
    'OrderPromotion',
    'UserVendorRole',
    'ProductCategory',
  ]);
  const referenceModelsSkip = new Set(['Category']);

  const modelsData = Object.keys(models);
  for (const model of modelsData) {
    if (relationModels.has(model)) continue;

    let quantityGenerate = 10;
    while (quantityGenerate > 0) {
      quantityGenerate--;
      const prismaModel = prisma[camelCase(model)];
      const skip = await prismaModel.count();

      const modelReferences = models[model];
      const idsReference = {};
      if (!isEmpty(modelReferences)) {
        for (const field of Object.keys(modelReferences)) {
          const modelReference = modelReferences[field];
          if (referenceModelsSkip.has(modelReference)) continue;

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

      const dataCreate = faker[`fake${model}`]();
      await prismaModel.create({
        data: { ...dataCreate, ...idsReference },
      });
    }
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
