import fsPromise from "fs/promises"
import path from "path"
import crypto from "crypto";
import { format } from "date-fns"

const logEvent = async (message, filename) => {
    const date = format(Date.now(), "dd-MMMM-yyyy")
    // const month = format(Date.now(), "MMMM")
    const day = format(Date.now(), "EEEE")
    const time = format(Date.now(), "pp")
    const id = crypto.randomBytes(8).toString("hex")
    const line = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";
    const logItem = `Id:- ${id}\nTime:- ${time}\nDay:- ${day}\nDate:- ${date}\n${message}\n${line}\n`
    try {
        await fsPromise.appendFile(path.join(import.meta.dirname, "..", "..", "logs", filename), logItem)
    } catch (error) {
        console.log(error)

    }

}

export default logEvent

