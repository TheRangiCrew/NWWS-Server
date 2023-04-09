
export class Polygon {
    #polygon: [[number, number]] = [[0,0]]

    constructor(text: string) {
        text = text.trim()
        let array = text.replaceAll(/[A-Z/.]/g, '').split(/\n/).map((element) => {
            return element.trim()
        })
        array.pop()

        let filtered = "";

        array.forEach((element) => {
            filtered += ` ${element}`
        })

        let filteredArray = filtered.trim().split(' ')

        this.#polygon.pop()

        for (let i = 0; i < filteredArray.length; i += 2) {
            this.#polygon.push([Number(filteredArray[i])/100, Number(filteredArray[i+1])/100])
        }
    }

    get = (): [[number, number]] => {
        return this.#polygon
    }
}

