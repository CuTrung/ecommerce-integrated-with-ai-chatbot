/*
  Warnings:

  - You are about to drop the column `parentId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `OrderAddress` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `OrderPromotion` table. All the data in the column will be lost.
  - You are about to drop the column `promotionId` on the `OrderPromotion` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `ProductCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductImage` table. All the data in the column will be lost.
  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permissionId` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ShoppingCart` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ShoppingCart` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `UserVendorRole` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserVendorRole` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `UserVendorRole` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Vendor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderID,promotionID]` on the table `OrderPromotion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID,vendorID]` on the table `UserVendorRole` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userID` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderID` to the `OrderAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderID` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productID` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderID` to the `OrderPromotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promotionID` to the `OrderPromotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorID` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryID` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productID` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productID` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permissionID` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleID` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productID` to the `ShoppingCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleID` to the `UserVendorRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `UserVendorRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorID` to the `UserVendorRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderAddress" DROP CONSTRAINT "OrderAddress_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderPromotion" DROP CONSTRAINT "OrderPromotion_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderPromotion" DROP CONSTRAINT "OrderPromotion_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductCategory" DROP CONSTRAINT "ProductCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductCategory" DROP CONSTRAINT "ProductCategory_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShoppingCart" DROP CONSTRAINT "ShoppingCart_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShoppingCart" DROP CONSTRAINT "ShoppingCart_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserVendorRole" DROP CONSTRAINT "UserVendorRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserVendorRole" DROP CONSTRAINT "UserVendorRole_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserVendorRole" DROP CONSTRAINT "UserVendorRole_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Vendor" DROP CONSTRAINT "Vendor_userId_fkey";

-- DropIndex
DROP INDEX "public"."OrderPromotion_orderId_promotionId_key";

-- DropIndex
DROP INDEX "public"."UserVendorRole_userId_vendorId_key";

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "parentId",
ADD COLUMN     "parentID" TEXT;

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "userId",
ADD COLUMN     "userID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."OrderAddress" DROP COLUMN "orderId",
ADD COLUMN     "orderID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."OrderItem" DROP COLUMN "orderId",
DROP COLUMN "productId",
ADD COLUMN     "orderID" TEXT NOT NULL,
ADD COLUMN     "productID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."OrderPromotion" DROP COLUMN "orderId",
DROP COLUMN "promotionId",
ADD COLUMN     "orderID" TEXT NOT NULL,
ADD COLUMN     "promotionID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "vendorId",
ADD COLUMN     "vendorID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductCategory" DROP CONSTRAINT "ProductCategory_pkey",
DROP COLUMN "categoryId",
DROP COLUMN "productId",
ADD COLUMN     "categoryID" TEXT NOT NULL,
ADD COLUMN     "productID" TEXT NOT NULL,
ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productID", "categoryID");

-- AlterTable
ALTER TABLE "public"."ProductImage" DROP COLUMN "productId",
ADD COLUMN     "productID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_pkey",
DROP COLUMN "permissionId",
DROP COLUMN "roleId",
ADD COLUMN     "permissionID" TEXT NOT NULL,
ADD COLUMN     "roleID" TEXT NOT NULL,
ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleID", "permissionID");

-- AlterTable
ALTER TABLE "public"."ShoppingCart" DROP COLUMN "productId",
DROP COLUMN "userId",
ADD COLUMN     "productID" TEXT NOT NULL,
ADD COLUMN     "userID" TEXT;

-- AlterTable
ALTER TABLE "public"."UserVendorRole" DROP COLUMN "roleId",
DROP COLUMN "userId",
DROP COLUMN "vendorId",
ADD COLUMN     "roleID" TEXT NOT NULL,
ADD COLUMN     "userID" TEXT NOT NULL,
ADD COLUMN     "vendorID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Vendor" DROP COLUMN "userId",
ADD COLUMN     "userID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrderPromotion_orderID_promotionID_key" ON "public"."OrderPromotion"("orderID", "promotionID");

-- CreateIndex
CREATE UNIQUE INDEX "UserVendorRole_userID_vendorID_key" ON "public"."UserVendorRole"("userID", "vendorID");

-- AddForeignKey
ALTER TABLE "public"."Vendor" ADD CONSTRAINT "Vendor_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_permissionID_fkey" FOREIGN KEY ("permissionID") REFERENCES "public"."Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserVendorRole" ADD CONSTRAINT "UserVendorRole_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserVendorRole" ADD CONSTRAINT "UserVendorRole_vendorID_fkey" FOREIGN KEY ("vendorID") REFERENCES "public"."Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserVendorRole" ADD CONSTRAINT "UserVendorRole_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_parentID_fkey" FOREIGN KEY ("parentID") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_vendorID_fkey" FOREIGN KEY ("vendorID") REFERENCES "public"."Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCategory" ADD CONSTRAINT "ProductCategory_productID_fkey" FOREIGN KEY ("productID") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCategory" ADD CONSTRAINT "ProductCategory_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productID_fkey" FOREIGN KEY ("productID") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_productID_fkey" FOREIGN KEY ("productID") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderAddress" ADD CONSTRAINT "OrderAddress_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderPromotion" ADD CONSTRAINT "OrderPromotion_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderPromotion" ADD CONSTRAINT "OrderPromotion_promotionID_fkey" FOREIGN KEY ("promotionID") REFERENCES "public"."Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShoppingCart" ADD CONSTRAINT "ShoppingCart_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShoppingCart" ADD CONSTRAINT "ShoppingCart_productID_fkey" FOREIGN KEY ("productID") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
