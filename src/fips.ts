import surreal, { initDB } from "./db/surreal";


fetch("https://www2.census.gov/geo/docs/reference/codes2020/national_county2020.txt").then(async (response) => {
    const text = await response.text();
    const lines = text.split("\n");

    lines.shift()
    lines.pop()

    const counties: {
        id: string,
        fips: string,
        ns: string,
        name: string,
        state: string
    }[] = []

    lines.forEach((line) => {
        const segments = line.split("|");

        const state = segments[0]
        const fips = segments[2];
        const id = state + (fips);
        const ns = segments[3];
        const name = segments[4];

        counties.push({
            id,
            fips,
            ns,
            name,
            state: `states:${state}`
        })
    })


    await initDB();

    const inserted = await surreal.insert("counties", counties)

    console.log(inserted)
})