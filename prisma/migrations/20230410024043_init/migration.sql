/*
  Warnings:

  - Added the required column `alertID` to the `AlertHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AlertHistory" ADD COLUMN     "alertID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AlertHistory" ADD CONSTRAINT "AlertHistory_alertID_fkey" FOREIGN KEY ("alertID") REFERENCES "Alerts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
