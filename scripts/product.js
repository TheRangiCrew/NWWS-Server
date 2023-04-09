"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processProduct = exports.Segment = void 0;
const vtec_1 = require("./vtec");
const geometry_1 = require("./geometry");
const tml_1 = require("./tml");
const ugc_1 = require("./ugc");
const push_1 = require("./push");
const awips_1 = require("./awips");
const wanted = [
    "TOR",
    "SVR",
    "SVS",
    "FFW",
    "SMW",
    "SPS"
];
const getWMO = (text) => {
    const header = text.match(/([0-9A-Z]{6,6})\s([A-Z]{4,4})\s([0-9]{6,6})/g);
    if (header === null) {
        throw new Error("Could not find a WMO header");
    }
    return header.toString();
};
const getAWIPS = (text) => {
    const awips = text.match(new RegExp(/^([A-Z0-9]{4,6})\n$/, 'gm'));
    console.log(awips);
    if (awips === null) {
        return null;
    }
    return new awips_1.AWIPS(awips[0]);
};
const getHeadlines = (text) => {
    const matches = [...text.matchAll(/^\.\.\.(.*?)\.\.\.[ ]?\n\n/gms)];
    const headlines = [];
    matches.forEach((element) => {
        headlines.push(element[0]);
    });
    return headlines;
};
const getHazard = (text) => {
    const newText = text.split("\n");
    const index = newText.findIndex((element) => element.match(/(HAZARD)\.\.\./g));
    if (index === -1) {
        return null;
    }
    const hazard = newText[index].split("...");
    if (hazard.length < 2) {
        return null;
    }
    return hazard[1].replace(/\./g, "");
};
/**
 * Finds any `SOURCE...` lines and returns them or `null`
 *
 * @param text The product
 * @returns The source of the product or `null`
 */
const getSource = (text) => {
    const newText = text.split(/\n\n/g);
    const index = newText.findIndex((element) => element.match(/(SOURCE)\.\.\./g));
    if (index === -1) {
        return null;
    }
    const sourceArray = newText[index].split("...");
    if (sourceArray.length < 2) {
        return null;
    }
    let source = sourceArray[1].replace(/[\n  ]{2}/g, "");
    return source.slice(0, source.length - 1);
};
/**
 * Finds any `IMPACT(S)...` lines and returns them or `null`
 *
 * @param text The product
 * @returns The impacts or `null`
 */
