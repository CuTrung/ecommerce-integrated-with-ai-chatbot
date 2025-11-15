/*
  Warnings:

  - Added the required column `name` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ProductImage" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;
