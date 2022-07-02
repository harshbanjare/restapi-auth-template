import 'dotenv/config'
import jwt from 'jsonwebtoken'
import {database} from "../handler/database.js";

export default async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const session_query_snapshot = await database.get_active_session(token);

        console.log(session_query_snapshot)
        if (session_query_snapshot.length !== 1) throw "Invalid Session";

        req.body.userData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        next()
    } catch (e) {
        res.status(401).json({
            message: 'unauthorized'
        })
    }
}

