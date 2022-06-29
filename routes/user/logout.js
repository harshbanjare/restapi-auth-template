import db from "../../firebase.js";

export default async (req,res,next) =>{
    const token = req.headers.authorization.split(" ")[1];

    try{
        const query = db.collection('sessions').where("token","==", token);
        const query_snapshot = await query.get();
        let document_id;
        query_snapshot.forEach(data => {
            document_id = data.id
        })
        await db.collection("sessions").doc(document_id).delete();

    }catch (e){
        const err = new Error(e.message)
        err.status = 500
        return next(err)
    }
    res.status(200).json({message: "OK"})
}