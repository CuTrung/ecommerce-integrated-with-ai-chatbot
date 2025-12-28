-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vendor" ALTER COLUMN "slug" DROP NOT NULL;
