export class AWIPS {
    #product: string;
    #wfo: string;

    constructor(text: string) {
        text = text.trim()
        if (!(text.length >= 4 && text.length <= 6)) {
            throw new Error('Error reading AWIPS. AWIP = ' + text)
        }
        this.#product = text.slice(0,3)
        this.#wfo = text.slice(3,text.length)
    }

    get = () => {
        return {
            product: this.#product,
            wfo: this.#wfo
        }
    }

    toString = (): string => {
        return this.#product + this.#wfo
    }
}

export const awips = {
    parse: (text: string) => {
        
    }
}