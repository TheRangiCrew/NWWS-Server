/**
 * @interface
 * An interface for a decoded VTEC from NWS products.
 * 
 * @info https://www.weather.gov/bmx/vtec
 */
export interface VTEC {
    /** 
    * The product class
    * 
    * - `O` = Operational Product
    * - `T` = Test Product
    * - `E` = Experimental Product
    * - `X` = Experimental VTEC in Operation Product
    * 
    * @type {string}
    * 
    * @info https://www.weather.gov/bmx/vtec
    *
    */
    productClass: "O" | "T" | "E" | "X",
    /** 
     * 
     * NEW New event
     * CON Event continued
     * EXT Event extended (time)
     * EXA Event extended (area)
     * EXB Event extended (both time and area)
     * UPG Event upgraded
     * CAN Event cancelled
     * EXP Event expired
     * COR Correction
     * ROU Routine
     * 
    **/
    action: "NEW" | "CON" | "EXT" | "EXA" | "EXB" | "UPG" | "CAN" | "EXP" | "COR" | "ROU",
    office: string,
    /**
     * 
     * AF Ashfall (land)
     * AS Air Stagnation
     * BH Beach Hazard
     * BW Brisk Wind
     * BZ Blizzard
     * CF Coastal Flood
     * DF Debris Flow
     * DS Dust Storm
     * EC Extreme Cold
     * EH Excessive Heat
     * EW Extreme Wind
     * FA Flood
     * FF Flash Flood
     * FG Dense Fog (land)
     * FL Flood (forecast point)
     * FR Frost
     * FW Fire Weather
     * FZ Freeze
     * GL Gale
     * HF Hurricane Force Wind
     * HT Heat
     * HU Hurricane
     * HW High Wind
     * HY Hydrologic
     * HZ Hard Freeze
     * IS Ice Storm
     * LE Lake Effect Snow
     * LO Low Water
     * LS Lakeshore Flood
     * LW Lake Wind
     * MA Marine
     * MF Dense Fog (marine)
     * MH Ashfall (marine)
     * MS Dense Smoke (marine)
     * RB Small Craft for Rough Bar
     * RP Rip Current Risk
     * SC Small Craft
     * SE Hazardous Seas
     * SI Small Craft for Winds
     * SM Dense Smoke (land)
     * SQ Snow Squall
     * SR Storm
     * SS Storm Surge
     * SU High Surf
     * SV Severe Thunderstorm
     * SW Small Craft for Hazardous Seas
     * TO Tornado
     * TR Tropical Storm
     * TS Tsunami
     * TY Typhoon
     * UP *(Heavy) Freezing Spray
     * WC Wind Chill
     * WI Wind
     * WS Winter Storm
     * WW Winter Weather
     * ZF Freezing Fog
     * ZR Freezing Rain
     * 
     */
    phenomena: string,
    significance: "W" | "A" | "Y" | "S" | "F" | "O" | "N",
    number: number,
    start: Date,
    end: Date
}

/** 
    * The product class
    * 
    * - `O` = Operational Product
    * - `T` = Test Product
    * - `E` = Experimental Product
    * - `X` = Experimental VTEC in Operation Product
    * 
    * @type {string}
    * 
    * @info https://www.weather.gov/bmx/vtec
    *
    */
export type VTECProductClass = "O" | "T" | "E" | "X";
/** 
     * 
     * 
     * - `NEW` New event
     * - `CON` Event continued
     * - `EXT` Event extended (time)
     * - `EXA` Event extended (area)
     * - `EXB` Event extended (both time and area)
     * - `UPG` Event upgraded
     * - `CAN` Event cancelled
     * - `EXP` Event expired
     * - `COR` Correction
     * - `ROU` Routine
     * 
    **/
export type VTECAction = "NEW" | "CON" | "EXT" | "EXA" | "EXB" | "UPG" | "CAN" | "EXP" | "COR" | "ROU";
/**
     * 
     * - `AF` Ashfall (land)
     * - `AS` Air Stagnation
     * - `BH` Beach Hazard
     * - `BW` Brisk Wind
     * - `BZ` Blizzard
     * - `CF` Coastal Flood
     * - `DF` Debris Flow
     * - `DS` Dust Storm
     * - `EC` Extreme Cold
     * - `EH` Excessive Heat
     * - `EW` Extreme Wind
     * - `FA` Flood
     * - `FF` Flash Flood
     * - `FG` Dense Fog (land)
     * - `FL` Flood (forecast point)
     * - `FR` Frost
     * - `FW` Fire Weather
     * - `FZ` Freeze
     * - `GL` Gale
     * - `HF` Hurricane Force Wind
     * - `HT` Heat
     * - `HU` Hurricane
     * - `HW` High Wind
     * - `HY` Hydrologic
     * - `HZ` Hard Freeze
     * - `IS` Ice Storm
     * - `LE` Lake Effect Snow
     * - `LO` Low Water
     * - `LS` Lakeshore Flood
     * - `LW` Lake Wind
     * - `MA` Marine
     * - `MF` Dense Fog (marine)
     * - `MH` Ashfall (marine)
     * - `MS` Dense Smoke (marine)
     * - `RB` Small Craft for Rough Bar
     * - `RP` Rip Current Risk
     * - `SC` Small Craft
     * - `SE` Hazardous Seas
     * - `SI` Small Craft for Winds
     * - `SM` Dense Smoke (land)
     * - `SQ` Snow Squall
     * - `SR` Storm
     * - `SS` Storm Surge
     * - `SU` High Surf
     * - `SV` Severe Thunderstorm
     * - `SW` Small Craft for Hazardous Seas
     * - `TO` Tornado
     * - `TR` Tropical Storm
     * - `TS` Tsunami
     * - `TY` Typhoon
     * - `UP` *(Heavy) Freezing Spray
     * - `WC` Wind Chill
     * - `WI` Wind
     * - `WS` Winter Storm
     * - `WW` Winter Weather
     * - `ZF` Freezing Fog
     * - `ZR` Freezing Rain
     * 
     */
export type VTECPhenomena = string;
/**
 * - `W` Warning
 * - `A` Watch
 * - `Y` Advisory
 * - `S` Statement
 */
export type VTECSignificance = "W" | "A" | "Y" | "S";
