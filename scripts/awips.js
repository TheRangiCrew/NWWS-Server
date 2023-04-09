"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awips = exports.AWIPS = void 0;
class AWIPS {
    #product;
    #wfo;
    constructor(text) {
        text = text.trim();
        if (!(text.length >= 4 && text.length <= 6)) {
            throw new Error('Error reading AWIPS. AWIP = ' + text);
        }
        this.#product = text.slice(0, 3);
        this.#wfo = text.slice(3, text.length);
    }
    get = () => {
        return {
            product: this.#product,
            wfo: this.#wfo
        };
    };
    toString = () => {
        return this.#product + this.#wfo;
    };
}
exports.AWIPS = AWIPS;
exports.awips = {
    parse: (text) => {
    }
};
