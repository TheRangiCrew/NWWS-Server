
export class AWIPS {

    #original: string;
    #product: string;
    #second: string;

    constructor(text: string) {
        const awips = text.match(/^[A-Z0-9_]{6}\n/gm);
        if (awips === null) {
            throw new Error("Could not find AWIPS header");
        }

        this.#original = awips[0].trim();
        this.#product = this.#original.slice(0, 3)
        this.#second = this.#original.slice(3, text.length)
    }

    get product(): string {
        return this.#product;
    }

    get second(): string {
        return this.#second
    }

    get toObject(): AWIPSObject {
        return {
            original: this.#original,
            product: this.#product,
            wfo: this.#second
        }
    }

    toString = (): string => {
        return this.#product + this.#second
    }
}

export type AWIPSObject = {
    original: string,
    product: string,
    wfo: string
}