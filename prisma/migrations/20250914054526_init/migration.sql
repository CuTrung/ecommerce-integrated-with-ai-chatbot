-- DropForeignKey
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_productID_fkey";

-- AlterTable
ALTER TABLE "public"."ProductImage" ALTER COLUMN "productID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productID_fkey" FOREIGN KEY ("productID") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
