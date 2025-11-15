/*
  Warnings:

  - You are about to drop the column `shopName` on the `Vendor` table. All the data in the column will be lost.
  - Added the required column `name` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Vendor" DROP COLUMN "shopName",
ADD COLUMN     "name" TEXT NOT NULL;
