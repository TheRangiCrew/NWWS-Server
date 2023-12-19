import { DateTime } from "luxon";


export class WMO {

    #original: string;
    #type: string;
    #office: string;
    #datetime: DateTime;
    #transmission: string;

    constructor(text: string) {
        const header = text.match(/([0-9A-Z]{6,6})\s([A-Z]{4,4})\s([0-9]{6,6})/g);
        if (header === null) {
            throw new Error("Could not find a WMO header\n" + text);
        }
        this.#original = header[0];

        const idtregex = /^[0-9]{3,4} (AM|PM) [A-Z]{3} [A-Za-z]{3} [A-Za-z]{3} [0-9]{2} [0-9]{4}/gm;
        const datetime = text.match(idtregex)

        const segments = this.#original.split(" ");

        if (datetime != null) {
            const elements = datetime[0].split(" ");

            const year = elements[6];
            const month = elements[4]

            this.#datetime = DateTime.fromFormat(year + month + segments[2], "yyyyMMMddHHmm", { zone: 'UTC' });
        } else {
            this.#datetime = DateTime.fromFormat(segments[2], "ddHHmm", { zone: 'UTC' });
        }

        this.#type = segments[0];
        this.#office = segments[1];
        this.#transmission = segments[3];
    }

    get office() {
        return this.#office
    }

    get datettime() {
        return this.#datetime.toFormat("ddHHmm")
    }

    get toObject(): WMOObject {


        return {
            original: this.#original,
            type: this.#type,
            office: this.#office,
            datetime: this.#datetime.toJSDate(),
            transmission: this.#transmission
        }
    }

}

export type WMOObject = {
    original: string,
    type: string,
    office: string,
    datetime: Date,
    transmission: string
}