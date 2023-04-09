"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
class Polygon {
    #polygon = [[0, 0]];
    constructor(text) {
        text = text.trim();
        let array = text.replaceAll(/[A-Z/.]/g, '').split(/\n/).map((element) => {
            return element.trim();
        });
        array.pop();
        let filtered = "";
        array.forEach((element) => {
            filtered += ` ${element}`;
        });
        let filteredArray = filtered.trim().split(' ');
        this.#polygon.pop();
        for (let i = 0; i < filteredArray.length; i += 2) {
            this.#polygon.push([Number(filteredArray[i]) / 100, Number(filteredArray[i + 1]) / 100]);
        }
    }
    get = () => {
        return this.#polygon;
    };
}
exports.Polygon = Polygon;
