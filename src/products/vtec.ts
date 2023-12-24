import { DateTime } from "luxon";

export class VTEC {

    #original: string | null;
    #productClass: VTECProductClass;
    #action: VTECAction;
    #wfo: string;
    #phenomena: VTECPhenomena;
    #significance: VTECSignificance;
    #eventNumber: number;
    #start: DateTime;
    #end: DateTime;

    static regex = new RegExp(/([A-Z]).([A-Z]+).([A-Z]+).([A-Z]+).([A-Z]).([0-9]+).([0-9TZ]+)-([0-9TZ]+)/g);

    constructor(text: string) {
        this.#original = this.#find(text);

        if (this.#original === null || this.#original === undefined) {
            throw new Error("VTEC does not exists");
        }

        const segments = this.#original.split(".");
        this.#productClass = VTECProductClass.valueOf(segments[0]);
        this.#action = VTECAction.valueOf(segments[1]);
        this.#wfo = segments[2];
        this.#phenomena = VTECPhenomena.valueOf(segments[3]);
        this.#significance = VTECSignificance.valueOf(segments[4]);
        this.#eventNumber = Number(segments[5]);
        const dates = segments[6].split('-');
        if (dates[0] === "000000T0000Z") {
            this.#start = DateTime.now();
        } else {
            this.#start = DateTime.fromFormat(dates[0].replaceAll(/[TZ]/g, ''), "yyMMddHHmm", { zone: 'UTC' });
        }
        this.#end = DateTime.fromFormat(dates[1].replaceAll(/[TZ]/g, ''), "yyMMddHHmm", { zone: 'UTC' });

    }

    #find = (text: string): string | null => {
        let vtec = text.match(VTEC.regex);
        return vtec != null ? vtec[0] : null;

    }

    static exists = (text: string): boolean => {
        let vtec = text.match(VTEC.regex);
        return vtec != null ? true : false;
    }

    static findAll = (text: string) => {
        let vtec = text.match(VTEC.regex);
        return vtec?.map(v => {
            return new VTEC(v)
        }) ?? null
    }

    get isNull(): boolean {
        return this.#original === null;
    }

    toString = () => {
        return this.#original;
    }

    get wfo() {
        return this.#wfo
    }

    get phenomena() {
        return this.#phenomena;
    }

    get significance() {
        return this.#significance;
    }

    get eventNumber() {
        return this.#eventNumber;
    }

    get start() {
        return this.#start;
    }

    get end() {
        return this.#end;
    }

    get toObject(): VTECObject {
        return {
            original: this.#original,
            productClass: this.#productClass,
            action: this.#action,
            wfo: this.#wfo,
            phenomena: this.#phenomena,
            significance: this.#significance,
            eventNumber: this.#eventNumber,
            start: this.#start?.toJSDate() ?? null,
            end: this.#end?.toJSDate() ?? null
        }
    }

}

export type VTECObject = {
    original: string | null;
    productClass: VTECProductClass | null;
    action: VTECAction | null;
    wfo: string | null;
    phenomena: VTECPhenomena | null;
    significance: VTECSignificance | null;
    eventNumber: number | null;
    start: Date | null;
    end: Date | null;
}

/** 
    * The product class
    * 
    * - `O` = Operational Product
    * - `T` = Test Product
    * - `E` = Experimental Product
    * - `X` = Experimental VTEC in Operation Product
    * 
    * @type {string}
    * 
    * @info https://www.weather.gov/bmx/vtec
    *
    */
enum VTECProductClass {
    "O",
    "T",
    "E",
    "X"
}

namespace VTECProductClass {
    export function valueOf(text: string): VTECProductClass {
        const values = Object.values(VTECProductClass)
        for (let i = 0; i < values.length; i++) {
            if (values[i] === text) {
                return values[i] as VTECProductClass;
            }
        }
        throw new Error("Could not find VTECProductClass");
    }
}

/** 
     * 
     * 
     * - `NEW` New event
     * - `CON` Event continued
     * - `EXT` Event extended (time)
     * - `EXA` Event extended (area)
     * - `EXB` Event extended (both time and area)
     * - `UPG` Event upgraded
     * - `CAN` Event cancelled
     * - `EXP` Event expired
     * - `COR` Correction
     * - `ROU` Routine
     * 
    */
enum VTECAction {
    "NEW",
    "CON",
    "EXT",
    "EXA",
    "EXB",
    "UPG",
    "CAN",
    "EXP",
    "COR",
    "ROU"
};

namespace VTECAction {
    export function valueOf(text: string): VTECAction {
        const values = Object.values(VTECAction)
        for (let i = 0; i < values.length; i++) {
            if (values[i] === text) {
                return values[i] as VTECAction;
            }
        }
        throw new Error("Could not find VTECAction");
    }
}

