import { DateTime } from "luxon";
import { LatLon, LatLonObject } from "../latlon";
import { VTECSegment, VTECSegmentObject, createVTECSegments } from "./vtecSegment";
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
            headlines: this.headlines,
            cta: this.cta,
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

export const createSevereVTECSegments = (text: string) => {

    const vtecSegment = createVTECSegments(text)

    return vtecSegment.map(v => {
        const latlon = new LatLon(text);

        const tml = new TML(text);

        const emergency = text.match(/EMERGENCY/g) != null;
        const pds = text.match(/PARTICULARLY DANGEROUS SITUATION/g) != null;

        let segment: SevereSegmentObject = {
            ...v,
            latlon: latlon.original,
            polygon: latlon.toGEOJson,
            tml: tml.original,
            hazard: null,
            source: null,
            impact: null,
            tornado: null,
            tags: {
                tornado_damage: null,
                thunderstorm_damage: null,
                hail_threat: null,
                hail_max: null,
                wind_threat: null,
                wind_max: null,
            },
            emergency,
            pds,

        }

        const hazardregex = /HAZARD\.\.\./g
        const hazardindex = text.search(hazardregex);
        if (hazardindex != -1) {
            let hazard = text.slice(hazardindex, text.length);
            hazard = hazard.slice(0, hazard.search("\n\n"));
            segment.hazard = hazard.split(hazardregex)[1].replace(/(^ {2,}|\.$)/gm, "").replace(/\n/g, " ");
        }

        const sourceregex = /SOURCE\.\.\./g
        const sourceindex = text.search(sourceregex);
        if (sourceindex != -1) {
            let source = text.slice(sourceindex, text.length);
            source = source.slice(0, source.search("\n\n"));
            segment.source = source.split(sourceregex)[1].replace(/(^ {2,}|\.$)/gm, "").replace(/\n/g, " ");
        }

        const impactregex = /IMPACT\.\.\.|IMPACTS\.\.\./gm
        const impactindex = text.search(impactregex);
        if (impactindex != -1) {
            let impact = text.slice(impactindex, text.length);
            impact = impact.slice(0, impact.search("\n\n")).trim();
            segment.impact = impact.split(impactregex)[1].replace(/(^ {2,}|\.$)/gm, "").replace(/\n/g, " ");
        }

        const tormatch = text.match(/TORNADO\.\.\..*/g)
        if (tormatch != null) {
            const arr = tormatch[0].split("...");
            segment.tornado = TOR.valueOf(arr[1]);
        }

        const tordmgmatch = text.match(/TORNADO DAMAGE THREAT\.\.\..*/g)
        if (tordmgmatch != null) {
            const arr = tordmgmatch[0].split("...");
            segment.tags.tornado_damage = TORDMG.valueOf(arr[1]);
        }

        const tstmdmgmatch = text.match(/THUNDERSTORM DAMAGE THREAT\.\.\..*/g)
        if (tstmdmgmatch != null) {
            const arr = tstmdmgmatch[0].split("...");
            segment.tags.thunderstorm_damage = TSTMDMG.valueOf(arr[1]);
        }

        const hailthreatmatch = text.match(/HAIL THREAT\.\.\..*/g)
        if (hailthreatmatch != null) {
            const arr = hailthreatmatch[0].split("...");
            segment.tags.hail_threat = HAILTHREAT.valueOf(arr[1]);
        }

        const hailmaxmatch = text.match(/MAX HAIL SIZE\.\.\..*/g)
        if (hailmaxmatch != null) {
            segment.tags.hail_max = hailmaxmatch[0].split("...")[1];
        }

        const windthreatmatch = text.match(/WIND THREAT\.\.\..*/g)
        if (windthreatmatch != null) {
            const arr = windthreatmatch[0].split("...");
            segment.tags.wind_threat = WINDTHREAT.valueOf(arr[1]);
        }

        const windmaxmatch = text.match(/MAX WIND GUST\.\.\..*/g)
        if (windmaxmatch != null) {
            segment.tags.wind_max = windmaxmatch[0].split("...")[1];
        }

        return segment
    })


}

export type SevereSegmentObject = VTECSegmentObject & {
    latlon: string | null;
    polygon: { type: string, coordinates: number[][][] }
    tml: string | null;
    hazard: string | null;
    source: string | null;
    impact: string | null;
    tornado: TOR | null;
    tags: {
        tornado_damage: TORDMG | null;
        thunderstorm_damage: TSTMDMG | null;
        hail_threat: HAILTHREAT | null;
        hail_max: string | null;
        wind_threat: WINDTHREAT | null;
        wind_max: string | null;
    },
    emergency: boolean;
    pds: boolean;

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