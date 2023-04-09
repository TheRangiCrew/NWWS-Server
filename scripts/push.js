"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushProduct = void 0;
const supabase_1 = __importDefault(require("../supabase"));
exports.pushProduct = {
    new: async (segment, wmoHeader, awips) => {
        const segData = segment.get();
        const vtec = segData.vtec?.get();
        const { error } = await supabase_1.default.from('Alerts').insert({
            wmoHeader,
            awips,
            vtec: segData.vtec?.toString(),
            vtecProductClass: vtec?.productClass,
            vtecAction: vtec?.action,
            vtecWFO: vtec?.wfo,
            vtecPhenomena: vtec?.phenomena,
            vtecSignificance: vtec?.significance,
            vtecEventNumber: vtec?.eventNumber,
            eas: segData.eas,
            geometry: JSON.stringify(segData.geometry),
            headlines: JSON.stringify(segData.headlines),
            tml: segData.tml?.original,
            hazard: segData.hazard,
            source: segData.source,
            impact: segData.impact,
            ppa: segData.ppa,
            emergency: segData.emergency,
            pds: segData.pds,
            start: vtec?.startDate,
            end: vtec?.endDate,
            expires: vtec?.endDate
        });
        if (error) {
            console.log(error);
        }
    }
};