const getImpact = (text) => {
    const newText = text.split(/\n\n/g);
    const index = newText.findIndex((element) => element.match(/(IMPACT|IMPACTS)\.\.\./g));
    if (index === -1) {
        return null;
    }
    const impact = newText[index].split("...")[1].replace(/[\n  ]{2}/g, "");
    return impact;
};
const getPPA = (text) => {
    const field = "PRECAUTIONARY/PREPAREDNESS ACTIONS...\n\n".length;
    const start = text.lastIndexOf("PRECAUTIONARY/PREPAREDNESS ACTIONS...\n");
    if (start === -1) {
        return null;
    }
    const end = text.indexOf("\n\n&&");
    const ppa = text.slice(start + field, end).split(/\n\n/g);
    let output = "";
    ppa.forEach((element) => {
        element.split(/\n/).forEach((element) => (output += element + " "));
    });
    return output;
};
class Segment {
    #original;
    #ugc;
    #vtec;
    #eas;
    #headlines;
    #geometry;
    #tml;
    #hazard;
    #source;
    #impact;
    #ppa;
    #emergency;
    #pds;
    constructor(text) {
        this.#original = text;
        this.#ugc = ugc_1.ugc.parse(text);
        this.#vtec = vtec_1.vtec.parse(this.#original);
        this.#eas = text.match(/(EAS)/g) != null ? true : false;
        this.#geometry = geometry_1.geometry.parse(this.#original);
        this.#headlines = getHeadlines(this.#original);
        this.#tml = tml_1.tml.parse(text);
        this.#hazard = getHazard(text);
        this.#source = getSource(text);
        this.#impact = getImpact(text);
        this.#ppa = getPPA(text);
        this.#emergency =
            text.match(/(TORNADO|FLASH\s+FLOOD)\s+EMERGENCY/g) != null ? true : false;
        this.#pds =
            text.match(/THIS\s+IS\s+A\s+PARTICULARLY\s+DANGEROUS\s+SITUATION/g) !=
                null
                ? true
                : false;
    }
    get = () => {
        return {
            original: this.#original,
            ugc: this.#ugc,
            vtec: this.#vtec,
            eas: this.#eas,
            geometry: this.#geometry,
            headlines: this.#headlines,
            tml: this.#tml,
            hazard: this.#hazard,
            source: this.#source,
            impact: this.#impact,
            ppa: this.#ppa,
            emergency: this.#emergency,
            pds: this.#pds,
        };
    };
    toString = () => {
        return `${this.#vtec}\n\n${this.#headlines.toString()}\n...EMERGENCY...${this.#emergency}\n\n`;
    };
}
exports.Segment = Segment;
const processProduct = (product) => {
    const wmoHeader = getWMO(product);
    const awips = getAWIPS(product);
    if (awips === null || !wanted.includes(awips.get().product)) {
        return;
    }
    const segments = product.split(/\$\$/g).map((segment) => {
        if (segment.length > 20) {
            return new Segment(segment);
        }
    });
    segments.pop();
    segments.forEach((segment) => {
        switch (segment?.get().vtec?.get().action) {
            case "NEW":
                console.log("\n" + awips + "\nNew Product\n");
                push_1.pushProduct.new(segment, wmoHeader, awips.toString());
                break;
            case "CON":
                console.log("Continued");
                break;
            case "CAN":
                console.log("Cancelled");
                break;
        }
    });
};
exports.processProduct = processProduct;
// const text = [
//   `944
// WFUS54 KLZK 311928
// TORLZK
// ARC045-085-117-119-145-312015-
// /O.NEW.KLZK.TO.W.0044.230331T1928Z-230331T2015Z/
// BULLETIN - EAS ACTIVATION REQUESTED
// Tornado Warning
// National Weather Service Little Rock AR
// 228 PM CDT Fri Mar 31 2023
// ...TORNADO EMERGENCY FOR Metro Little Rock...
// The National Weather Service in Little Rock has issued a
// * Tornado Warning for...
//   Northwestern Prairie County in central Arkansas...
//   Northern Lonoke County in central Arkansas...
//   Southeastern Faulkner County in central Arkansas...
//   South central White County in central Arkansas...
//   Northeastern Pulaski County in central Arkansas...
// * Until 315 PM CDT.
// * At 227 PM CDT, a confirmed large and destructive tornado was
//   observed over Burns Park, or near West Little Rock, moving
//   northeast at 55 mph.
//   TORNADO EMERGENCY for metro Little Rock. This is a PARTICULARLY
//   DANGEROUS SITUATION. TAKE COVER NOW!
//   HAZARD...Deadly tornado.
//   SOURCE...Radar confirmed tornado.
//   IMPACT...You are in a life-threatening situation. Flying debris
//            may be deadly to those caught without shelter. Mobile
//            homes will be destroyed. Considerable damage to homes,
//            businesses, and vehicles is likely and complete
//            destruction is possible.
// * Locations impacted include...
//   Little Rock...                    North Little Rock...
//   Sherwood...                       Jacksonville...
//   Cabot...                          West Little Rock...
//   Maumelle...                       Downtown Little Rock...
//   North Little Rock Airport...      Little Rock AFB...
//   Southwest Little Rock...          Beebe...
//   Ward...                           Austin in Lonoke County...
//   Argenta...                        Old Austin...
//   Parnell...                        Gravel Ridge...
//   Olmstead...                       Thurman...
// PRECAUTIONARY/PREPAREDNESS ACTIONS...
// To repeat, a large, extremely dangerous and potentially deadly
// tornado is on the ground. To protect your life, TAKE COVER NOW! Move
// to an interior room on the lowest floor of a sturdy building. Avoid
// windows. If in a mobile home, a vehicle or outdoors, move to the
// closest substantial shelter and protect yourself from flying debris.
// Heavy rainfall may hide this tornado. Do not wait to see or hear the
// tornado. TAKE COVER NOW!
// &&
// LAT...LON 3471 9242 3488 9250 3518 9178 3494 9163
// TIME...MOT...LOC 1927Z 244DEG 46KT 3481 9235
// TORNADO...OBSERVED
// TORNADO DAMAGE THREAT...CATASTROPHIC
// MAX HAIL SIZE...2.00 IN
// $$
// 53`,
//   `988
// WWUS54 KLZK 311932
// SVSLZK
// Severe Weather Statement
// National Weather Service Little Rock AR
// Issued by National Weather Service Memphis TN
// 232 PM CDT Fri Mar 31 2023
// ARC045-085-117-119-145-312015-
// /O.CON.KLZK.TO.W.0044.000000T0000Z-230331T2015Z/
// Prairie AR-Lonoke AR-Faulkner AR-White AR-Pulaski AR-
// 232 PM CDT Fri Mar 31 2023
// ...TORNADO EMERGENCY FOR Metro Little Rock...
// ...A TORNADO WARNING REMAINS IN EFFECT UNTIL 315 PM CDT FOR
// NORTHWESTERN PRAIRIE...NORTHERN LONOKE...SOUTHEASTERN FAULKNER...
// SOUTH CENTRAL WHITE AND NORTHEASTERN PULASKI COUNTIES...
// At 231 PM CDT, a confirmed large and destructive tornado was located
// over Levy, or near North Little Rock, moving northeast at 55 mph.
// TORNADO EMERGENCY for Metro Little Rock. This is a PARTICULARLY
// DANGEROUS SITUATION. TAKE COVER NOW!
// HAZARD...Deadly tornado.
// SOURCE...Broadcast media confirmed tornado.
// IMPACT...You are in a life-threatening situation. Flying debris may
//          be deadly to those caught without shelter. Mobile homes
//          will be destroyed. Considerable damage to homes,
//          businesses, and vehicles is likely and complete destruction
//          is possible.
// Locations impacted include...
// Little Rock, North Little Rock, Sherwood, Jacksonville, Cabot,
// Maumelle, Downtown Little Rock, North Little Rock Airport, Little
// Rock AFB, Beebe, Ward, Austin in Lonoke County, Argenta, Old Austin,
// Burns Park, Parnell, Gravel Ridge, Morgan, Marche and Oak Grove in
// Pulaski County.
// PRECAUTIONARY/PREPAREDNESS ACTIONS...
// To repeat, a large, extremely dangerous, and potentially deadly
// tornado is on the ground. To protect your life, TAKE COVER NOW! Move
// to an interior room on the lowest floor of a sturdy building. Avoid
// windows. If in a mobile home, a vehicle or outdoors, move to the
// closest substantial shelter and protect yourself from flying debris.
// Heavy rainfall may hide this tornado. Do not wait to see or hear the
// tornado. TAKE COVER NOW!
// &&
// LAT...LON 3472 9238 3491 9240 3518 9178 3494 9163
// TIME...MOT...LOC 1931Z 246DEG 46KT 3481 9229
// TORNADO...OBSERVED
// TORNADO DAMAGE THREAT...CATASTROPHIC
// MAX HAIL SIZE...1.00 IN
// $$
// MJ`,
//   `599
// WWUS54 KLZK 311942
// SVSLZK
// Severe Weather Statement
// National Weather Service Little Rock AR
// Issued by National Weather Service Memphis TN
// 242 PM CDT Fri Mar 31 2023
// ARC045-311950-
// /O.CAN.KLZK.TO.W.0044.000000T0000Z-230331T2015Z/
// Faulkner AR-
// 242 PM CDT Fri Mar 31 2023
// ...THE TORNADO WARNING FOR SOUTHEASTERN FAULKNER COUNTY IS
// CANCELLED...
// The tornadic thunderstorm which prompted the warning has moved out
// of the warned area. Therefore, the warning has been cancelled.
// A Tornado Watch remains in effect until 800 PM CDT for central
// Arkansas.
// LAT...LON 3477 9222 3491 9231 3493 9227 3493 9223
//       3495 9223 3518 9178 3494 9163
// TIME...MOT...LOC 1940Z 244DEG 44KT 3484 9217
// $$
// ARC085-117-119-145-312015-
// /O.CON.KLZK.TO.W.0044.000000T0000Z-230331T2015Z/
// Prairie AR-Lonoke AR-White AR-Pulaski AR-
// 242 PM CDT Fri Mar 31 2023
// ...TORNADO EMERGENCY FOR Sherwood and Jacksonville...
// ...A TORNADO WARNING REMAINS IN EFFECT UNTIL 315 PM CDT FOR
// NORTHWESTERN PRAIRIE...NORTHERN LONOKE...SOUTH CENTRAL WHITE AND
// NORTHEASTERN PULASKI COUNTIES...
// At 240 PM CDT, a confirmed large and destructive tornado was located
// over Gravel Ridge, or over Sherwood, moving northeast at 50 mph.
// TORNADO EMERGENCY for Sherwood and Jacksonville. This is a
// PARTICULARLY DANGEROUS SITUATION. TAKE COVER NOW!
// HAZARD...Deadly tornado.
// SOURCE...Broadcast media confirmed tornado. At 240 PM CDT, a large,
//          destructive tornado was producing damage at Highway 67 and
//          Interstate 440.
// IMPACT...You are in a life-threatening situation. Flying debris may
//          be deadly to those caught without shelter. Mobile homes
//          will be destroyed. Considerable damage to homes,
//          businesses, and vehicles is likely and complete destruction
//          is possible.
// Locations impacted include...
// North Little Rock, Sherwood, Jacksonville, Cabot, North Little Rock
// Airport, Little Rock AFB, Beebe, Ward, Austin in Lonoke County, Old
// Austin, Parnell, Gravel Ridge, Sylvania, Olmstead, Thurman, McRae,
// Gibson, Sylvan Hills, McAlmont and South Bend.
// PRECAUTIONARY/PREPAREDNESS ACTIONS...
// To repeat, a large, extremely dangerous, and potentially deadly
// tornado is on the ground. To protect your life, TAKE COVER NOW! Move
// to an interior room on the lowest floor of a sturdy building. Avoid
// windows. If in a mobile home, a vehicle or outdoors, move to the
// closest substantial shelter and protect yourself from flying debris.
// Heavy rainfall may hide this tornado. Do not wait to see or hear the
// tornado. TAKE COVER NOW!
// &&
// LAT...LON 3477 9222 3491 9231 3493 9227 3493 9223
//       3495 9223 3518 9178 3494 9163
// TIME...MOT...LOC 1940Z 244DEG 44KT 3484 9217
// TORNADO...OBSERVED
// TORNADO DAMAGE THREAT...CATASTROPHIC
// MAX HAIL SIZE...1.00 IN
// $$
// MJ`,
// ];
// text.forEach((text) => {
// processProduct(``);
// });
