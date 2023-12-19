import surreal, { initDB } from "./db/surreal";


fetch("https://www2.census.gov/geo/docs/reference/codes2020/national_state2020.txt").then(async (response) => {
    const text = await response.text();
    const lines = text.split("\n");

    lines.shift()
    lines.pop()

    const states: {
        id: string,
        fips: string,
        ns: string,
        name: string,
        abbreviation: string,
        zones: []
    }[] = []

    lines.forEach((line) => {
        const segments = line.split("|");

        const id = segments[0];
        const fips = segments[1];
        const ns = segments[2];
        const name = segments[3];

        states.push({
            id,
            fips,
            ns,
            name,
            abbreviation: id,
            zones: []
        })
    })


    await initDB();

    const inserted = await surreal.insert("states", states)

    console.log(inserted)
})