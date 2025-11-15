/*
  Warnings:

  - You are about to drop the column `createdAt` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `UserVendorRole` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserVendorRole` table. All the data in the column will be lost.
  - You are about to drop the `ShoppingCart` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ShoppingCart" DROP CONSTRAINT "ShoppingCart_productID_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShoppingCart" DROP CONSTRAINT "ShoppingCart_userID_fkey";

-- AlterTable
ALTER TABLE "public"."OrderItem" DROP COLUMN "createdAt",
DROP COLUMN "createdBy";

-- AlterTable
ALTER TABLE "public"."Permission" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductImage" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserVendorRole" DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "public"."ShoppingCart";
