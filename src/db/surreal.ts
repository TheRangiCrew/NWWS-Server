import { Surreal } from "surrealdb.js";
import * as dotenv from 'dotenv'

dotenv.config()

const url = process.env.SURREAL_URL!;
const ns = process.env.SURREAL_NS!;
const db = process.env.SURREAL_DB!;
const user = process.env.SURREAL_USERNAME!;
const pass = process.env.SURREAL_PASSWORD!;

const surreal = new Surreal();

export const initDB = async () => {
    await surreal.connect(url, {
        namespace: ns,
        database: db,
        auth: {
            username: user,
            password: pass
        }
    }).then(async () => {
        console.log("\x1b[32m%s\x1b[0m", "DB connected...")
    })
}

export default surreal;