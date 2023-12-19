import { DateTime } from "luxon";
import { LatLon, LatLonObject } from "../latlon";
import { VTECSegment, VTECSegmentObject } from "./vtecSegment";
import { TML, TMLObject } from "../tml";
import { VTEC, VTECObject } from "../vtec";


export class SevereSegment extends VTECSegment {

    #latlon: LatLon;
    #tml: TML;
    #hazard: string | null;
    #source: string | null;
    #impact: string | null;
    #tornado: TOR | null;
    #tornado_damage: TORDMG | null;
    #thunderstorm_damage: TSTMDMG | null;
    #hail_threat: HAILTHREAT | null;
    #hail_max: string | null;
    #wind_threat: WINDTHREAT | null;
    #wind_max: string | null;
    #emergency: boolean;
    #pds: boolean; // Particularly Dangerous Situation
    #start: DateTime;
    #end: DateTime | null;

    constructor(text: string) {
        super(text);

        this.#latlon = new LatLon(this.original);

        this.#tml = new TML(this.original);

        const hazardregex = /HAZARD\.\.\./g
        const hazardindex = this.original.search(hazardregex);
        if (hazardindex != -1) {
            let hazard = this.original.slice(hazardindex, this.original.length);
            hazard = hazard.slice(0, hazard.search("\n\n"));
            this.#hazard = hazard.split(hazardregex)[1].replace(/(^ {2,}|\.$)/gm, "").replace(/\n/g, " ");
        } else {
            this.#hazard = null;
        }

        const sourceregex = /SOURCE\.\.\./g
        const sourceindex = this.original.search(sourceregex);
        if (sourceindex != -1) {
            let source = this.original.slice(sourceindex, this.original.length);
            source = source.slice(0, source.search("\n\n"));
            this.#source = source.split(sourceregex)[1].replace(/(^ {2,}|\.$)/gm, "").replace(/\n/g, " ");
        } else {
            this.#source = null;
        }

        const impactregex = /IMPACT\.\.\.|IMPACTS\.\.\./gm
        const impactindex = this.original.search(impactregex);
        if (impactindex != -1) {
            let impact = this.original.slice(impactindex, this.original.length);
            impact = impact.slice(0, impact.search("\n\n")).trim();
            this.#impact = impact.split(impactregex)[1].replace(/(^ {2,}|\.$)/gm, "").replace(/\n/g, " ");
        } else {
            this.#impact = null;
        }

        const tormatch = this.original.match(/TORNADO\.\.\..*/g)
        if (tormatch != null) {
            const arr = tormatch[0].split("...");
            this.#tornado = TOR.valueOf(arr[1]);
        } else {
            this.#tornado = null;
        }

        const tordmgmatch = this.original.match(/TORNADO DAMAGE THREAT\.\.\..*/g)
        if (tordmgmatch != null) {
            const arr = tordmgmatch[0].split("...");
            this.#tornado_damage = TORDMG.valueOf(arr[1]);
        } else {
            this.#tornado_damage = null;
        }

        const tstmdmgmatch = this.original.match(/THUNDERSTORM DAMAGE THREAT\.\.\..*/g)
        if (tstmdmgmatch != null) {
            const arr = tstmdmgmatch[0].split("...");
            this.#thunderstorm_damage = TSTMDMG.valueOf(arr[1]);
        } else {
            this.#thunderstorm_damage = null;
        }

        const hailthreatmatch = this.original.match(/HAIL THREAT\.\.\..*/g)
        if (hailthreatmatch != null) {
            const arr = hailthreatmatch[0].split("...");
            this.#hail_threat = HAILTHREAT.valueOf(arr[1]);
        } else {
            this.#hail_threat = null;
        }

        const hailmaxmatch = this.original.match(/MAX HAIL SIZE\.\.\..*/g)
        if (hailmaxmatch != null) {
            this.#hail_max = hailmaxmatch[0].split("...")[1];
        } else {
            this.#hail_max = null;
        }

        const windthreatmatch = this.original.match(/WIND THREAT\.\.\..*/g)
        if (windthreatmatch != null) {
            const arr = windthreatmatch[0].split("...");
            this.#wind_threat = WINDTHREAT.valueOf(arr[1]);
        } else {
            this.#wind_threat = null;
        }

        const windmaxmatch = this.original.match(/MAX WIND GUST\.\.\..*/g)
        if (windmaxmatch != null) {
            this.#wind_max = windmaxmatch[0].split("...")[1];
        } else {
            this.#wind_max = null;
        }

        this.#emergency = this.original.match(/EMERGENCY/g) != null;
        this.#pds = this.original.match(/PARTICULARLY DANGEROUS SITUATION/g) != null;

        this.#start = this.vtec?.start ?? DateTime.now()
        this.#end = this.vtec?.end ?? null;

    }

