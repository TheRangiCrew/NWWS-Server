export const geometry = {
    parse: (text: string): number[][] | null => {
        const string = text.replace(/\n/g, " ")
        const index = string.indexOf("LAT...LON")
        if (index === -1) {
            return null
        }
        const newstring = string.slice(index + 9, string.length)
        const end = newstring.search(/[^\s0-9]/g)
        const stringdata = newstring.slice(0, end).split(/[\s]/g).filter((element) => element.length >= 4)

        const coordinates = []

        for (let i = 0; i < stringdata.length; i += 2) {
            coordinates.push([Number(stringdata[i])/100, Number(stringdata[i+1])/100])
        }

        return coordinates
    }
}