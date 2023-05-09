export type Tags = {
    windThreatTag: String | undefined
    windMaxTag: String | undefined
    hailThreatTag: String | undefined
    hailMaxTag: String | undefined
    thunderstormThreatTag: String | undefined
    tornadoThreatTag: String | undefined
    tornadoTag: String | undefined
}

const re = {
    windThreatTag: new RegExp(/(WIND THREAT)\.\.\./g),
    wingMaxTag: new RegExp(/(WIND|MAX WIND GUST)\.\.\./g),
    hailThreatTag: new RegExp(/(HAIL THREAT)\.\.\./g),
    hailMaxTag: new RegExp(/(HAIL|MAX HAIL SIZE)\.\.\./g),
    thunderstormThreatTag: new RegExp(/(THUNDERSTORM DAMAGE THREAT)\.\.\./g),
    tornadoThreatTag: new RegExp(/(TORNADO DAMAGE THREAT)\.\.\./g),
    tornadoTag: new RegExp(/(TORNADO)\.\.\./g),
}

export const getTags = (text: string): Tags => {
    const array = text.split("\n").map(element => element.replace("\n", ""));

    return {
        windThreatTag: array.find(line => line.match(re.windThreatTag))?.split("...")[1],
        windMaxTag: array.find(line => line.match(re.wingMaxTag))?.split("...")[1],
        hailThreatTag: array.find(line => line.match(re.hailThreatTag))?.split("...")[1],
        hailMaxTag: array.find(line => line.match(re.hailMaxTag))?.split("...")[1],
        thunderstormThreatTag: array.find(line => line.match(re.thunderstormThreatTag))?.split("...")[1],
        tornadoThreatTag: array.find(line => line.match(re.tornadoThreatTag))?.split("...")[1],
        tornadoTag: array.find(line => line.match(re.tornadoTag))?.split("...")[1]
    }
}