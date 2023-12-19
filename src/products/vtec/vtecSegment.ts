import { DateTime } from "luxon";
import { UGC, UGCObject } from "../ugc";
import { VTEC } from "../vtec";

/**
 * Segment of an NWS text product
 */
export class VTECSegment {

    #original: string;
    #ugc: UGC;
    #vtec: VTEC;
    #headlines: string[];
    #cta: string | null; // Call-To-Action
    #issued: DateTime;
    #expires: DateTime;

    constructor(text: string) {
        this.#original = text;

        this.#ugc = new UGC(this.#original);

        this.#vtec = new VTEC(this.original)

        const headlinesregex = /^(\.){3}([\w\d\s]*)(\.){3}(\n){2}/gm;
        this.#headlines = [];
        this.#original.match(headlinesregex)?.forEach((h) => {
            this.#headlines.push(h.trim());
        })

        const ctaregex = /^(PRECAUTIONARY\/PREPAREDNESS ACTIONS\.\.\.\n)([\w\d\s,.!\n]*)(&){2}/gm;
        const cta = this.#original.match(ctaregex);
        this.#cta = cta === null ? null : cta[0];

        this.#issued = DateTime.now();
        this.#expires = this.#ugc.datetime;
    }

    get original() {
        return this.#original;
    }

    get ugc() {
        return this.#ugc;
    }

    get headlines() {
        return this.#headlines;
    }

    get cta() {
        return this.#cta;
    }

    get vtec() {
        return this.#vtec;
    }

    get issued() {
        return this.#issued
    }

    get expires() {
        return this.#expires
    }

    get toObject(): VTECSegmentObject {
        return {
            original: this.#original,
            ugc: this.#ugc.toObject,
            counties_zones: this.#ugc.toDBObject.counties,
            headlines: this.#headlines,
            cta: this.#cta,
            issued: this.#issued.toJSDate(),
            expires: this.#expires.toJSDate()
        }
    }

}

export type VTECSegmentObject = {
    original: string,
    ugc: UGCObject,
    counties_zones: string[]
    headlines: string[],
    cta: string | null,
    issued: Date;
    expires: Date;
}