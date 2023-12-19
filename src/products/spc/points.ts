import { Processor } from "../product";
import distance from "@turf/distance"
import boundaries from "./conus_boundaries.json";
import { DateTime } from "luxon";
import surreal from "../../../src/db/surreal";

const outlookPoints = async (text: string, product: Processor) => {
    const dayString = product.awips.second;

    let points = {};

    switch (dayString) {
        case "DY1":
        case "DY2":
            points = parseDay12(text)
            break;
        case "DY3":
            points = parseDay3(text)
            break;
        case "D48":
            points = parseDay48(text);
            break;
        default:
            throw new Error("Could not find SPC Outlook day");
    }

    const validString = text.match(/VALID TIME ([0-9]{6}Z) - ([0-9]{6}Z)/g)

    if (validString === null) {
        throw new Error("Could not find SPC Outlook Valid Time");
    }

    const timeStrings = validString[0].match(/([0-9]{6}Z)/g);

    if (timeStrings === null) {
        throw new Error("Could not find SPC Outlook Valid Time Strings");
    }

    const validFrom = parseTime(timeStrings[0])
    const validTo = parseTime(timeStrings[1])

    const now = DateTime.utc();

    const id = now.toFormat('yyyyLLdd') + dayString + validFrom.toFormat('hhmm')

    await surreal.insert(`spc_outlooks`, {
        id,
        day: dayString,
        narrative: "",
        points: points,
        valid_from: validFrom.toISO(),
        valid_to: validTo.toISO(),
        created_at: DateTime.now().toISO()
    })
}

const parseDay12 = (text: string) => {
    let points = {
        tor: [],
        hail: [],
        wind: [],
        cat: [],
    }

    const tornadoSegment = find(text, "... TORNADO ...").trim();

    if (tornadoSegment.length > 0) {
        points.tor = getPoints(tornadoSegment);
    }

    const hailSegment = find(text, "... HAIL ...").trim();

    if (hailSegment.length > 0) {
        points.hail = getPoints(hailSegment);
    }

    const windSegment = find(text, "... WIND ...").trim();

    if (windSegment.length > 0) {
        points.wind = getPoints(windSegment);
    }

    const catSegment = find(text, "... CATEGORICAL ...")

    if (catSegment.length > 0) {
        points.cat = getPoints(catSegment);
    }

    return points;
}

const parseDay3 = (text: string) => {
    let points = {
        cat: [],
        prob: []
    }

    const catSegment = find(text, "... CATEGORICAL ...")

    if (catSegment.length > 0) {
        points.cat = getPoints(catSegment);
    }

    const probSegment = find(text, "... ANY SEVERE ...")

    if (probSegment.length > 0) {
        points.prob = getPoints(probSegment);
    }

    return points;

}

const parseDay48 = (text: string) => {
    let points = {
        day4: [],
        day5: [],
        day6: [],
        day7: [],
        day8: [],
    }

    for (let i = 4; i <= 8; i++) {
        const probSegment = find(text, `SEVERE WEATHER OUTLOOK POINTS DAY ${i}\n\n... ANY SEVERE ...`);

        if (probSegment.length > 0) {
            switch (i) {
                case 4:
                    points.day4 = getPoints(probSegment);
                    break;
                case 5:
                    points.day5 = getPoints(probSegment);
                    break;
                case 6:
                    points.day6 = getPoints(probSegment);
                    break;
                case 7:
                    points.day7 = getPoints(probSegment);
                    break;
                case 8:
                    points.day8 = getPoints(probSegment);
                    break;
            }
        }
    }

    return points;
}

const find = (text: string, ex: string): string => {
    const start = text.indexOf(ex);
    text = text.slice(start + ex.length, text.length);
    const end = text.indexOf("&&");
    return text.slice(0, end).trim();
}

const getPoints = (text: string) => {
    const textPoints = text.match(/([A-Z.0-9]{3,4} {3,4})([0-9]{8}( |\n {7}|\n))*/g)?.map(t => {
        return t.trim()
    })

    if (textPoints === undefined) {
        return;
    }

    let output: any = []

    textPoints.forEach(t => {
        const elements = t.match(/[A-Z0-9.]+/g);

        if (elements === null) {
            return;
        }

        const title = elements[0];

        let segment: {
            area: string,
            points: [number, number][]
        } = {
            area: title,
            points: []
        }

        elements.shift();

        let join = false;

        elements.forEach((point) => {
            if (point === "99999999") {
                join = true;
                console.log("Joining...")
                return;
            }

            let lat = Number(point.slice(0, 4)) / 100
            let lon = Number(point.slice(4, point.length)) / 100;
            if (lon < 50) {
                lon += 100;
            }

            const p: [number, number] = [lon * -1, lat]

            if (join === true) {
                join = false;
                const last = segment.points[segment.points.length - 1]

                findBoundaries(last, p).forEach((e, index) => {
                    if (index != 0) {
                        segment.points.push(e as [number, number])
                    }
                })
            }

            segment.points.push(p);
        })

        const last = segment.points.length - 1;

        if (segment.points[last] != segment.points[0]) {
            findBoundaries(segment.points[last], segment.points[0]).forEach((e, index) => {
                if (index != 0) {
                    segment.points.push(e as [number, number])
                }
            });
            segment.points.push(segment.points[0]);
        }

        output.push(segment)
    })


    return output
}

const findBoundaries = (start: [number, number], end: [number, number]) => {
    let smallest: number | null = null;
    let startIndex = -1;

    boundaries.forEach((point, index) => {
        const d = distance(start, point, { units: "miles" });

        if (smallest === null) {
            smallest = d;
            startIndex = index;
        } else if (d < smallest) {
            smallest = d;
            startIndex = index;
        }
    })

    smallest = null;
    let endIndex = -1;

    boundaries.forEach((point, index) => {
        const d = distance(end, point, { units: "miles" });

        if (smallest === null) {
            smallest = d;
            endIndex = index;
        } else if (d < smallest) {
            smallest = d;
            endIndex = index;
        }
    })

    return boundaries.slice(startIndex, endIndex);

}

const parseTime = (text: string) => {
    const day = Number(text.slice(0, 2));
    const hour = Number(text.slice(2, 4));
    const minute = Number(text.slice(4, 6));

    let datetime = DateTime.utc()

    if (datetime.day > day) {
        datetime = datetime.plus({ month: 1 })
    }

    datetime = datetime.set({ day, hour, minute, second: 0, millisecond: 0 })

    if (!datetime.isValid) {
        throw new Error("Could not parse datetime from SPC Valid Time String")
    }

    return datetime
}

export default outlookPoints;