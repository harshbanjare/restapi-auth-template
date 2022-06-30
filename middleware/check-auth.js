import 'dotenv/config'
import jwt from 'jsonwebtoken'
import db from "../handler/database/firebase/firebase.js";
export default async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];

        const session_query_snapshot = await db.collection("sessions").where("token", "==", token).get();

        if (session_query_snapshot.size !== 1) throw "Invalid Session";

        req.body.userData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        next()
    }catch (e){
        res.status(401).json({
            message: 'unauthorized'
        })
    }
}

