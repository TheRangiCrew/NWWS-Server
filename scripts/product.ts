import { VTEC, vtec } from "./vtec";
import { geometry } from "./geometry";
import { TML, tml } from "./tml";
import { UGC, ugc } from "./ugc";
import { pushProduct } from "./push";
import { AWIPS } from "./awips";
import { Tags, getTags } from "./tags";

const wanted = [
  "TOR",
  "SVR",
  "SVS",
  "FFW",
  "SMW",
  "SPS",
  "MWS"
]

const getWMO = (text: string): string => {
  const header = text.match(/([0-9A-Z]{6,6})\s([A-Z]{4,4})\s([0-9]{6,6})/g);
  if (header === null) {
    throw new Error("Could not find a WMO header");
  }
  return header.toString();
};

const getAWIPS = (text: string): AWIPS | null => {
  const awips = text.match(new RegExp(/^([A-Z0-9]{4,6})$/, 'gm'));
  if (awips === null) {
    return null
  }

  return new AWIPS(awips[0]);
};

const getHeadlines = (text: string): string[] => {
  const matches = [...text.matchAll(/^\.\.\.(.*?)\.\.\.[ ]?\n\n/gms)];
  const headlines: string[] = [];
  matches.forEach((element) => {
    headlines.push(element[0]);
  });

  return headlines;
};

const getHazard = (text: string): string | null => {
  const newText = text.split("\n");
  const index = newText.findIndex((element) => element.match(/(HAZARD)\.\.\./g));
  if (index === -1) {
    return null;
  }
  const hazard = newText[index].split("...")

  if (hazard.length < 2) {
    return null
  }

  return hazard[1].replace(/\./g, "");
};

/**
 * Finds any `SOURCE...` lines and returns them or `null`
 * 
 * @param text The product
 * @returns The source of the product or `null`
 */
const getSource = (text: string): string | null => {
  const newText = text.split(/\n\n/g);
  const index = newText.findIndex((element) => element.match(/(SOURCE)\.\.\./g));
  if (index === -1) {
    return null;
  }

  const sourceArray = newText[index].split("...")

  if (sourceArray.length < 2) {
    return null;
  }

  let source = sourceArray[1].replace(/[\n  ]{2}/g, "")

  return source.slice(0, source.length - 1);
};

/**
 * Finds any `IMPACT(S)...` lines and returns them or `null`
 * 
 * @param text The product
 * @returns The impacts or `null`
 */
const getImpact = (text: string): string | null => {
  const newText = text.split(/\n\n/g);
  const index = newText.findIndex((element) => element.match(/(IMPACT|IMPACTS)\.\.\./g));
  if (index === -1) {
    return null;
  }

  const impact = newText[index].split("...")[1].replace(/[\n  ]{2}/g, "")

  return impact;
};

const getPPA = (text: string): string | null => {
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

export class Segment {
  #original: string;
  #ugc: UGC | null
  #vtec: VTEC | null;
  #eas: boolean
  #headlines: string[];
  #geometry: number[][] | null;
  #tml: TML | null;
  #hazard: string | null;
  #source: string | null;
  #impact: string | null;
  #ppa: string | null;
  #emergency: boolean;
  #pds: boolean;
  #tags: Tags

  constructor(text: string) {
    this.#original = text;
    this.#ugc = ugc.parse(text);
    this.#vtec = vtec.parse(this.#original)
    this.#eas = text.match(/(EAS)/g) != null ? true : false
    this.#geometry = geometry.parse(this.#original);
    this.#headlines = getHeadlines(this.#original);
    this.#tml = tml.parse(text);
    this.#hazard = getHazard(text);
    this.#source = getSource(text);
    this.#impact = getImpact(text);
    this.#ppa = getPPA(text);
    this.#emergency =
      text.match(/(TORNADO|FLASH\s+FLOOD)\s+EMERGENCY/g) != null ? true : false;
    this.#pds =
      text.match(/This\s+is\s+a\s+PARTICULARLY\s+DANGEROUS\s+SITUATION/g) !=
      null
        ? true
        : false;
    this.#tags = getTags(text)
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
      tags: this.#tags
    };
  };

  toString = (): string => {
    return `${this.#vtec}\n\n${this.#headlines.toString()}\n...EMERGENCY...${
      this.#emergency
    }\n\n`;
  };
}

export const processProduct = (product: string) => {
  const wmoHeader = getWMO(product);
  const awips = getAWIPS(product);

  if (awips === null || !wanted.includes(awips.get().product)) {
    return
  }

  const segments = product.split(/\$\$/g).map((segment) => {
    if (segment.length > 20) {
      return new Segment(segment);
    }
  });

  segments.pop()

  segments.forEach((segment) => {
    console.log(awips.get().product)
    console.log(awips.get().wfo)

    // Only get vtec products
    if (segment?.get().vtec === null) {
      return
    }

    switch (segment?.get().vtec?.get().action) {
        case "NEW":
            console.log("New Product");
            pushProduct["NEW"](segment, wmoHeader, awips.toString())
            break;
        case "CON":
            console.log("Continued");
            pushProduct["CON"](segment, wmoHeader)
            break;
        case "CAN":
            console.log("Cancelled")
            pushProduct["CON"](segment, wmoHeader)
            break;
        case "EXP":
          console.log("Expired")
          pushProduct["CON"](segment, wmoHeader)
          break;
    }
  });
};
