import { DateTime } from "luxon";
import { VTECAction, VTECPhenomena, VTECProductClass, VTECSignificance } from "../types/VTEC"

const vtecRegEx = new RegExp(/([A-Z]).([A-Z]+).([A-Z]+).([A-Z]+).([A-Z]).([0-9]+).([0-9TZ]+)-([0-9TZ]+)/g)

export const vtec = {
    parse: (text: string): VTEC | null => {
        const vtec = text.match(vtecRegEx)
        if (vtec === null) {
            return null
        }
        if (vtec[0].split('.').length != 7) {
            return null
        }
        return new VTEC(vtec[0])
    }
}

export class VTEC {
    #original: string;
    #productClass: VTECProductClass;
    #action: VTECAction;
    #wfo: string;
    #phenomena: VTECPhenomena;
    #significance: VTECSignificance;
    #eventNumber: number;
    #startDate: DateTime;
    #endDate: DateTime;

    constructor(vtec: string) {
        this.#original = vtec
        let data = vtec.split('.')
        this.#productClass = data[0] as VTECProductClass;
        this.#action = data[1] as VTECAction;
        this.#wfo = data[2];
        this.#phenomena = data[3] as VTECPhenomena;
        this.#significance = data[4] as VTECSignificance
        this.#eventNumber = Number(data[5]);
        const dates = data[6].split('-');
        this.#startDate = DateTime.fromFormat(dates[0].replaceAll(/[TZ]/g, ''), "yyMMddHHmm", {zone: 'UTC'});
        this.#endDate = DateTime.fromFormat(dates[1].replaceAll(/[TZ]/g, ''), "yyMMddHHmm", {zone: 'UTC'});
    }

    get = () => {
        return {
            productClass: this.#productClass,
            action: this.#action,
            wfo: this.#wfo,
            phenomena: this.#phenomena,
            significance: this.#significance,
            eventNumber: this.#eventNumber,
            startDate: this.#startDate,
            endDate: this.#endDate
        }
    }

    toString = (): string => {
        return this.#original
    }
}