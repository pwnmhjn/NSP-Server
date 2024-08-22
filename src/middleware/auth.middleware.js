import { User } from "../models/userSchema.js"
import jwt from "jsonwebtoken"
import { ErrorAPI } from "../utils/ErrorAPI.js";


export const verifyJwt = async (req, _, next) => {
    try {
        const authToken =
            req.headers?.authorization ||
            req.headers?.Authorization ||
            req.body?.accessToken ||
            req.cookies?.accessToken;
        if (!authToken?.startsWith("Bearer ")) {
            throw new ErrorAPI(401, "No Token")
        }
        const token = authToken.split(" ")[1];
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decode._id)
        if (!user) {
            throw new ErrorAPI(500, "Did Not Get any User")
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
};


