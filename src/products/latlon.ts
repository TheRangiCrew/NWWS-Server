

export class LatLon {

    #original: string | null;
    #points: number[][];

    constructor(text: string) {
        this.#original = this.#find(text);
        this.#points = [];

        const segments = this.#original?.match(/[0-9]{4,8}/g);

        if (segments === null || segments === undefined) {
            return;
        }

        if (segments[0].length > 5) {
            segments.forEach(segment => {
                const lat = Number(segment.slice(0, 4)) / 100;
                let lon = (Number(segment.slice(4, 8)) / 100) * -1;
                if (lon < 10) {
                    lon = lon + 100;
                }
                this.#points.push([lon, lat]);
            })
        } else {
            for (let i = 0; i < segments.length; i += 2) {
                const lat = Number(segments[i]) / 100;
                let lon = (Number(segments[i + 1]) / 100) * -1;
                if (lon <= -180) {
                    lon = lon + 360;
                }
                this.#points.push([lon, lat]);
            }
        }
    }

    #find = (text: string): string | null => {
        const latlonregex = /^LAT\.\.\.LON\s+(\d+\s+)+/gm;
        const latlon = text.match(latlonregex);
        return latlon != null ? latlon[0] : null;
    }

    get original() {
        return this.#original
    }

    get points() {
        return this.#points
    }

    get toObject(): LatLonObject {
        return {
            original: this.#original,
            points: this.#points
        }
    }

    get toGEOJson() {
        return {
            type: "Polygon",
            coordinates: [this.#points]
        }
    }

}

export type LatLonObject = {
    original: string | null;
    points: number[][];
}