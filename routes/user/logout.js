import database from "../../handler/database.js";

export default async (req,res,next) => {
    const token = req.headers.authorization.split(" ")[1];
    try{
        await database.delete_active_session(token)
    }catch (e){
        const err = new Error(e.message)
        err.status = 500
        return next(err)
    }
    res.status(200).json({message: "OK"})
}