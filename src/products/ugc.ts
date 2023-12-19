import { DateTime } from "luxon";

type State = {
    name: string
    type: string
    counties: string[]
}

/**
 * A WMO UGC
 */
export class UGC {

    #original: string;
    #date: DateTime;
    #states: State[];

    constructor(text: string) {
        this.#original = this.#find(text);

        if (this.#original.length <= 0) {
            throw new Error("Could not find UGC in segment");
        }

        let segments: string[] = this.#original.split("-");

        if (segments.length <= 1) {
            throw new Error("Could not find UGC in segment");
        }

        segments.pop();

        const end = segments[segments.length - 1]

        const day = Number(end.substring(0, 2));
        const hour = Number(end.substring(2, 4));
        const minute = Number(end.substring(4, 6));

        this.#date = DateTime.now().set({ day, hour, minute, second: 0, millisecond: 0 });

        segments.pop();

        this.#states = [];
        let currentState: State | null = null;

        segments.forEach(element => {
            console.log(element)

            if (element.match(/[A-Z]/g) != null) {
                currentState = {
                    name: element.substring(0, 2),
                    type: element.substring(2, 3),
                    counties: []
                }
                this.#states.push(currentState)

                element = element.substring(3, element.length);
            }

            console.log(element)

            if (element.match(/>/g) != null) {
                const start = Number(element.substring(0, 3));
                const end = Number(element.substring(4, 7));

                console.log(start)
                console.log(end)

                for (let i = start; i <= end; i++) {
                    currentState?.counties.push(i.toString().padStart(3, '0'));
                }

            } else {
                currentState?.counties.push(element);
            }
        })
    }

    #find = (text: string): string => {
        // Find index of UGC and slice start of text
        let index = text.search(/^[A-Z]{2}(C|Z)[A-Z0-9]{3}(-|>)/gm)
        text = text.slice(index, text.length);
        // Find index of new line and slice end of text
        let nlindex = text.search(/([0-9]{6}-\n)/gm);
        // Add 7 to compensate for the length of the datetime string
        text = text.slice(0, nlindex + 7);
        text = text.replaceAll(/\n/g, "");
        return text;
    }

    toString = () => {
        return this.#original;
    }

    get datetime() {
        return this.#date
    }

    get toObject(): UGCObject {
        return {
            original: this.#original,
            date: this.#date.toJSDate(),
            states: this.#states
        }
    }

    get toDBObject(): UGCDBObject {
        const arr: string[] = [];

        this.#states.forEach((state) => {
            state.counties.forEach((county) => {
                switch (state.type) {
                    case "C":
                    case "c":
                        arr.push(`counties:${state.name + county}`);
                        break;
                    case "Z":
                    case "z":
                        arr.push(`zones:${state.name + county}`);
                        break;
                }
            })
        })


        return {
            original: this.#original,
            date: this.#date.toJSDate(),
            counties: arr
        }
    }

}

export type UGCObject = {
    original: string,
    date: Date,
    states: State[]
}

export type UGCDBObject = {
    original: string,
    date: Date,
    counties: string[]
}