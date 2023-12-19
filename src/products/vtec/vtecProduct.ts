import { Processor } from "../product"
import { SevereSegment } from "./severe";


const vtecProduct = async (text: string, product: Processor) => {
    // Get BIL
    const bilregex = /^(BULLETIN - |URGENT - |EAS ACTIVATION REQUESTED|IMMEDIATE BROADCAST REQUESTED|FLASH - |REGULAR - |HOLD - |TEST...)(.*)/gm;
    const bil = text.match(bilregex);

    let broadcast_line: string | null = null

    if (bil != null) {
        broadcast_line = bil[0];
    }

    const iolregex = /^(NATIONAL WEATHER SERVICE |National Weather Service )(.*)/gm;
    let issuing_office_line = text.match(iolregex)![0];

    const iobregex = /^(ISSUED BY NATIONAL WEATHER SERVICE |Issued By National Weather Service )(.*)/gm;
    const iob = text.match(iobregex);

    let issuing_office_backup: string | null = null;

    if (iob != null) {
        issuing_office_backup = iob[0];
    }

    const idtregex = /^[0-9]{3,4} (AM|PM) [A-Z]{3,4} ([A-Za-z]{3} ){2}[0-9]{1,2} [0-9]{4}/gm;
    let issuing_datetime = text.match(idtregex)![0];

    let segments: SevereSegment[] = [];
    text.split(/\$\$/g).forEach((segment) => {
        if (segment.length <= 20) {
            return;
        }

        switch (product.awips.product) {
            case "SVR":
            case "TOR":
            case "SVS":
            case "SMW":
                segments.push(new SevereSegment(segment));
                break;
        }
    });

    segments.forEach((segment) => {
        const id = segment.vtec.wfo + segment.vtec.phenomena.toString() + segment.vtec.significance.toString() + segment.vtec.eventNumber.toPrecision(4) + segment.vtec.start.year

    })
}

export default vtecProduct