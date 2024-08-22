import { AsyncWrap } from "../utils/AsyncWrap.js";
import { Chapter } from "../models/chapterSchema.js";
import { ErrorAPI } from "../utils/ErrorAPI.js";
import { ResponseAPI } from "../utils/ResponseAPI.js";

const getChapter = AsyncWrap(async (req, res) => {

    const chapters = await Chapter.find()
    if (!Chapter) {
        res.status(503).json(new ErrorAPI(500, "Can Not Get Chapters",))
    }
    res.status(200).json(new ResponseAPI(200, chapters))
})


export { getChapter }