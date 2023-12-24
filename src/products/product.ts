import { DateTime } from "luxon";
import { AWIPS, AWIPSObject } from "./awips";
import { SevereSegment } from "./vtec/severe";
import { WMO, WMOObject } from "./wmo";
import outlookPoints from "./spc/points";
import vtecProduct from "./vtec/vtecProduct";

const allowedProducts = ["SVR", "TOR", "SVS", "SMW"]

class ProductID {

    #wfo: string;
    #product: string;
    #event: string | null;
    #datetime: string;
    #year: number;

    constructor(product: Product) {
        this.#wfo = product.wmo.office;
        this.#product = product.awips.product;
        const vtec = product.segments.find((segment) => {
            return typeof segment === typeof SevereSegment;
        })?.vtec;

        if (vtec != null && vtec != undefined && vtec.phenomena != null) {
            this.#event = vtec.phenomena + vtec.significance + vtec.eventNumber;
        } else {
            this.#event = null;
        }

        this.#datetime = product.wmo.datettime;
        this.#year = DateTime.now().year;
    }

    toString() {
        return this.#wfo + (this.#event != null ? this.#event : this.#product + this.#datetime) + this.#year
    }

}

/**
 * An NWS text product
 */
export class Product {

    #id: ProductID;
    #original: string;
    #wmo: WMO;
    #awips: AWIPS;
    #broadcast_line: string | null; // Broadcast Instruction Line
    #issuing_office_line: string; // Issuing Office Line
    #issuing_office_backup: string | null; // Issuing Office Backup
    #issuing_datetime: string;
    #segments: Segment[];

    constructor(text: string) {
        this.#original = text;

        this.#wmo = new WMO(this.#original);

        try {
            this.#awips = new AWIPS(this.#original);

            if (!allowedProducts.includes(this.#awips.product)) {
                throw new Error(`Unwanted Product (${this.#wmo.office} - ${this.#awips.product})`)
            }

            // Get BIL
            const bilregex = /^(BULLETIN - |URGENT - |EAS ACTIVATION REQUESTED|IMMEDIATE BROADCAST REQUESTED|FLASH - |REGULAR - |HOLD - |TEST...)(.*)/gm;
            const bil = this.#original.match(bilregex);

            if (bil === null) {
                this.#broadcast_line = null;
            } else {
                this.#broadcast_line = bil[0];
            }

            const iolregex = /^(NATIONAL WEATHER SERVICE |National Weather Service )(.*)/gm;
            this.#issuing_office_line = this.#original.match(iolregex)![0];

            const iobregex = /^(ISSUED BY NATIONAL WEATHER SERVICE |Issued By National Weather Service )(.*)/gm;
            const iob = this.#original.match(iobregex);

            if (iob === null) {
                this.#issuing_office_backup = null;
            } else {
                this.#issuing_office_backup = iob[0];
            }

            const idtregex = /^[0-9]{3,4} (AM|PM) [A-Z]{3,4} ([A-Za-z]{3} ){2}[0-9]{1,2} [0-9]{4}/gm;
            this.#issuing_datetime = this.#original.match(idtregex)![0];

            this.#segments = [];
            this.#original.split(/\$\$/g).forEach((segment) => {
                if (segment.length <= 20) {
                    return;
                }

                switch (this.#awips.product) {
                    case "SVR":
                    case "TOR":
                    case "SVS":
                    case "SMW":
                        this.#segments.push(new SevereSegment(segment));
                        break;
                }
            });

            this.#id = new ProductID(this);
        } catch (e) {
            throw e;
        }
    }

    get id() {
        return this.#id;
    }

    get wmo() {
        return this.#wmo;
    }

    get awips() {
        return this.#awips;
    }

    get segments() {
        return this.#segments
    }

    get toObject(): ProductObject {
        return {
            id: this.#id.toString(),
            original: this.#original,
            wmo_header: this.#wmo.toObject,
            awips: this.#awips.toObject,
            broadcast_line: this.#broadcast_line,
            issuing_office_line: this.#issuing_office_line,
            issuing_office_backup: this.#issuing_office_backup,
            issuing_datetime: this.#issuing_datetime
        }
    }

}

export type ProductObject = {
    id: string,
    original: string,
    wmo_header: WMOObject,
    awips: AWIPSObject,
    broadcast_line: string | null,
    issuing_office_line: string,
    issuing_office_backup: string | null,
    issuing_datetime: string
}

export class Processor {

    original: string;
    wmo: WMO;
    awips: AWIPS;

    constructor(text: string) {
        this.original = text;

        this.wmo = new WMO(this.original);

        this.awips = new AWIPS(this.original);

        // if (!allowedProducts.includes(this.awips.product)) {
        //     throw new Error(`Unwanted Product (${this.wmo.office} - ${this.awips.product})`)
        // }

        switch (this.awips.product) {
            case "PTS":
                outlookPoints(this.original, this);
                break;
            case "SVR":
            case "TOR":
            case "SVS":
            case "SMW":
                vtecProduct(this.original, this)
            default:
                return;
        }

    }
}