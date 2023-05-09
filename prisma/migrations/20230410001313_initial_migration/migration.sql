-- CreateTable
CREATE TABLE "AlertActions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "AlertActions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertClass" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "AlertClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertPhenomena" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "AlertEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertSignificance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "AlertSignificance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alerts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "awips" TEXT NOT NULL,
    "ugc" TEXT NOT NULL,
    "vtec" TEXT NOT NULL,
    "vtecProductClass" TEXT NOT NULL,
    "vtecAction" TEXT NOT NULL,
    "vtecWFO" TEXT NOT NULL,
    "vtecPhenomena" TEXT NOT NULL,
    "vtecSignificance" TEXT NOT NULL,
    "vtecEventNumber" BIGINT NOT NULL,

    CONSTRAINT "Alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertHistory" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "wmoHeader" TEXT NOT NULL,
    "vtec" TEXT NOT NULL,
    "vtecProductClass" TEXT NOT NULL,
    "vtecAction" TEXT NOT NULL,
    "vtecWFO" TEXT NOT NULL,
    "vtecPhenomena" TEXT NOT NULL,
    "vtecSignificance" TEXT NOT NULL,
    "vtecEventNumber" BIGINT NOT NULL,
    "eas" BOOLEAN NOT NULL DEFAULT false,
    "geometry" JSON,
    "headlines" JSON,
    "tml" TEXT,
    "hazard" TEXT,
    "source" TEXT,
    "impact" TEXT,
    "ppa" TEXT,
    "emergency" BOOLEAN NOT NULL DEFAULT false,
    "pds" BOOLEAN NOT NULL DEFAULT false,
    "issued" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "start" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "end" TIMESTAMPTZ(6),
    "expires" TIMESTAMPTZ(6),

    CONSTRAINT "AlertHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountyFIPS" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numRaw" TEXT NOT NULL,
    "number" BIGINT NOT NULL,
    "state" TEXT NOT NULL,
    "stateNum" BIGINT NOT NULL,

    CONSTRAINT "CountyFIPS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StateFIPS" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,

    CONSTRAINT "StateFIPS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WFOData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "WFOData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlertActions_name_key" ON "AlertActions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AlertActions_code_key" ON "AlertActions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AlertClass_name_key" ON "AlertClass"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AlertClass_code_key" ON "AlertClass"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AlertEvent_name_key" ON "AlertPhenomena"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AlertEvent_code_key" ON "AlertPhenomena"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AlertSignificance_code_key" ON "AlertSignificance"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Alerts_id_key" ON "Alerts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CountyFIPS_numRaw_key" ON "CountyFIPS"("numRaw");

-- CreateIndex
CREATE UNIQUE INDEX "StateFIPS_id_key" ON "StateFIPS"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StateFIPS_name_key" ON "StateFIPS"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StateFIPS_abbreviation_key" ON "StateFIPS"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "WFOData_code_key" ON "WFOData"("code");

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_vtecAction_fkey" FOREIGN KEY ("vtecAction") REFERENCES "AlertActions"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_vtecPhenomena_fkey" FOREIGN KEY ("vtecPhenomena") REFERENCES "AlertPhenomena"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_vtecProductClass_fkey" FOREIGN KEY ("vtecProductClass") REFERENCES "AlertClass"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_vtecSignificance_fkey" FOREIGN KEY ("vtecSignificance") REFERENCES "AlertSignificance"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_vtecWFO_fkey" FOREIGN KEY ("vtecWFO") REFERENCES "WFOData"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AlertHistory" ADD CONSTRAINT "AlertHistory_vtecAction_fkey" FOREIGN KEY ("vtecAction") REFERENCES "AlertActions"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AlertHistory" ADD CONSTRAINT "AlertHistory_vtecPhenomena_fkey" FOREIGN KEY ("vtecPhenomena") REFERENCES "AlertPhenomena"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AlertHistory" ADD CONSTRAINT "AlertHistory_vtecProductClass_fkey" FOREIGN KEY ("vtecProductClass") REFERENCES "AlertClass"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AlertHistory" ADD CONSTRAINT "AlertHistory_vtecSignificance_fkey" FOREIGN KEY ("vtecSignificance") REFERENCES "AlertSignificance"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AlertHistory" ADD CONSTRAINT "AlertHistory_vtecWFO_fkey" FOREIGN KEY ("vtecWFO") REFERENCES "WFOData"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CountyFIPS" ADD CONSTRAINT "CountyFIPS_stateNum_fkey" FOREIGN KEY ("stateNum") REFERENCES "StateFIPS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CountyFIPS" ADD CONSTRAINT "CountyFIPS_state_fkey" FOREIGN KEY ("state") REFERENCES "StateFIPS"("abbreviation") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WFOData" ADD CONSTRAINT "WFOData_state_fkey" FOREIGN KEY ("state") REFERENCES "StateFIPS"("abbreviation") ON DELETE NO ACTION ON UPDATE NO ACTION;
