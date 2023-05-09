/*
  Warnings:

  - You are about to alter the column `number` on the `CountyFIPS` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "CountyFIPS" ALTER COLUMN "number" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "AlertUGC" (
    "id" TEXT NOT NULL,
    "countFIPS" TEXT NOT NULL,
    "alert" TEXT NOT NULL,

    CONSTRAINT "AlertUGC_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlertUGC_id_key" ON "AlertUGC"("id");

-- AddForeignKey
ALTER TABLE "AlertUGC" ADD CONSTRAINT "AlertUGC_countFIPS_fkey" FOREIGN KEY ("countFIPS") REFERENCES "CountyFIPS"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AlertUGC" ADD CONSTRAINT "AlertUGC_alert_fkey" FOREIGN KEY ("alert") REFERENCES "AlertHistory"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
