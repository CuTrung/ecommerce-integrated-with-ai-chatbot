-- AlterTable
ALTER TABLE "public"."Category" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."OrderItem" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Permission" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductImage" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Promotion" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Role" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."RolePermission" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ShoppingCart" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserVendorRole" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Vendor" ALTER COLUMN "createdBy" DROP NOT NULL;
