/*
  Warnings:

  - The required column `sessionID` was added to the `ChatMessage` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "sessionID" TEXT NOT NULL;
