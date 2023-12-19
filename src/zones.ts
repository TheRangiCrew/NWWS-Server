import surreal, { initDB } from "./db/surreal";


fetch("https://www.weather.gov/source/gis/Shapefiles/County/bp19se23.dbx").then(async (response) => {
    const text = await response.text();
    const lines = text.split("\n");

    lines.pop()

    const zones: {
        state: string,
        zone: string,
        name: string,
        id: string,
        counties: string[]
        centre: { type: "Point", coordinates: [number, number] }
    }[] = []

    let currentZone = "";
    let index = -1

    lines.forEach((line) => {
        const segments = line.trim().split("|");

        const state = `states:${segments[0]}`;
        const zone = segments[1];
        const name = segments[3];
        const id = segments[4];
        const county = `counties:${segments[0] + segments[6].slice(2, 5)}`;
        const lat = Number(segments[9]);
        const lon = Number(segments[10]);

        if (id === currentZone) {
            if (zones[index].state != state) {
                throw new Error("UH OH " + index + ", " + zones[index].state + ", " + state)
            }
            zones[index].counties.push(county)
        } else {
            zones.push({
                state,
                zone,
                name,
                id,
                counties: [county],
                centre: {
                    type: "Point",
                    coordinates: [lon, lat]
                }
            })

            currentZone = id;
            index++;
        }

    })

    await initDB();

    const inserted = await surreal.insert("zones", zones)

    zones.forEach(async (zone) => {
        zone.counties.forEach(async (county) => {
            await surreal.merge(county, {
                zone: `zones:${zone.id}`
            }).catch(async (e) => {
                const exists = (await surreal.select(county)).length > 0;

                if (!exists) {
                    const fips = county.slice(county.length - 3, county.length)
                    const name = zone.name;
                    const state = zone.state;
                    const zoned = `zones:${zone.id}`
                    await surreal.insert("counties", {
                        id: state + fips,
                        fips,
                        name,
                        ns: null,
                        state,
                        zone: zoned
                    }).then((result) => {
                        console.log("Inserted " + county)
                    })
                } else {
                    throw e;
                }

            })
        })
        await surreal.query("UPDATE $state SET zones += [$zone]", {
            state: zone.state,
            zone: `zones:${zone.id}`
        }).then((response) => {
            console.log(response)
        })
    })
})