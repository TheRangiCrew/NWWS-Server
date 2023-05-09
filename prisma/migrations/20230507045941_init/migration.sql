/*
  Warnings:

  - You are about to drop the column `wingMaxTag` on the `AlertHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AlertHistory" DROP COLUMN "wingMaxTag",
ADD COLUMN     "windMaxTag" TEXT;
