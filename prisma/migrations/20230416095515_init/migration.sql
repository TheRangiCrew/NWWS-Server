/*
  Warnings:

  - The primary key for the `WFOData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `AlertActions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `AlertClass` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `AlertHistory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `AlertPhenomena` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `AlertSignificance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `CountyFIPS` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `WFOData` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id` on the `WFOData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Alerts" ADD COLUMN     "end" TIMESTAMPTZ(6),
ADD COLUMN     "expires" TIMESTAMPTZ(6),
ADD COLUMN     "issued" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
ADD COLUMN     "start" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text);

-- AlterTable
ALTER TABLE "WFOData" DROP CONSTRAINT "WFOData_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "WFOData_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "AlertActions_id_key" ON "AlertActions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AlertClass_id_key" ON "AlertClass"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AlertHistory_id_key" ON "AlertHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AlertPhenomena_id_key" ON "AlertPhenomena"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AlertSignificance_id_key" ON "AlertSignificance"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CountyFIPS_id_key" ON "CountyFIPS"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WFOData_id_key" ON "WFOData"("id");
