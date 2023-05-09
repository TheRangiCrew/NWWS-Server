/*
  Warnings:

  - You are about to alter the column `vtecEventNumber` on the `AlertHistory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to drop the column `countFIPS` on the `AlertUGC` table. All the data in the column will be lost.
  - You are about to alter the column `vtecEventNumber` on the `Alerts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `stateNum` on the `CountyFIPS` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `StateFIPS` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `StateFIPS` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - Added the required column `tmlMotion` to the `AlertHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countyFIPS` to the `AlertUGC` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AlertUGC" DROP CONSTRAINT "AlertUGC_countFIPS_fkey";

-- DropForeignKey
ALTER TABLE "CountyFIPS" DROP CONSTRAINT "CountyFIPS_stateNum_fkey";

-- AlterTable
ALTER TABLE "AlertHistory" ADD COLUMN     "hailMaxTag" TEXT,
ADD COLUMN     "hailThreatTag" TEXT,
ADD COLUMN     "thunderstormThreatTag" TEXT,
ADD COLUMN     "tmlLocation" JSON,
ADD COLUMN     "tmlMotion" INTEGER NOT NULL,
ADD COLUMN     "tmlTime" TIMESTAMP(3),
ADD COLUMN     "tornadoTag" TEXT,
ADD COLUMN     "tornadoThreatTag" TEXT,
ADD COLUMN     "windThreatTag" TEXT,
ADD COLUMN     "wingMaxTag" TEXT,
ALTER COLUMN "vtecEventNumber" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "AlertUGC" DROP COLUMN "countFIPS",
ADD COLUMN     "countyFIPS" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Alerts" ALTER COLUMN "vtecEventNumber" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "CountyFIPS" ALTER COLUMN "stateNum" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "StateFIPS" DROP CONSTRAINT "StateFIPS_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "StateFIPS_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StateFIPS_id_seq";

-- AddForeignKey
ALTER TABLE "AlertUGC" ADD CONSTRAINT "AlertUGC_countyFIPS_fkey" FOREIGN KEY ("countyFIPS") REFERENCES "CountyFIPS"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CountyFIPS" ADD CONSTRAINT "CountyFIPS_stateNum_fkey" FOREIGN KEY ("stateNum") REFERENCES "StateFIPS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
