/*
  Warnings:

  - You are about to drop the `UserVendorRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRoleStatus" AS ENUM ('active', 'inactive');

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userID_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_userID_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userID_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userID_fkey";

-- DropForeignKey
ALTER TABLE "UserVendorRole" DROP CONSTRAINT "UserVendorRole_roleID_fkey";

-- DropForeignKey
ALTER TABLE "UserVendorRole" DROP CONSTRAINT "UserVendorRole_userID_fkey";

-- DropForeignKey
ALTER TABLE "UserVendorRole" DROP CONSTRAINT "UserVendorRole_vendorID_fkey";

-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_userID_fkey";

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "userID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ChatMessage" ALTER COLUMN "userID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "userID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "userID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vendor" ALTER COLUMN "userID" DROP NOT NULL;

-- DropTable
DROP TABLE "UserVendorRole";

-- DropEnum
DROP TYPE "UserVendorRoleStatus";

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userID" TEXT,
    "roleID" TEXT NOT NULL,
    "status" "UserRoleStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userID_roleID_key" ON "UserRole"("userID", "roleID");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
