import fs from 'fs'

interface County {
    number: number,
    name: string,
    abbr: string
}

export class UGC {
    #original: string
    #state: string
    #type: string
    #counties: number[]
    #time: string


    constructor(ugc: string) {
        this.#original = ugc

        let array = this.#original.split("-")

        this.#state = array[0].slice(0,2)
        this.#type = array[0].slice(2,3)

        array[0] = array[0].slice(3, array[0].length)

        this.#time = array[array.length-1]

        array.pop()

        this.#counties = array.map((element) => {
            return Number(element)
        })
    }

    get = () => {
        return {
            original: this.#original,
            state: this.#state,
            type: this.#type,
            counties: this.#counties,
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