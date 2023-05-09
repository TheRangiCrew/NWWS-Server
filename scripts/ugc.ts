import { DateTime } from 'luxon'

type States = {
    name: string
    type: string
    counties: number[]
}[]

export class UGC {
    #original: string
    #states: States
    #time: Date


    constructor(ugc: string) {
        // Examples
        // TXC009-077-485-070100-
        // OKC141-TXC487-070030-

        this.#original = ugc

        
        let array = this.#original.split("-");
        array.pop();

        this.#states = [];
        this.#time = DateTime.now().toJSDate()

        let currentIndex = -1;

        array.forEach((element) => {
            if (element.match(/([A-Z])/g) != null) {
                this.#states.push({
                    name: element.substring(0, 2),
                    type: element.substring(2,3),
                    counties: []
                })
                currentIndex++;
                if (element.match(/(>)/g) != null) {
                    const start = Number(element.substring(3,6))
                    const end = Number(element.substring(7, 10))

                    for (let i = start; i <= end; i++) {
                        this.#states[currentIndex].counties.push(i)
                    }
                } else {
                    this.#states[currentIndex].counties.push(Number(element.substring(3,6)))
                }
            } else if (element.length === 6) {
                const day = Number(element.substring(0,2));
                const hour = Number(element.substring(2,4));
                const minute = Number(element.substring(4,6));

                this.#time = DateTime.now().set({day, hour, minute, second: 0, millisecond: 0 }).toJSDate()
            } else {
                this.#states[currentIndex].counties.push(Number(element));
            }
        })
    }

    get = () => {
        return {
            original: this.#original,
            states: this.#states,
            time: this.#time
        }
    }
}

export const ugc = {
    parse: (text: string): UGC | null => {
        const string = text.trim()
        const ugc = string.match(/^(([A-Z]?[A-Z]?[C,Z]?[0-9]{3}[>\-]\s?\n?)+)([0-9]{6})-\s*$/gm)
        if (ugc === null) {
            return null;
        }

        return new UGC(ugc.toString())
    }
}