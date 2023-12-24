import surreal from "../../db/surreal";
import { Processor } from "../product"
import { SevereSegment, SevereSegmentObject, createSevereVTECSegments } from "./severe";
import { VTECSegment, VTECSegmentObject } from "./vtecSegment";


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

    let segments: (VTECSegmentObject)[][] = [];
    text.split(/\$\$/g).forEach((segment) => {
        if (segment.length <= 20) {
            return;
        }

        switch (product.awips.product) {
            case "SVR":
            case "TOR":
            case "SVS":
            case "SMW":
                segments.push(createSevereVTECSegments(segment));
                break;
        }
    });

    segments.forEach(async (segment) => {

        segment.forEach(async (v) => {

            const id = v.vtec.wfo + v.vtec.phenomena.toString() + v.vtec.significance.toString() + v.vtec.eventNumber.toString().padStart(4, "0") + v.vtec.start.year

            const [result] = await surreal.create("vtec_segments", { ...v, vtec_id: id, vtec: v.vtec.toObject, ugc: v.ugc.toString() })

            console.log(result.id)

            v.ugc.toDBObject.counties.forEach(async (c) => {
                await surreal.query(`RELATE ${result.id}->vtec_county_zones->${c};`)
            })
        })

    })

}

export default vtecProduct