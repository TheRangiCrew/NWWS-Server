import { Processor } from "./products/product";
import surreal, { initDB } from "./db/surreal";
import { prisma } from "prisma";
import supabase from "./supabase";

const text = {
       tornado: `
000
WWUS54 KMEG 100038
SVSMEG

Severe Weather Statement
National Weather Service Memphis TN
638 PM CST Sat Dec 9 2023

MSC013-100048-
/O.CAN.KMEG.SV.W.0368.000000T0000Z-231210T0045Z/
Calhoun MS-
638 PM CST Sat Dec 9 2023

...THE SEVERE THUNDERSTORM WARNING FOR SOUTHERN CALHOUN COUNTY IS
CANCELLED...

The severe thunderstorm which prompted the warning has moved out of
the warned area. Therefore, the warning has been cancelled.

A Tornado Watch remains in effect until midnight CST for northeastern
Mississippi.

LAT...LON 3381 8919 3381 8914 3399 8914 3408 8894
      3407 8877 3395 8872 3381 8872 3381 8893
      3376 8893 3375 8903 3374 8904 3374 8919
TIME...MOT...LOC 0038Z 246DEG 49KT 3391 8904

$$

MSC017-100045-
/O.CON.KMEG.SV.W.0368.000000T0000Z-231210T0045Z/
Chickasaw MS-
638 PM CST Sat Dec 9 2023

...A SEVERE THUNDERSTORM WARNING REMAINS IN EFFECT UNTIL 645 PM CST
FOR CHICKASAW COUNTY...

At 638 PM CST, a severe thunderstorm was located over Houston, moving
northeast at 55 mph.

HAZARD...60 mph wind gusts and quarter size hail.

SOURCE...Radar indicated.

IMPACT...Hail damage to vehicles is expected. Expect wind damage to
         roofs, siding, and trees.

Locations impacted include...
Houston, Okolona, Pyland, Trebloc, Houlka, New Houlka, Woodland,
Sparta, Thorn, Van Vleet, Parkersburg, Egypt, Thelma, Tabbville,
McCondy, Anchor, Atlanta, and Buena Vista.

PRECAUTIONARY/PREPAREDNESS ACTIONS...

A Tornado Watch remains in effect until midnight CST for northeastern
Mississippi.

For your protection move to an interior room on the lowest floor of a
building.

&&

LAT...LON 3381 8919 3381 8914 3399 8914 3408 8894
      3407 8877 3395 8872 3381 8872 3381 8893
      3376 8893 3375 8903 3374 8904 3374 8919
TIME...MOT...LOC 0038Z 246DEG 49KT 3391 8904

HAIL THREAT...RADAR INDICATED
MAX HAIL SIZE...1.00 IN
WIND THREAT...RADAR INDICATED
MAX WIND GUST...60 MPH

$$

AC3
       `,
       tstm: `
946
WUUS53 KDMX 311730
SVRDMX
IAC039-053-159-175-311815-
/O.NEW.KDMX.SV.W.0001.230331T1730Z-230331T1815Z/

BULLETIN - IMMEDIATE BROADCAST REQUESTED
Severe Thunderstorm Warning
National Weather Service Des Moines IA
1230 PM CDT Fri Mar 31 2023

The National Weather Service in Des Moines  has issued a

* Severe Thunderstorm Warning for...
  Northwestern Decatur County in south central Iowa...
  Southeastern Union County in south central Iowa...
  Ringgold County in south central Iowa...
  Southwestern Clarke County in south central Iowa...

* Until 115 PM CDT.

* At 1229 PM CDT, a severe thunderstorm was located over Irena, or 12
  miles southwest of Mount Ayr, moving northeast at 50 mph.

  HAZARD...60 mph wind gusts and quarter size hail.

  SOURCE...Radar indicated.

  IMPACT...Hail damage to vehicles is expected. Expect wind damage
           to roofs, siding, and trees.

* This severe thunderstorm will be near...
  Benton and Delphos around 1240 PM CDT.
  Mount Ayr and Mt Ayr Municipal Airport around 1245 PM CDT.

Other locations in the path of this severe thunderstorm include
Kellerton, Tingley, Sun Valley Lake, Ellston, Beaconsfield and Grand
River.

This includes Interstate 35 between mile markers 11 and 20.

PRECAUTIONARY/PREPAREDNESS ACTIONS...

For your protection move to an interior room on the lowest floor of a
building.

A Tornado Watch remains in effect until 800 PM CDT for south central
Iowa.

&&

LAT...LON 4060 9447 4107 9416 4078 9369 4057 9406
      4057 9447
TIME...MOT...LOC 1729Z 220DEG 43KT 4055 9436

HAIL THREAT...RADAR INDICATED
MAX HAIL SIZE...1.00 IN
WIND THREAT...RADAR INDICATED
MAX WIND GUST...60 MPH

$$

Hagenhoff`,
       pns: `
000
NOUS45 KFGZ 301909
PNSFGZ
DCZ001-MDZ003>007-009>011-013-014-016>018-501-502-VAZ021-025>031-
036>040-042-050>057-501-502-WVZ050>055-501>504-182200-

Public Information Statement
National Weather Service Flagstaff AZ
1209 PM MST Thu Nov 30 2023

...OVERNIGHT SNOWFALL REPORTS AS OF 12 PM MST 11/30...

Location                     Amount    Time/Date       Provider

...Arizona...

...Apache County...
Many Farms                   6.0 in    0913 AM 11/30   Public
Chinle                   4.0-6.0 in    0924 AM 11/30   Public
Sawmill                      3.0 in    0730 AM 11/30   Public
Kinlichee                    2.5 in    0701 AM 11/30   Public
Ganado                       2.0 in    0742 AM 11/30   Public
Fort Defiance                1.8 in    0831 AM 11/30   Public
Nutrioso                     1.0 in    0700 AM 11/30   COCORAHS

...Coconino County...
Arizona Snowbowl             4.0 in    0541 AM 11/30   Trained Spotter
4 NNW Arizona Snowbowl       3.5 in    1006 AM 11/30   Trained Spotter
Fort Valley                  3.1 in    0700 AM 11/30   Public
Bellemont (NWS Flagstaff)    2.5 in    0500 AM 11/30   Official NWS Obs
Parks                        2.5 in    1028 AM 11/30   Public
Munds Park                   2.0 in    1015 AM 11/30   Public
Mormon Lake                  1.8 in    0732 AM 11/30   Public
Flagstaff Airport            1.7 in    0500 AM 11/30   Official NWS Obs
Grand Canyon (Desert View)   1.5 in    0715 AM 11/30   COOP
Kachina Village          1.0-1.5 in    0829 AM 11/30   Public
Flagstaff                0.5-1.0 in    0825 AM 11/30   Public
Grand Canyon (South Rim)     1.0 in    0716 AM 11/30   Park/Forest Srvc
Williams                     0.5 in    0738 AM 11/30   Public
Doney Park                   0.2 in    0700 AM 11/30   NWS Employee

...Navajo County...
Shonto                   4.0-6.0 in    0921 AM 11/30   Public
Kayenta                      4.0 in    0726 AM 11/30   Public
Hardrock                     2.5 in    0812 AM 11/30   Public
Pinon                        2.0 in    0942 AM 11/30   Public
Chilchinbito                 1.0 in    0853 AM 11/30   Public
Hotevilla                    0.5 in    0804 AM 11/30   Public

&&

**METADATA**
:11/30/2023,0700 AM, AZ, Apache, Nutrioso 1.9 WSW, , , 33.9418, -109.2412, SNOW_24, 1, Inch, COCORAHS, 24 hour snowfall,
:11/30/2023,0831 AM, AZ, Apache, Fort Defiance, , , 35.740658, -109.07393, SNOW_24, 1.8, Inch, Public, 24 hour snowfall,
:11/30/2023,0742 AM, AZ, Apache, Ganado, , , 35.706304, -109.548298, SNOW_24, 2, Inch, Public, 24 hour snowfall,
:11/30/2023,0701 AM, AZ, Apache, 6 ESE Kinlichee, , , 35.7109, -109.3476, SNOW_24, 2.5, Inch, Public, 24 hour snowfall,
:11/30/2023,0730 AM, AZ, Apache, Sawmill, , , 35.89868, -109.1658, SNOW_24, 3, Inch, Public, 24 hour snowfall,
:11/30/2023,0852 AM, AZ, Apache, Chinle, , , 36.1519, -109.58, SNOW_24, 4, Inch, Public, 24 hour snowfall,
:11/30/2023,0913 AM, AZ, Apache, Many Farms, , , 36.3503, -109.6185, SNOW_24, 6, Inch, Public, 24 hour snowfall,
:11/30/2023,0924 AM, AZ, Apache, Chinle, , , 36.1519, -109.58, SNOW_24, 6, Inch, Public, 24 hour snowfall,
:11/30/2023,0930 AM, AZ, Apache, 8 ENE Chinle, , , 36.184008, -109.440739, SNOW_24, 7, Inch, Public, 24 hour snowfall,
:11/30/2023,0700 AM, AZ, Coconino, Flagstaff 7.7 NE, , , 35.264, -111.5473, SNOW_24, 0.2, Inch, COCORAHS, 24 hour snowfall,
:11/30/2023,0800 AM, AZ, Coconino, Williams 0.4 SW, , , 35.2432, -112.1951, SNOW_24, 0.2, Inch, COCORAHS, 24 hour snowfall,
:11/29/2023,1159 PM, AZ, Coconino, 2 SW Downtown Flagstaff, , , 35.1793, -111.6749, SNOW_24, 0.5, Inch, Trained Spotter, 24 hour snowfall,
:11/30/2023,0738 AM, AZ, Coconino, 4 S Williams, , , 35.21260467602307, -112.1794764157512, SNOW_24, 0.5, Inch, Public, 24 hour snowfall,
:11/30/2023,0800 AM, AZ, Coconino, Flagstaff 2.9 NE, , , 35.2217, -111.6164, SNOW_24, 0.5, Inch, COCORAHS, 24 hour snowfall,
:11/30/2023,0900 AM, AZ, Coconino, Flagstaff 2.1 WSW, , , 35.1739, -111.6805, SNOW_24, 0.5, Inch, COCORAHS, 24 hour snowfall,
:11/30/2023,0700 AM, AZ, Coconino, Flagstaff 2.6 SW, , , 35.1639, -111.6833, SNOW_24, 0.8, Inch, COCORAHS, 24 hour snowfall,
:11/30/2023,0731 AM, AZ, Coconino, Kachina Village, , , 35.097, -111.6919, SNOW_24, 1, Inch, Trained Spotter, 24 hour snowfall,
:11/30/2023,0825 AM, AZ, Coconino, 2 NNW Downtown Flagstaff, , , 35.2258, -111.6581, SNOW_24, 1.0, Inch, Public, 24 hour snowfall,
:11/30/2023,0716 AM, AZ, Coconino, Grand Canyon Village, , , 36.0539, -112.1385, SNOW_24, 1.0, Inch, Park/Forest Srvc, 24 hour snowfall,
:11/30/2023,0952 AM, AZ, Coconino, 1 SW Flagstaff Airport, , , 35.127319112327946, -111.68800904129067, SNOW_24, 1.0, Inch, Public, 24 hour snowfall,
:11/30/2023,0715 AM, AZ, Coconino, Grand Canyon Village 25 E, , , 36.0353, -111.8304, SNOW_24, 1.5, Inch, COOP, 24 hour snowfall,
:11/30/2023,0829 AM, AZ, Coconino, Kachina Village, , , 35.097, -111.6919, SNOW_24, 1.5, Inch, Public, 24 hour snowfall,
:11/30/2023,0500 AM, AZ, Coconino, Flagstaff Airport, , , 35.141523, -111.672511, SNOW_24, 1.7, Inch, Official NWS Obs, 24 hour snowfall,
:11/30/2023,0732 AM, AZ, Coconino, Mormon Lake, , , 34.949152, -111.449086, SNOW_24, 1.8, Inch, Public, 24 hour snowfall,
:11/30/2023,1015 AM, AZ, Coconino, Munds Park, , , 34.94103, -111.64153, SNOW_24, 2, Inch, Public, 24 hour snowfall,
:11/30/2023,0500 AM, AZ, Coconino, Bellemont (NWS Flagstaff), , , 35.230034, -111.821707, SNOW_24, 2.5, Inch, Official NWS Obs, 24 hour snowfall,
:11/30/2023,1028 AM, AZ, Coconino, Parks, , , 35.26318, -111.94954, SNOW_24, 2.5, Inch, Public, 24 hour snowfall,
:11/30/2023,0700 AM, AZ, Coconino, 1 NNW Fort Valley, , , 35.272472985542635, -111.73256172779683, SNOW_24, 3.1, Inch, Public, 24 hour snowfall,
:11/30/2023,1006 AM, AZ, Coconino, 4 NNW Arizona Snowbowl, , , 35.3828, -111.7345, SNOW_24, 3.5, Inch, Trained Spotter, 24 hour snowfall,
:11/30/2023,0541 AM, AZ, Coconino, Arizona Snowbowl, , , 35.330949, -111.710278, SNOW_24, 4, Inch, Trained Spotter, 24 hour snowfall,
:11/30/2023,0804 AM, AZ, Navajo, Hotevilla, , , 35.9238, -110.6576, SNOW_24, 0.5, Inch, Public, 24 hour snowfall,
:11/30/2023,0853 AM, AZ, Navajo, Chilchinbito, , , 36.52799, -110.082194, SNOW_24, 1, Inch, Public, 24 hour snowfall,
:11/30/2023,0942 AM, AZ, Navajo, Pinon, , , 36.101668, -110.222905, SNOW_24, 2, Inch, Public, 24 hour snowfall,
:11/30/2023,0812 AM, AZ, Navajo, Hardrock, , , 36.110755, -110.463565, SNOW_24, 2.5, Inch, Public, 24 hour snowfall,
:11/30/2023,0741 AM, AZ, Navajo, 1 SSE Kayenta, , , 36.7111, -110.2486, SNOW_24, 3.5, Inch, Public, 24 hour snowfall,
:11/30/2023,0726 AM, AZ, Navajo, Kayenta, , , 36.718, -110.2526, SNOW_24, 4, Inch, Public, 24 hour snowfall,
:11/30/2023,0921 AM, AZ, Navajo, 6 SSE Shonto, , , 36.5132, -110.602, SNOW_24, 6, Inch, Public, 24 hour snowfall,

Observations are collected from a variety of sources with varying
equipment and exposures. We thank all volunteer weather observers
for their dedication. Not all data listed are considered official.

$$

Humphreys`,
       PTS12: `
630
WUUS01 KWNS 020601
PTSDY1

DAY 1 CONVECTIVE OUTLOOK AREAL OUTLINE
NWS STORM PREDICTION CENTER NORMAN OK
1200 AM CST THU MAR 02 2023

VALID TIME 021200Z - 031200Z

PROBABILISTIC OUTLOOK POINTS DAY 1

... TORNADO ...

0.02   26679628 29179804 30689903 31629944 32409971 33249935
       33999854 34909731 35899553 36579370 36859017 36748879
       36698861 36208743 33748749 32018796 30418856 28438927
       28138951
0.05   35688863 34278815 33328803 32348844 31418892 30998945
       30859003 30559248 30119519 30239751 31009844 31559864
       32509871 34279751 35059606 35619451 36008999 35688863
0.10   35309023 34998909 34098868 33128862 32718905 32138962
       31929016 31779078 31489218 31009386 30799522 30929645
       31159746 31459789 31709806 32189806 32779793 33529707
       34609557 35209240 35309023
0.15   33879576 34229477 34509377 34569318 34439247 34219204
       33939191 33309200 32239261 31959317 31789397 31689482
       31569560 31789621 32149663 32929662 33399633 33879576
SIGN   35329077 35258976 34978913 34128874 33088866 32078957
       31859048 31669135 31529196 31299276 31029371 30789489
       30769529 30869617 30929654 31109721 31219746 31409786
       31699804 32189806 32769790 33409719 34559555 35159250
       35329077
&&

... HAIL ...

0.05   28479651 28709698 29349840 29670038 30710122 33210076
       35489838 36579678 37339400 37289387 37499151 37428966
       36408763 35098691 34408635 34008628 33868641 33738684
       33348777 31198862 30219054 29809271 29379459 28479651
0.15   30869488 30139748 29769892 30510047 32010014 33529933
       33899849 34839730 35489565 35889114 35858936 35318828
       35038827 33838844 33128866 32599034 31409331 30869488
0.30   33669716 34349605 34669441 34609340 34479296 33819264
       33339271 32669340 32079477 31919584 31829672 32379731
       32809741 33669716
SIGN   32109304 30939556 30319691 30029799 29769895 30640051
       32340000 33499933 34439764 35009429 34549298 33829265
       33319269 32109304
&&

... WIND ...

0.05   27459651 27919758 29119913 29680032 30160066 30850105
       33250051 35319844 36159686 37319403 37519156 37408998
       37248831 36198739 34998676 34338624 34058623 33838642
       33328781 31548849 28428942
0.15   36679027 36598923 36238857 35678829 34958833 33978844
       32848871 31428926 30869018 30389231 29859423 29299541
       28899636 29029703 29349792 29579855 30069941 30699978
       31310001 32199972 33509910 34889730 35539565 36679027
0.30   30639526 30579618 30589697 30629785 30809822 31069844
       31459861 32619826 33669742 34509611 35049430 35479055
       35078959 34198936 32718969 31729053 31169305 30639526
0.45   33339635 33389634 33889575 34069524 34209483 34529380
       34569318 34439240 34219204 33909188 33289201 32829225
       32229262 31949320 31779396 31579562 31769619 32139662
       32949665 33339635
SIGN   30679801 30989832 31519861 32609827 33679740 34489613
       35059432 35259270 35439052 35058996 34279004 33559025
       32789096 31829199 31619245 30989393 30619547 30679801
&&

CATEGORICAL OUTLOOK POINTS DAY 1

... CATEGORICAL ...

MDT    32939662 33379635 33859578 34189488 34509377 34569317
       34419241 34209204 33909189 33299200 32829225 32239261
       31949320 31769403 31679483 31579560 31799622 32149664
       32939662
ENH    34998909 34098868 33128862 32718905 32138962 31729053
       31169305 30639526 30579618 30589697 30629785 30809822
       31069844 31459861 32619826 33669742 34509611 35049430
       35479055 34998909
SLGT   36238857 35678829 34278815 33328803 32348844 31418892
       30998945 30829038 30389231 29859423 29299541 28899636
       29029703 29349792 29779890 29769892 30510047 32010014
       33529933 34889730 35539565 36679027 36598923 36238857
MRGL   27359663 27919758 29119913 29650025 30710122 33210076
       35489838 36579678 37329398 37509156 37428966 37368953
       37248831 36198739 34998676 34338624 33838642 33408759
       32018796 30418856 28468930
TSTM   48832390 47222355 46742482
TSTM   34167588 34217821 34048026 33318307 31888484 29628691
       99999999 26999637 28459919 29260052 30650136 32080107
       33200081 34230127 34770316 35140608 35860721 36800645
       36540314 36679990 37539806 38589642 40149167 40218822
       39738578 38778357 37958275 37278225 36378086 36337854
       36307641 36767479

&&
THERE IS A MDT RISK OF SVR TSTMS TO THE RIGHT OF A LINE FROM 15 ENE
DAL 30 SE GYI 25 NW PRX 30 WNW DEQ 40 W HOT HOT 25 SSW LIT PBF 20 S
PBF 30 SSW LLQ 25 NNW MLU 40 WSW MLU 15 NNW IER 50 SSW SHV 30 N LFK
55 SSW TYR 20 SSE CRS 15 WNW CRS 15 ENE DAL.

THERE IS A ENH RISK OF SVR TSTMS TO THE RIGHT OF A LINE FROM 45 SSW
MKL 15 SSE TUP 35 SSW CBM 30 NNW MEI 50 NNW PIB 35 N MCB 10 NE POE
15 ESE UTS 10 E CLL 35 W CLL 25 NNW AUS 45 NW AUS 60 SSE BWD 30 SE
BWD 15 SW MWL 45 W GYI 35 SW MLC 20 E RKR 25 SSE JBR 45 SSW MKL.

THERE IS A SLGT RISK OF SVR TSTMS TO THE RIGHT OF A LINE FROM 50 NNE
MKL 35 E MKL 35 E TUP 25 WNW TCL 20 E MEI 25 E PIB 35 SSW PIB 25 SSE
MCB 25 WNW LFT 15 WSW BPT 10 NNE LBX 15 NNW PSX 15 NNW VCT 25 SSE
BAZ 30 WNW SAT 30 WNW SAT 40 W JCT 40 SW ABI 55 WSW SPS 40 SSE OKC
20 WSW MKO 15 ESE POF 40 NNE DYR 50 NNE MKL.

THERE IS A MRGL RISK OF SVR TSTMS TO THE RIGHT OF A LINE FROM 60 ESE
CRP 10 NNW CRP 15 S HDO 45 ENE DRT 65 SW SJT 70 ESE LBB 35 NW CHK 20
ESE PNC 30 N UMN 35 ESE TBN 15 NNW CGI 10 NNE CGI 30 ENE PAH 30 S
CKV 25 N HSV 25 NNW GAD 20 WSW GAD 15 N TCL 50 ESE MEI 25 SW MOB 60
S BVE.

GEN TSTMS ARE FCST TO THE RIGHT OF A LINE FROM 55 NNW CLM 25 NE HQM
45 WSW HQM.

GEN TSTMS ARE FCST TO THE RIGHT OF A LINE FROM 75 SSW HSE 20 WSW ILM
30 WSW FLO 45 SSE AHN 45 S CSG 60 SSE PNS ...CONT... 90 SE CRP COT
25 ESE DRT 65 NE 6R6 25 ESE BGS 65 ESE LBB 25 E PVW 30 NNE CVS 30
ENE ABQ 20 SW 4SL 55 SW ALS CAO 65 ESE LBL 35 ENE P28 20 NW EMP 30
WNW UIN 10 NNE CMI 25 E IND 50 ESE LUK 30 SSW HTS 55 N TRI 55 NNE
HKY 35 NNE RDU 15 W ECG 80 E ORF.
`,
       PTS3: `
000
WUUS03 KWNS 280826
PTSDY3

DAY 3 CONVECTIVE OUTLOOK AREAL OUTLINE
NWS STORM PREDICTION CENTER NORMAN OK
0225 AM CST TUE NOV 28 2023

VALID TIME 301200Z - 011200Z

PROBABILISTIC OUTLOOK POINTS DAY 3

... ANY SEVERE ...

0.05   26579661 28249729 29749766 30849749 31819641 32209394
       32019289 31479165 30389122 28399139
0.15   27679602 28739691 30169715 31109651 31559495 31549395
       31009337 29059262
&&

CATEGORICAL OUTLOOK POINTS DAY 3

... CATEGORICAL ...

SLGT   27759614 28789694 30139718 31059651 31549485 31519395
       31039334 29169273
MRGL   26699675 28659741 29749766 30849746 31799644 32209401
       32019282 31459172 30519127 28499141
TSTM   25799891 28479963 30189972 33809885 36079727 37799473
       38019282 37829167 37189068 35788875 34688814 33408841
       30228984 28378993

&&
THERE IS A SLGT RISK OF SVR TSTMS TO THE RIGHT OF A LINE FROM 70 S
PSX VCT 35 ESE AUS 35 NNW CLL 25 NNW LFK 50 ENE LFK 10 W POE 55 SW
7R4.

THERE IS A MRGL RISK OF SVR TSTMS TO THE RIGHT OF A LINE FROM 70 NE
BRO 25 NE NIR 20 E BAZ 20 S TPL 15 S CRS 20 SSW SHV 25 NE IER 25 WSW
HEZ 50 ENE LFT 85 SSW HUM.

GEN TSTMS ARE FCST TO THE RIGHT OF A LINE FROM 50 WSW MFE 25 W COT
25 S JCT 25 WSW SPS 35 NW CQB 40 ENE CNU 40 WNW TBN 20 SSE VIH 30
NNW POF 15 NE MKL 30 W MSL 15 S CBM 10 S ASD 75 SSW BVE.`,
       PTS48: `
000
WUUS48 KWNS 040942
PTSD48

DAY 4-8 CONVECTIVE OUTLOOK AREAL OUTLINE
NWS STORM PREDICTION CENTER NORMAN OK
0341 AM CST MON DEC 04 2023

VALID TIME 071200Z - 121200Z

SEVERE WEATHER OUTLOOK POINTS DAY 4

... ANY SEVERE ...

&&

SEVERE WEATHER OUTLOOK POINTS DAY 5

... ANY SEVERE ...

&&

SEVERE WEATHER OUTLOOK POINTS DAY 6

... ANY SEVERE ...

0.15   29529456 29469481 29649561 30389643 31239669 32109631
       33549529 34939440 35619347 35709227 35459118 34829034
       33969046 31779147 30419229 29909295 29569370 29529456
&&

SEVERE WEATHER OUTLOOK POINTS DAY 7

... ANY SEVERE ...

&&

SEVERE WEATHER OUTLOOK POINTS DAY 8

... ANY SEVERE ...

&&
`
}


const main = async () => {

       // const { data, error } = await supabase.from("AlertHistory").select("text, id").range(300, 400)

       await initDB();
       const product = await new Processor(text.tornado);

       // const segments = await surreal.insert('segments', product.segments.map(segment => {
       //     const obj = segment.toObject;
       //     return { ...obj, product: `products:${product.id.toString()}` }
       // }))

       // const seg = segments.map(segment => {
       //     return segment.id
       // })

       // const exists = await surreal.select(`products:${product.id.toString()}`);

       // console.log("Exists: " + exists);

       // if (exists.length < 1) {
       //     await surreal.insert<ProductObject & { segments: string[] }>(`products`, { ...product.toObject, segments: seg });
       // } else {
       //     await surreal.query("UPDATE products SET segments += $seg, updated_at = time::now()", {
       //         seg: seg
       //     })
       // }

       return;
}

main();