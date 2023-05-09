/*
  Warnings:

  - You are about to drop the column `ugc` on the `Alerts` table. All the data in the column will be lost.
  - Added the required column `ugc` to the `AlertHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AlertHistory" ADD COLUMN     "ugc" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Alerts" DROP COLUMN "ugc";
