class Motion {

    #direction: number;
    #speed: number;

    constructor(direction: number, speed: number) {
        this.#direction = direction;
        this.#speed = speed;
    }

    get toObject(): MotionObject {
        return {
            direction: this.#direction,
            speed: this.#speed
        }
    }
}

type MotionObject = {
    direction: number,
    speed: number
}

export class TML {

    #original: string | null;
    #time: string | null;
    #motion: Motion | null;
    #location: number[] | null;

    constructor(text: string) {
        this.#original = this.#find(text);

        if (this.#original === null) {
            this.#time = null;
            this.#motion = null;
            this.#location = null;
            return;
        }

        const segments = this.#original.split(" ");


        // Clean up array
        segments.shift();

        this.#time = segments[0];

        const direction = Number(segments[1].replace(/[A-Z]/g, ""));
        const speed = Number(segments[2].replace(/[A-Z]/g, ""));

        this.#motion = new Motion(direction, speed);

        const lat = Number(segments[3]) / 100;
        let lon = (Number(segments[4]) / 100) * -1;
        if (lon <= -180) {
            lon = lon + 360;
        }
        this.#location = [lon, lat];
    }

    #find = (text: string): string | null => {
        const tmlregex = /^(TIME\.\.\.MOT\.\.\.LOC)([A-Za-z0-9 ]*)/gm;
        const tml = text.match(tmlregex);
        return tml === null ? null : tml[0];
    }

    get toObject(): TMLObject {
        return {
            original: this.#original,
            time: this.#time,
            motion: this.#motion?.toObject ?? null,
            location: this.#location
        }
    }

}

export type TMLObject = {
    original: string | null;
    time: string | null;
    motion: MotionObject | null;
    location: number[] | null;
}