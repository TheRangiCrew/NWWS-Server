import { DateTime } from "luxon";

export class Motion {
    #time: string;
    #trajectory: number;
    #speed: number;
    #location: [[number, number]] = [[0,0]]

    constructor(text: string) {
        text = text.trim()
        let array = text.replaceAll(/[A-Z/.]/g, '').split(/\n/).map((element) => {
            return element.trim()
        })
        let filtered = array.pop()?.split(' ') ?? ''

        this.#time = filtered[0].slice(0,2) + ":" + filtered[0].slice(2);

        this.#speed = Number(filtered[1])

        this.#trajectory = Number(filtered[2])

        this.#location.pop()

        for(let i = 3; i < filtered.length; i += 2) {
            this.#location.push([Number(filtered[i])/100, Number(filtered[i+1])/100])
        }
    }

    get = () => {
        return {
            time: this.#time,
            trajectory: this.#trajectory,
            speed: this.#speed,
            location: this.#location
        }
    }
}