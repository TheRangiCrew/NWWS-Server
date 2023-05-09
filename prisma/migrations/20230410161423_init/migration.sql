/*
  Warnings:

  - Added the required column `text` to the `AlertHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AlertHistory" DROP CONSTRAINT "AlertHistory_alertID_fkey";

-- AlterTable
ALTER TABLE "AlertHistory" ADD COLUMN     "text" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AlertHistory" ADD CONSTRAINT "AlertHistory_alertID_fkey" FOREIGN KEY ("alertID") REFERENCES "Alerts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
