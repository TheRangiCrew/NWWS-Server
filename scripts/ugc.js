"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ugc = exports.UGC = void 0;
class UGC {
    #original;
    #state;
    #type;
    #counties;
    #time;
    constructor(ugc) {
        this.#original = ugc;
        let array = this.#original.split("-");
        this.#state = array[0].slice(0, 2);
        this.#type = array[0].slice(2, 3);
        array[0] = array[0].slice(3, array[0].length);
        this.#time = array[array.length - 1];
        array.pop();
        this.#counties = array.map((element) => {
            return Number(element);
        });
    }
    get = () => {
        return {
            original: this.#original,
            state: this.#state,
            type: this.#type,
            counties: this.#counties,
            time: this.#time
        };
    };
}
exports.UGC = UGC;
exports.ugc = {
    parse: (text) => {
        const string = text.trim();
        const ugc = string.match(/^(([A-Z]?[A-Z]?[C,Z]?[0-9]{3}[>\-]\s?\n?)+)([0-9]{6})-\s*$/gm);
        if (ugc === null) {
            return null;
        }
        return new UGC(ugc.toString());
    }
};
