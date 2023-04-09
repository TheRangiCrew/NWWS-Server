"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VTEC = exports.vtec = void 0;
const luxon_1 = require("luxon");
const vtecRegEx = new RegExp(/([A-Z]).([A-Z]+).([A-Z]+).([A-Z]+).([A-Z]).([0-9]+).([0-9TZ]+)-([0-9TZ]+)/g);
exports.vtec = {
    parse: (text) => {
        const vtec = text.match(vtecRegEx);
        if (vtec === null) {
            return null;
        }
        if (vtec[0].split('.').length != 7) {
            return null;
        }
        return new VTEC(vtec[0]);
    }
};
class VTEC {
    #original;
    #productClass;
    #action;
    #wfo;
    #phenomena;
    #significance;
    #eventNumber;
    #startDate;
    #endDate;
    constructor(vtec) {
        this.#original = vtec;
        let data = vtec.split('.');
        this.#productClass = data[0];
        this.#action = data[1];
        this.#wfo = data[2];
        this.#phenomena = data[3];
        this.#significance = data[4];
        this.#eventNumber = Number(data[5]);
        const dates = data[6].split('-');
        this.#startDate = luxon_1.DateTime.fromFormat(dates[0].replaceAll(/[TZ]/g, ''), "yyMMddHHmm", { zone: 'UTC' });
        this.#endDate = luxon_1.DateTime.fromFormat(dates[1].replaceAll(/[TZ]/g, ''), "yyMMddHHmm", { zone: 'UTC' });
    }
    get = () => {
        return {
            productClass: this.#productClass,
            action: this.#action,
            wfo: this.#wfo,
            phenomena: this.#phenomena,
            significance: this.#significance,
            eventNumber: this.#eventNumber,
            startDate: this.#startDate,
            endDate: this.#endDate
        };
    };
    toString = () => {
        return this.#original;
    };
}
exports.VTEC = VTEC;
