import { DateTime } from "luxon";
import { prisma } from "../prisma";
import { Segment } from "./product";
import { VTEC } from "./vtec";
import { UGC } from "./ugc";

const generateID = (vtec: VTEC): string => {
    const data = vtec.get()
    return data.wfo + data.phenomena + data.significance + data.eventNumber + data.endDate.year
}

const generateAlertUGC = (states: {
    name: string
    type: string
    counties: number[]
}[]) => {
    const output: {countyFIPS: string}[] = [];

    states.forEach((state) => {
        state.counties.forEach((county) => {
            output.push({countyFIPS: state.name + county})
        })
    })

    return output;
}

export const pushProduct = {
    "NEW": async (segment: Segment, wmoHeader: string, awips: string) => {
        const segData = segment.get()
        if (segData.vtec === null || segData.ugc === null) {
            throw new Error('Could not get VTEC and could not insert data into DB!');
        }
        const vtec = segData.vtec.get()
        const vtecString = segData.vtec.toString()
        
        const id = generateID(segData.vtec)

        console.log(id)

        try {
            await prisma.alerts.create({
                data: {
                    id,
                    awips,
                    vtec: vtecString,
                    vtecProductClass: vtec.productClass,
                    vtecAction: vtec.action,
                    vtecWFO: vtec.wfo,
                    vtecPhenomena: vtec.phenomena,
                    vtecSignificance: vtec.significance,
                    vtecEventNumber: Number(vtec.eventNumber),
                    issued: new Date(),
                    start: vtec.startDate.toISO() != null ? vtec.startDate.toISO() : undefined,
                    end: vtec.endDate.toISO(),
                    expires: segData.ugc.get().time,
                }
            })

            await prisma.alertHistory.create({
                data: {
                    alertID: id,
                    wmoHeader,
                    ugc: segData.ugc?.get().original,
                    vtec: vtecString,
                    vtecProductClass: vtec.productClass,
                    vtecAction: vtec.action,
                    vtecWFO: vtec.wfo,      
                    vtecPhenomena: vtec.phenomena,
                    vtecSignificance: vtec.significance,
                    vtecEventNumber: Number(vtec.eventNumber),
                    eas: segData.eas,
                    geometry: segData.geometry,
                    headlines: segData.headlines,
                    tml: segData.tml?.original,
                    hazard: segData.hazard,
                    source: segData.source,
                    impact: segData.impact,
                    ppa: segData.ppa, 
                    emergency: segData.emergency,
                    pds: segData.pds,
                    issued: new Date(),
                    start: vtec.startDate.toISO() != null ? vtec.startDate.toISO() : undefined,
                    end: vtec.endDate.toISO(),
                    expires: segData.ugc.get().time,
                    text: segData.original,
                    hailMaxTag: segData.tags.hailMaxTag,
                    hailThreatTag: segData.tags.hailThreatTag,
                    thunderstormThreatTag: segData.tags.thunderstormThreatTag,
                    tornadoTag: segData.tags.tornadoTag,
                    tornadoThreatTag: segData.tags.tornadoThreatTag,
                    windMaxTag: segData.tags.windMaxTag,
                    windThreatTag: segData.tags.windThreatTag,
                    tmlLocation: segData.tml?.location,
                    tmlTime: DateTime.now().set({hour: segData.tml?.time.hour, minute: segData.tml?.time.minute, second: 0, millisecond: 0}).toISO(),
                    tmlMotion: segData.tml?.speed,
                    AlertUGC: {
                        createMany: {
                            data: generateAlertUGC(segData.ugc.get().states)
                        }
                    }
                }
            })
        } catch (err) {
            console.log(err)
        }
    },
    "CON": async (segment: Segment, wmoHeader: string) => {
        const segData = segment.get()
        if (segData.vtec === null || segData.ugc === null) {
            throw new Error('Could not get VTEC and could not insert data into DB!');
        }
        const vtec = segData.vtec.get()
        const vtecString = segData.vtec.toString()
        
        const id = generateID(segData.vtec)

        console.log(id)

        await prisma.alertHistory.create({
            data: {
                alertID: id,
                wmoHeader,
                ugc: segData.ugc?.get().original,
                vtec: vtecString,
                vtecProductClass: vtec.productClass,
                vtecAction: vtec.action,
                vtecWFO: vtec.wfo,      
                vtecPhenomena: vtec.phenomena,
                vtecSignificance: vtec.significance,
                vtecEventNumber: Number(vtec.eventNumber),
                eas: segData.eas,
                geometry: segData.geometry,
                headlines: segData.headlines,
                tml: segData.tml?.original,
                hazard: segData.hazard,
                source: segData.source,
                impact: segData.impact,
                ppa: segData.ppa, 
                emergency: segData.emergency,
                pds: segData.pds,
                issued: new Date(),
                start: vtec.startDate.toISO() != null ? vtec.startDate.toISO() : undefined,
                end: vtec.action === "CAN" ? DateTime.now().toISO() : vtec.endDate.toISO(),
                expires: segData.ugc.get().time,
                text: segData.original,
                hailMaxTag: segData.tags.hailMaxTag,
                hailThreatTag: segData.tags.hailThreatTag,
                thunderstormThreatTag: segData.tags.thunderstormThreatTag,
                tornadoTag: segData.tags.tornadoTag,
                tornadoThreatTag: segData.tags.tornadoThreatTag,
                windMaxTag: segData.tags.windMaxTag,
                windThreatTag: segData.tags.windThreatTag,
                tmlLocation: segData.tml?.location,
                tmlTime: DateTime.now().set({hour: segData.tml?.time.hour, minute: segData.tml?.time.minute, second: 0, millisecond: 0}).toISO(),
                tmlMotion: segData.tml?.speed,
                AlertUGC: {
                    createMany: {
                        data: generateAlertUGC(segData.ugc.get().states)
                    }
                }
            }
        })

        await prisma.alerts.update({
            data: {
                updated_at: new Date().toISOString(),
                end: vtec.action === "CAN" ? DateTime.now().toISO() : vtec.endDate.toISO(),
                expires: segData.ugc.get().time,
                vtec: vtecString,
                vtecProductClass: vtec.productClass,
                vtecAction: vtec.action,
                vtecWFO: vtec.wfo,      
                vtecPhenomena: vtec.phenomena,
                vtecSignificance: vtec.significance,
                vtecEventNumber: Number(vtec.eventNumber),
            },
            where: {
                id
            }
        })
    }
}