    get toObject(): SevereSegmentObject {
        return {
            original: this.original,
            ugc: this.ugc.toObject,
            counties_zones: this.ugc.toDBObject.counties,
            vtec: this.vtec.toObject,
            headlines: this.headlines,
            cta: this.cta,
            issued: this.issued.toJSDate(),
            expires: this.expires.toJSDate(),
            latlon: this.#latlon.original,
            polygon: this.#latlon.toGEOJson,
            tml: this.#tml.toObject,
            hazard: this.#hazard,
            source: this.#source,
            impact: this.#impact,
            tornado: this.#tornado,
            tornado_damage: this.#tornado_damage,
            thunderstorm_damage: this.#thunderstorm_damage,
            hail_threat: this.#hail_threat,
            hail_max: this.#hail_max,
            wind_threat: this.#wind_threat,
            wind_max: this.#wind_max,
            emergency: this.#emergency,
            pds: this.#pds,
            start: this.#start.toJSDate(),
            end: this.#end?.toJSDate() ?? null
        }
    }

}

export type SevereSegmentObject = VTECSegmentObject & {
    vtec: VTECObject;
    latlon: string | null;
    polygon: { type: string, coordinates: number[][][] }
    tml: TMLObject;
    hazard: string | null;
    source: string | null;
    impact: string | null;
    tornado: TOR | null;
    tornado_damage: TORDMG | null;
    thunderstorm_damage: TSTMDMG | null;
    hail_threat: HAILTHREAT | null;
    hail_max: string | null;
    wind_threat: WINDTHREAT | null;
    wind_max: string | null;
    emergency: boolean;
    pds: boolean;
    start: Date;
    end: Date | null;
}

enum TOR {
    "POSSIBLE",
    "RADAR INDICATED",
    "OBSERVED"
}

namespace TOR {
    export function valueOf(text: string): TOR | null {
        const values = Object.values(TOR)
        for (let i = 0; i < values.length; i++) {
            if (values[i] === text) {
                return values[i] as TOR;
            }
        }
        return null;
    }
}

enum TORDMG {
    "CONSIDERABLE" = 1,
    "CATASTROPHIC"
}

namespace TORDMG {
    export function valueOf(text: string): TORDMG | null {
        const values = Object.values(TORDMG)
        for (let i = 0; i < values.length; i++) {
            if (values[i] === text) {
                return values[i] as TORDMG;
            }
        }
        return null;
    }
}

enum TSTMDMG {
    "CONSIDERABLE" = 1,
    "DESTRUCTIVE",
}

namespace TSTMDMG {
    export function valueOf(text: string): TSTMDMG | null {
        const values = Object.values(TSTMDMG)
        for (let i = 0; i < values.length; i++) {
            if (values[i] === text) {
                return values[i] as TSTMDMG;
            }
        }
        return null;
    }
}

enum HAILTHREAT {
    "RADAR INDICATED" = 1,
    "OBSERVED"
}

namespace HAILTHREAT {
    export function valueOf(text: string): HAILTHREAT | null {
        const values = Object.values(HAILTHREAT)
        for (let i = 0; i < values.length; i++) {
            if (values[i] === text) {
                return values[i] as HAILTHREAT;
            }
        }
        return null;
    }
}

enum WINDTHREAT {
    "RADAR INDICATED" = 1,
    "OBSERVED"
}

namespace WINDTHREAT {
    export function valueOf(text: string): WINDTHREAT | null {
        const values = Object.values(WINDTHREAT)
        for (let i = 0; i < values.length; i++) {
            if (values[i] === text) {
                return values[i] as WINDTHREAT;
            }
        }
        return null;
    }
}