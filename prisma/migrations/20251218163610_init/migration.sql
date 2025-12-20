/*
  Warnings:

  - A unique constraint covering the columns `[parentID]` on the table `ChatMessage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "parentID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_parentID_key" ON "ChatMessage"("parentID");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_parentID_fkey" FOREIGN KEY ("parentID") REFERENCES "ChatMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
