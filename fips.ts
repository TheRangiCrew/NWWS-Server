// import fs from 'fs'

// fs.readFile('states.json', async (err, data) => {

//     const states: [{
//         number: number,
//         name: string,
//         abbr: string
//     }] = JSON.parse(data.toString())

//     fs.readFile('product.txt', async (err, data) => {
//         const string = data.toString()
        
//         let sql = ""
//         let json = []
    
//         string.trim().split(/\n/g).forEach((element) => {
//             const array = element.split(/\n/g).forEach((line) => {
//                 const string = line.split("|")
//                 const numRaw = string[1]
//                 const stateNum = Number(numRaw.slice(0,2))
//                 const state = string[0]
//                 const number = Number(numRaw.slice(numRaw.length-3, numRaw.length))
//                 const name = string[2]
//                 console.log({
//                     name,
//                     numRaw,
//                     number,
//                     state,
//                     stateNum
//                 })

//                 sql += ` ('${name}', '${numRaw}', ${number}, '${state}', ${stateNum}),`
//                 json.push({
//                     name,
//                     numRaw,
//                     number,
//                     state,
//                     stateNum
//                 })
//             })
//         })
    
//         fs.appendFile('counties.sql', sql, (err) => {
//             if (err) throw err;
//             console.log('Saved!');
//         })

//         fs.appendFile('counties.json', JSON.stringify(json), (err) => {
//             if (err) throw err;
//             console.log('Saved!');
//         })
//     })
// })