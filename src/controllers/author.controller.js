import { AsyncWrap } from "../utils/AsyncWrap.js";
import { Author } from "../models/authorSchema.js";
import { ErrorAPI } from "../utils/ErrorAPI.js";
import { ResponseAPI } from "../utils/ResponseAPI.js";

const getAuthors = AsyncWrap(async (req, res) => {
    const authors = await Author.find()
    if (!authors) {
        throw new ErrorAPI(503, "Could not get Users")
    }
    res.status(200).json(new ResponseAPI(200, authors, null))
})

const getAuthorInfo = AsyncWrap(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ErrorAPI(501, "Could not get User")
    }
    const author = await Author.findById(id)
    if (!author) {
        throw new ErrorAPI(503, "Could not get Users")
    }

    res.status(200).json(new ResponseAPI(200, author, null))

})

export { getAuthors, getAuthorInfo }