/**
     * 
     * - `AF` Ashfall (land)
     * - `AS` Air Stagnation
     * - `BH` Beach Hazard
     * - `BW` Brisk Wind
     * - `BZ` Blizzard
     * - `CF` Coastal Flood
     * - `DF` Debris Flow
     * - `DS` Dust Storm
     * - `EC` Extreme Cold
     * - `EH` Excessive Heat
     * - `EW` Extreme Wind
     * - `FA` Flood
     * - `FF` Flash Flood
     * - `FG` Dense Fog (land)
     * - `FL` Flood (forecast point)
     * - `FR` Frost
     * - `FW` Fire Weather
     * - `FZ` Freeze
     * - `GL` Gale
     * - `HF` Hurricane Force Wind
     * - `HT` Heat
     * - `HU` Hurricane
     * - `HW` High Wind
     * - `HY` Hydrologic
     * - `HZ` Hard Freeze
     * - `IS` Ice Storm
     * - `LE` Lake Effect Snow
     * - `LO` Low Water
     * - `LS` Lakeshore Flood
     * - `LW` Lake Wind
     * - `MA` Marine
     * - `MF` Dense Fog (marine)
     * - `MH` Ashfall (marine)
     * - `MS` Dense Smoke (marine)
     * - `RB` Small Craft for Rough Bar
     * - `RP` Rip Current Risk
     * - `SC` Small Craft
     * - `SE` Hazardous Seas
     * - `SI` Small Craft for Winds
     * - `SM` Dense Smoke (land)
     * - `SQ` Snow Squall
     * - `SR` Storm
     * - `SS` Storm Surge
     * - `SU` High Surf
     * - `SV` Severe Thunderstorm
     * - `SW` Small Craft for Hazardous Seas
     * - `TO` Tornado
     * - `TR` Tropical Storm
     * - `TS` Tsunami
     * - `TY` Typhoon
     * - `UP` *(Heavy) Freezing Spray
     * - `WC` Wind Chill
     * - `WI` Wind
     * - `WS` Winter Storm
     * - `WW` Winter Weather
     * - `ZF` Freezing Fog
     * - `ZR` Freezing Rain
     * 
     */
enum VTECPhenomena {
    "AF" = "AF",
    "AS" = "AS",
    "BH" = "BH",
    "BW" = "BW",
    "BZ" = "BZ",
    "CF" = "CF",
    "DF" = "DF",
    "DS" = "DS",
    "EC" = "EC",
    "EH" = "EH",
    "EW" = "EW",
    "FA" = "FA",
    "FF" = "FF",
    "FG" = "FG",
    "FL" = "FL",
    "FR" = "FR",
    "FW" = "FW",
    "FZ" = "FZ",
    "GL" = "GL",
    "HF" = "HF",
    "HT" = "HT",
    "HU" = "HU",
    "HW" = "HW",
    "HY" = "HY",
    "HZ" = "HZ",
    "IS" = "IS",
    "LE" = "LE",
    "LO" = "LO",
    "LS" = "LS",
    "LW" = "LW",
    "MA" = "MA",
    "MF" = "MF",
    "MH" = "MH",
    "MS" = "MS",
    "RB" = "RB",
    "RP" = "RP",
    "SC" = "SC",
    "SE" = "SE",
    "SI" = "SI",
    "SM" = "SM",
    "SQ" = "SQ",
    "SR" = "SR",
    "SS" = "SS",
    "SU" = "SU",
    "SV" = "SV",
    "SW" = "SW",
    "TO" = "TO",
    "TR" = "TR",
    "TS" = "TS",
    "TY" = "TY",
    "UP" = "UP",
    "WC" = "WC",
    "WI" = "WI",
    "WS" = "WS",
    "WW" = "WW",
    "ZF" = "ZF",
    "ZR" = "ZR"
}

namespace VTECPhenomena {
    export function valueOf(text: string): VTECPhenomena {
        const values = Object.values(VTECPhenomena)
        for (let i = 0; i < values.length; i++) {
            if (values[i] === text) {
                return values[i] as VTECPhenomena;
            }
        }
        throw new Error("Could not find VTECPhenomena");
    }
}

/**
 * - `W` Warning
 * - `A` Watch
 * - `Y` Advisory
 * - `S` Statement
 */
enum VTECSignificance {
    "W",
    "A",
    "Y",
    "S"
};

namespace VTECSignificance {
    export function valueOf(text: string): VTECSignificance {
        const values = Object.values(VTECSignificance)
        for (let i = 0; i < values.length; i++) {
            if (values[i] === text) {
                return values[i] as VTECSignificance;
            }
        }
        throw new Error("Could not find VTECSignificance");
    }
}